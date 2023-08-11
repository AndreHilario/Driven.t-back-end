import { SignInParams, SignInParamsOAuth } from "@/services";
import Joi from "joi";

export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const signInGithubSchema = Joi.object<SignInParamsOAuth>({
  githubCode: Joi.string().required(),
});