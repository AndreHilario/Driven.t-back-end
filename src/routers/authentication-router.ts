import { singInPost, singInPostGithub } from "@/controllers";
import { validateBody } from "@/middlewares";
import { signInGithubSchema, signInSchema } from "@/schemas";
import { Router } from "express";

const authenticationRouter = Router();

authenticationRouter.post("/sign-in", validateBody(signInSchema), singInPost);
authenticationRouter.post("/sign-in/github", validateBody(signInGithubSchema), singInPostGithub);

export { authenticationRouter };
