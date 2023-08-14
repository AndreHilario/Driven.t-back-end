import authenticationService, { SignInParams, SignInParamsOAuth } from "@/services/authentication-service";
import { Request, Response } from "express";
import httpStatus from "http-status";
export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

export async function singInPostGithub(req: Request, res: Response) {
  const { githubCode } = req.body as SignInParamsOAuth;
 
  try {
    const result = await authenticationService.signInWithGitHub(githubCode);
    
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}
