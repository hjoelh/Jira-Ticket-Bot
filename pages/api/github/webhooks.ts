import { PrismaClient } from "@prisma/client";
import { createNodeMiddleware, createProbot, Probot } from "probot";

const db = new PrismaClient();

const bot = (app: Probot) => {
  app.on("pull_request.opened", async (context) => {
    log(`PR opened`);

    const issueId =
      context.payload.pull_request.title.match(JIRA_ISSUE_REGEX)?.[0];

    if (!issueId) return log("PR title does not contain an issue id");

    const installationInfo = await db.installations.findFirst({
      where: {
        installationId: context!.payload!.installation!.id,
      },
    });

    if (installationInfo === null) {
      const issueComment = context.issue({
        body: "Sorry, I'm missing some details. Please update your config here:\nhttps://jira-ticket-bot.app ",
      });

      await context.octokit.issues.createComment(issueComment);
      return;
    }

    const issueComment = context.issue({
      body: generateJiraLink(issueId, installationInfo.domain),
    });

    await context.octokit.issues.createComment(issueComment);
  });
};

// -- helpers

const log = console.log;

const JIRA_ISSUE_REGEX = /[A-Z]{2,}-\d+/g;

const generateJiraLink = (issueId: string, domain: string) =>
  `https://${domain}.atlassian.net/browse/${issueId}`;

//----------------------------------------------------------------------

module.exports = createNodeMiddleware(bot, {
  probot: createProbot(),
  webhooksPath: "/api/github/webhooks",
});
