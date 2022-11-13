import styled from "@emotion/styled";
import IMAGE from "../public/img.png";
import IMAGE2 from "../public/img2.png";
import { CustomImage } from "../src/components/index/CustomImage";
import { SignInBtn } from "../src/components/index/SignInBtn";

const width = "600px";

export default function OG() {
  return (
    <Container>
      <Section>
        <CustomImage {...{ width }} src={IMAGE2} />
      </Section>

      <Text>1️⃣ Open a PR with the ticket number 🤝</Text>
      <Text>2️⃣ Get an automatic comment 🤟</Text>
      <Section>
        <CustomImage {...{ width }} src={IMAGE} />
      </Section>
      <SignInBtn />
    </Container>
  );
}

const Container = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 25px;
`;

const Section = styled.div`
  position: relative;
`;

const Text = styled.p`
  font-weight: 600;
  transition: 0.5s;
  font-size: 26px;
  margin: 0;
`;
