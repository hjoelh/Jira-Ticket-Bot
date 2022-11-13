import { CheckIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { DeleteAllDataBtn } from "../../src/components/installation/DeleteAllDataBtn";
import { Spinner } from "../../src/components/shared/Spinner";
import { trpc } from "../../src/trpc";
import { useGlobalStore } from "../../src/useGlobalStore";
import { SettingsIcon } from "@chakra-ui/icons";

const initInputs = {
  domain: "",
};

export default function Page() {
  const router = useRouter();
  const user = useGlobalStore((s) => s.user!);

  const {
    register,
    handleSubmit,
    reset: resetForm,
    watch: watchForm,
  } = useForm<typeof initInputs>({
    defaultValues: initInputs,
  });

  const {
    data: installationSettings,
    isFetchedAfterMount,
    refetch,
  } = trpc.installationById.useQuery(
    {
      // @ts-ignore
      installationId: +router.query.installationId as number,
      githubAccessToken: user.access_token,
    },
    {
      enabled: !!router.query.installationId,
      onSuccess: (data) => resetForm(data.id ? data : initInputs),
      refetchOnWindowFocus: false,
    }
  );

  const {
    mutateAsync: updateMutation,
    isLoading: mutationIsLoading,
    isSuccess: mutationSuccess,
    reset: resetMutationState,
  } = trpc.update.useMutation();
  const { mutateAsync: deleteMutation } = trpc.delete.useMutation();

  const onSubmit = async (inputs: typeof initInputs) => {
    try {
      await updateMutation({
        githubAccessToken: user.access_token,
        // @ts-ignore
        installationId: +router?.query?.installationId as number,
        fields: {
          ...inputs,
        },
      });

      await refetch();

      setTimeout(() => resetMutationState(), 2000);
    } catch (e) {
      console.log(e);
    }
  };

  const onConfirmDelete = async () => {
    try {
      await deleteMutation({
        githubAccessToken: user.access_token,
        // @ts-ignore
        installationId: +router?.query?.installationId as number,
      });
      await refetch();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <FlexColumn>
      <RelativeDiv>
        {!isFetchedAfterMount && (
          <AbsoluteAndCenter>
            <Spinner />
          </AbsoluteAndCenter>
        )}

        <StyledForm
          onSubmit={handleSubmit((inputs) => onSubmit(inputs))}
          isLoading={!isFetchedAfterMount}
        >
          <UserInfoBox>
            <Text fontWeight="bold" fontSize={19}>
              {installationSettings?.account.login ?? "..."}
            </Text>
            <Badge>GitHub {installationSettings?.account.type ?? "..."}</Badge>
          </UserInfoBox>

          <FormControl isRequired>
            <FormLabel>Atlassian Domain</FormLabel>
            <Input {...register("domain", { required: true })} />
            <FormHelperText>
              {`https://${
                watchForm().domain ? watchForm().domain : "<DOMAIN>"
              }.atlassian.net/jira...`}
            </FormHelperText>
          </FormControl>

          <Button
            type="submit"
            colorScheme={mutationSuccess ? "green" : "blue"}
            isLoading={mutationIsLoading}
            leftIcon={mutationSuccess ? <CheckIcon /> : undefined}
            transition={"all 0.5s"}
            pointerEvents={mutationSuccess ? "none" : undefined}
          >
            {mutationSuccess ? "Saved." : "Save"}
          </Button>
        </StyledForm>
      </RelativeDiv>

      {isFetchedAfterMount && (
        <>
          <Link
            paddingTop="16"
            paddingBottom="3"
            textAlign="center"
            href={
              installationSettings?.account?.type === "User"
                ? `https://github.com/settings/installations/${router.query.installationId}`
                : `https://github.com/apps/jira-ticket-bot/installations/${router.query.installationId}`
            }
            isExternal
            fontWeight={600}
          >
            Edit Settings in Github
            <ExternalLinkIcon mx="2px" />
          </Link>
          <List spacing={1} textAlign="center">
            <ListItem>
              <ListIcon as={SettingsIcon} />
              Update Repository access
            </ListItem>
            <ListItem>
              <ListIcon as={SettingsIcon} />
              Uninstall this bot
            </ListItem>
          </List>
        </>
      )}

      {enableDelete && (
        <DeleteAllDataBtn
          isDisabled={!installationSettings?.id}
          onConfirm={onConfirmDelete}
        />
      )}
    </FlexColumn>
  );
}

const enableDelete = false;

const UserInfoBox = styled.div`
  display: flex;
  margin: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

const StyledForm = styled.form<{ isLoading: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  max-width: 500px;
  margin: auto;
  padding: 50px;
  box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0;
  transition: filter 0.5s;
  filter: ${({ isLoading }) => (isLoading ? "blur(5px)" : "none")};
  pointer-events: ${({ isLoading }) => (isLoading ? "none" : "auto")};
`;

const FlexColumn = styled.main`
  display: flex;
  flex-direction: column;
`;

const AbsoluteAndCenter = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: " translate(-50%,-50%)",
    }}
  >
    {children}
  </div>
);

const RelativeDiv = styled.div`
  position: relative;
`;
