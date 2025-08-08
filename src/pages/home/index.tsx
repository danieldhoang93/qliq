import { ChatWindow } from "@/components/chat/chat-window";
import { MenuButton } from "@/components/layout/menu";
import { gameState, onQliq, setInitialTotalDamage } from "@/stores/gameState";
import { Button, Center, Container, Flex, Text } from "@mantine/core";
import { useEffect } from "react";
import { useSnapshot } from "valtio";

const Home = () => {
  const { totalDamage } = useSnapshot(gameState);

  const onClick = () => {
    onQliq(1);
  };

  useEffect(() => {
    async function loadClicks() {
      const res = await fetch('/api/total');

      if (!res.ok) {   
        console.error('❌ Failed to load total clicks');
        return;
      } 

      const { total } = await res.json();
      setInitialTotalDamage(total);
    }

    loadClicks();
  }, []);
  
  return (
    <Container h='100%' pos='relative'>
      <MenuButton />
      <Flex direction='column' align='center' justify='center' h='100%'>
        <Text>{totalDamage}</Text>
        <Button onClick={onClick}>Qliq</Button>
      </Flex>
      <ChatWindow/>
    </Container>
  );
};

export default Home;