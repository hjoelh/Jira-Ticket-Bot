import Link from "next/link";
import { Button, Tag } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useGlobalStore } from "../src/useGlobalStore";
import { Spinner } from "../src/components/shared/Spinner";
import { trpc } from "../src/trpc";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Link as ExternalLink } from "@chakra-ui/react";

export default function Page() {
  const user = useGlobalStore((s) => s.user!);

  const { data: installations } = trpc.installations.useQuery({
    githubAccessToken: user.access_token,
  });

  return (
    <Container>
      <Title>
        <strong>Installations</strong>
        <Tag>{installations?.total_count}</Tag>
      </Title>

      <ExternalLink
        textAlign="center"
        href="https://github.com/apps/jira-ticket-bot/installations/new"
        isExternal
        paddingTop="2"
        paddingBottom="5"
        fontSize="sm"
      >
        New Installation
        <ExternalLinkIcon mx="2px" />
      </ExternalLink>

      {!installations ? (
        <Spinner />
      ) : (
        <>
          <StyledTable>
            <tbody>
              {installations?.installations?.map((installation) => (
                <tr key={installation.id}>
                  <td>{installation.account?.login}</td>
                  <td>
                    <Tag>GitHub {installation.account?.type}</Tag>
                  </td>
                  <td>
                    <Link href={`/settings/${installation.id}`}>
                      <Button size="sm" colorScheme="blue">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </>
      )}
    </Container>
  );
}

const Title = styled.h3`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

const StyledTable = styled.table`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  td {
    padding: 10px 25px;
  }
`;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
