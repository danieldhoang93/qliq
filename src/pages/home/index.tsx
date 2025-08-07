import { gameState, onQliq, setInitialTotalDamage } from "@/stores/gameState";
import { Button, Container, Text } from "@mantine/core";
import { useEffect } from "react";
import { useSnapshot } from "valtio";

const Home = () => {
  const { totalDamage } = useSnapshot(gameState);

  const onClick = () => {
    onQliq(1);
  };

  useEffect(() => {
    async function loadClicks() {
      console.log('getting total')
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
    <Container>
      <Text>{totalDamage}</Text>
      <Button onClick={onClick}>Qliq</Button>
    </Container>
  );
};

export default Home;