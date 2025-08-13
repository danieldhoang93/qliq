import { Box, Flex, Text } from '@mantine/core';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { gameState, takeUserBatch, incrementTotalDamage } from '@/stores/gameState';
import '@/styles/damage.css';

type Floater = { id: number; amount: number; style?: string };

export function DamageNumbers({ userId }: { userId: number }) {
  // subscribe only to the parts we need
  const { totalDamageDone, queues } = useSnapshot(gameState);
  const [floaters, setFloaters] = useState<Floater[]>([]);

  useEffect(() => {
    // whenever the user's queue changes, drain it
    const batch = takeUserBatch(userId);
    if (batch.length === 0) return;

    const now = Date.now();
    setFloaters((prev) => [
      ...prev,
      ...batch.map((e, i) => ({ id: now + i, amount: e.amount, style: e.style })),
    ]);
  }, [userId, queues]); // queuesSnap triggers when any user updates, but we instantly no-op if empty

  const processed = useRef(new Set<number>());

  const handleAnimationEnd = useCallback((e: React.AnimationEvent, id: number, amount: number) => {
    // ignore bubbled child events (keeps us safe if Text animates too)
    if (e.target !== e.currentTarget) return;

    // ensure we only handle this floater once (even in StrictMode)
    if (processed.current.has(id)) return;
    processed.current.add(id);

    // side-effect OUTSIDE the functional updater
    incrementTotalDamage(amount);

    // pure state update
    setFloaters((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const visible = useMemo(() => floaters.slice(-20), [floaters]);

  return (
    <Flex pos="absolute" h="100%" w="100%" align="flex-end" justify="center">
      <Box className="damage-overlay">
        {visible.map((f) => (
          <Box
            key={f.id}
            className="damage-number"
            onAnimationEnd={(e) => handleAnimationEnd(e, f.id, f.amount)}
          >
            <Text fz="64px" c={f.style}>
              {f.amount}
            </Text>
          </Box>
        ))}
      </Box>
    </Flex>
  );
}
