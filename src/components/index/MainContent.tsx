import { Button } from "@chakra-ui/react";
import styled from "@emotion/styled";
import IMAGE from "../../../public/img1.png";
import IMAGE2 from "../../../public/img2.png";
import { CustomImage } from "./CustomImage";
import { GithubSVG, SignInBtn } from "./SignInBtn";

export const MainContent = () => {
  return (
    <Container>
      <Section>
        <CustomImage src={IMAGE2} />
        <Text1>1️⃣ Open a PR with the ticket number 🤝</Text1>
      </Section>
      <p style={{ fontSize: 40 }}>☝️</p>
      <Section>
        <CustomImage src={IMAGE} />
        <Text2>2️⃣ Get an automatic comment 🤟</Text2>
      </Section>

      <BoxForLinks>
        <Button
          href="https://github.com/apps/jira-ticket-bot/installations/new"
          as="a"
          size="md"
          colorScheme="gray"
          style={{ width: 200 }}
          rightIcon={<GithubSVG />}
        >
          Install
        </Button>
        <Divider> / </Divider>
        <SignInBtn />
      </BoxForLinks>
    </Container>
  );
};

const BoxForLinks = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 50px;
`;

const Divider = styled.p`
  display: flex;
  align-items: center;
`;

const Container = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 40px;
`;

const Section = styled.div`
  position: relative;
`;

const AbsoluteText = styled.p`
  position: absolute;
  font-weight: 600;
  transition: 0.5s;
`;

const Text1 = styled(AbsoluteText)`
  bottom: -60px;
  left: -150px;

  @media (max-width: 910px) {
    left: 0px;
    bottom: -40px;
  }
`;

const Text2 = styled(AbsoluteText)`
  top: -50px;
  right: 65px;

  @media (max-width: 910px) {
    top: -40px;
    right: 0px;
  }
`;
