import {
  Button,
  ButtonGroup,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";

type Props = {
  onConfirm: () => Promise<void>;
  isDisabled?: boolean;
};

export const DeleteAllDataBtn = ({ onConfirm, isDisabled }: Props) => {
  return (
    <div style={{ margin: "auto", paddingTop: "50px" }}>
      <Popover>
        {({ onClose }) => (
          <>
            <PopoverTrigger>
              <Button colorScheme="red" isDisabled={isDisabled}>
                Delete all data
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader textAlign="center">Are you sure?</PopoverHeader>
              <PopoverBody textAlign="center">
                <ButtonGroup size="sm">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={async () => {
                      await onConfirm();
                      onClose();
                    }}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>
    </div>
  );
};
