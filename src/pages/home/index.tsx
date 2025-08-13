import { ChatWindow } from '@/components/chat/chat-window';
import { DamageNumbers } from '@/components/damage-numbers';
import { MenuButton } from '@/components/layout/menu';
import { gameState, onQliq, setInitialTotalDamage } from '@/stores/gameState';
import { initializeServers, useServer } from '@/stores/server';
import { updateUser, useUser } from '@/stores/user';
import { Button, Container, Flex, NumberInput, Text } from '@mantine/core';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';

const Home = () => {
  const { currentServerId, currentTeamId, queues, totalDamageDone } = useSnapshot(gameState);
  const { servers } = useSnapshot(useServer);
  const { user } = useSnapshot(useUser);

  const onClick = () => {
    onQliq(user.damage, user.style);
  };

  // test autoclicker
  // useEffect(() => {
  //   if (user) {
  //     const interval = setInterval(
  //       () => {
  //         onQliq(user.damage, user.style);
  //       },
  //       Math.floor(Math.random() * (300 - 100 + 1)) + 200
  //     );
  //     return () => clearInterval(interval); // cleanup on unmount
  //   }
  // }, [user]);

  useEffect(() => {
    async function fetchServers() {
      const res = await fetch('/api/servers');
      if (!res.ok) throw new Error('Failed to fetch servers');
      const { servers } = await res.json();
      initializeServers(servers);
    }

    async function loadClicks(serverId: number, teamId: number | null) {
      const qs = new URLSearchParams({ serverId: String(serverId) });
      if (teamId != null) qs.set('teamId', String(teamId));

      const res = await fetch(`/api/total?${qs.toString()}`);
      if (!res.ok) {
        console.error('❌ Failed to load total clicks');
        return;
      }

      const { total } = await res.json();
      setInitialTotalDamage(total);
    }

    const serverId = currentServerId;
    const teamId = currentTeamId ?? null;
    if (serverId) loadClicks(serverId, teamId);
    fetchServers();
  }, [currentServerId, currentTeamId]);

  const onDamageChange = (value: string | number) => {
    updateUser({
      ...user,
      damage: value,
    });
  };

  const userIds = Array.from(queues.keys());

  return (
    <Container h="100%" pos="relative">
      <MenuButton />
      <Flex direction="column" align="center" h="100%" gap="md">
        <Flex pos="relative" h="50%" w="100%" align="flex-end" justify="center">
          <Text fz="64px">{totalDamageDone}</Text>
          {userIds.map((uid) => (
            <DamageNumbers key={uid} userId={uid} />
          ))}
        </Flex>
        <Button size="64px" h="88px" onClick={onClick}>
          QLIQ
        </Button>

        <NumberInput
          variant="filled"
          label="Damage"
          placeholder="Input placeholder"
          defaultValue={1}
          min={1}
          onChange={onDamageChange}
        />
      </Flex>
      <ChatWindow />
    </Container>
  );
};

export default Home;
