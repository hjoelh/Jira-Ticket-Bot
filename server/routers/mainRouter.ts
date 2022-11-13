import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../prisma";
import { getOctokit } from "../../src/getOctokit";
import { GithubAccessTokenResponse } from "../../src/types";
import { publicProcedure, router } from "../trpc";

export const appRouter = router({
  auth: publicProcedure
    .input(
      z.object({
        githubCode: z.string(),
        githubState: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const client_id = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
      const client_secret = process.env.GITHUB_CLIENT_SECRET;
      const redirect_uri = process.env.NEXT_PUBLIC_CALLBACK_URL;

      const json = await fetch(
        `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${input.githubCode}&state=${input.githubState}&redirect_uri=${redirect_uri}`,
        {
          method: "POST",
          headers: {
            accept: "application/vnd.github.v3+json",
          },
        }
      );

      return (await json.json()) as GithubAccessTokenResponse;
    }),

  installations: publicProcedure
    .input(
      z.object({
        githubAccessToken: z.string(),
      })
    )
    .query(async ({ input }) => {
      const octokit = getOctokit(input.githubAccessToken);
      const { data } = await octokit.request("GET /user/installations");
      return data;
    }),

  installationById: publicProcedure
    .input(
      z.object({
        githubAccessToken: z.string(),
        installationId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const octokit = getOctokit(input.githubAccessToken);
      const { data } = await octokit.request("GET /user/installations");

      const installationInfo = data.installations.find(
        (i) => i.id === input.installationId
      );

      if (!installationInfo) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }

      const installationSettings = await db.installations.findUnique({
        where: {
          installationId: installationInfo.id,
        },
      });

      return {
        ...installationSettings,
        account: {
          login: installationInfo.account?.login,
          type: installationInfo.account?.type,
        },
      };
    }),

  delete: publicProcedure
    .input(
      z.object({
        githubAccessToken: z.string(),
        installationId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const octokit = getOctokit(input.githubAccessToken);

      const { data } = await octokit.request("GET /user/installations");

      const matchingInstallation = data?.installations?.find(
        (installation) => installation.id === input.installationId
      );

      if (!matchingInstallation) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }

      const deletedItem = await db.installations.delete({
        where: {
          installationId: input.installationId,
        },
      });

      return deletedItem;
    }),

  update: publicProcedure
    .input(
      z.object({
        githubAccessToken: z.string(),
        installationId: z.number(),
        fields: z.object({
          domain: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const octokit = getOctokit(input.githubAccessToken);

      const { data } = await octokit.request("GET /user/installations");

      const matchingInstallation = data?.installations?.find(
        (installation) => installation.id === input.installationId
      );

      if (!matchingInstallation) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }

      const upserted = await db.installations.upsert({
        where: {
          installationId: input.installationId,
        },
        update: {
          ...input.fields,
        },
        create: {
          installationId: input.installationId,
          ...input.fields,
        },
      });

      return upserted;
    }),
});

export type AppRouter = typeof appRouter;
