import { Flex, Paper, TextInput } from '@mantine/core';

export const ChatWindow = () => {
  return (
    <Flex w="100%" direction="column" gap="xs">
      <Paper withBorder p="xl">
        Chat Window
      </Paper>
      <TextInput placeholder="Chat" />
    </Flex>
  );
};
