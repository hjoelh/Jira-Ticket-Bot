import { Button, Heading } from "@chakra-ui/react";
import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";
import { useGlobalStore } from "../../useGlobalStore";

const Header = () => {
  const user = useGlobalStore((s) => s.user);
  const setUser = useGlobalStore((s) => s.setUser);
  const isLoggedIn = !!user;

  const { pathname, push } = useRouter();

  return (
    <StyledHeader>
      <StyledHeading>Jira Ticket Bot</StyledHeading>

      {isLoggedIn && pathname !== "/" && (
        <SignOutButtonBox>
          <Button
            onClick={() => {
              setUser(null);
              push("/");
            }}
            size="md"
            colorScheme="gray"
          >
            Sign out
          </Button>
        </SignOutButtonBox>
      )}

      {pathname !== "/settings" && pathname !== "/" && isLoggedIn && (
        <InstallationsButtonBox>
          <Link href="/settings">
            <Button size="md" colorScheme="gray">
              Installations
            </Button>
          </Link>
        </InstallationsButtonBox>
      )}
    </StyledHeader>
  );
};

export { Header };

export const HEADER_HEIGHT = "75px";

const StyledHeader = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: ${HEADER_HEIGHT};
  position: relative;
`;

const StyledHeading = styled(Heading)`
  font-size: 55px;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(
    135deg,
    #0155cf 1.93%,
    #0052cc 14.86%,
    #005be1 48.09%,
    #005de7 77.82%,
    #2684ff 97.3%
  );

  @media (max-width: 480px) {
    font-size: 35px;
  }
`;

const SignOutButtonBox = styled.div`
  position: absolute;
  right: 0px;
  visibility: visible;
  width: fit-content;
  @media (max-width: 725px) {
    visibility: hidden;
  }
`;

const InstallationsButtonBox = styled(SignOutButtonBox)`
  left: 0;
`;
