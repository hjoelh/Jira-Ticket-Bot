import { Octokit } from "octokit";

export const getOctokit = (auth: string) =>
  new Octokit({
    auth,
  });
