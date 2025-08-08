import { Flex, Paper, Textarea, TextInput } from "@mantine/core"


export const ChatWindow = () => {

    return (
        <Flex w='100%' direction='column' pos='absolute' bottom={0} left={0} pb='xl' gap='xs'>
            <Paper withBorder p='xl'>
                Chat Window
            </Paper>
            <TextInput
                placeholder="Chat"
            />
        </Flex>
    )
}