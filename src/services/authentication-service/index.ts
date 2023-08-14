import sessionRepository from "@/repositories/session-repository";
import userRepository from "@/repositories/user-repository";
import { exclude } from "@/utils/prisma-utils";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { invalidCredentialsError } from "./errors";
import axios from "axios";
import queryString from "qs";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

async function signInWithGitHub(githubCode: string): Promise<SignInGitResult> {
  const tokenGithub = await exchangeCodeForAccessToken(githubCode);

  const githubUserData = await getGitHubUserData(tokenGithub);
  if (!githubUserData) {
    throw new Error("Failed to fetch GitHub user data");
  }
  const fakePassword = generateFakePassword();
  const user = await userRepository.getUserOrCreate(githubUserData, fakePassword);
  const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

  await sessionRepository.create({
    token: jwtToken,
    userId: user.id
  });

  return {
    user: exclude(user, "password"),
    token: jwtToken,
  };
}


async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, "password"),
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

async function exchangeCodeForAccessToken(code: string) {
  const GITHUB_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";

  const { REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = process.env;
  const params: GitHubParamsForAccessToken = {
    code,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URL,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  }

  const { data } = await axios.post(GITHUB_ACCESS_TOKEN_URL, params, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const { access_token } = queryString.parse(data);

  return Array.isArray(access_token) ? access_token.join("") : access_token;
}

async function getGitHubUserData(accessToken: string | queryString.ParsedQs) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await axios.get('https://api.github.com/user', { headers });
  return response.data;
}

function generateFakePassword() {
  const passwordLength = 10; 
  const randomBytes = crypto.randomBytes(passwordLength);
  const randomPassword = randomBytes.toString('hex');
  return randomPassword;
}

export type SignInParams = Pick<User, "email" | "password">;
export type SignInParamsOAuth = {
  githubCode: string
};

type SignInResult = {
  user: Pick<User, "id" | "email">;
  token: string;
};

type SignInGitResult = {
  user: Pick<User, "id" | "email">;
  token: string | queryString.ParsedQs;
};

type GitHubParamsForAccessToken = {
  code: string;
  grant_type: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
};

type GetUserOrFailResult = Pick<User, "id" | "email" | "password">;

const authenticationService = {
  signIn,
  signInWithGitHub
};

export default authenticationService;
export * from "./errors";
