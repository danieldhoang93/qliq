import { Flex, Select } from '@mantine/core';

export const ServerAndTeamSelection = () => {
  return (
    <Flex gap="xs">
      <Select
        label="Server"
        data={[
          { group: 'West', items: ['California'] },
          { group: 'East', items: ['New York'] },
        ]}
        defaultValue={'California'}
      />

      <Select
        label="Team"
        data={[
          { value: '1', label: 'Ravens' },
          { value: '2', label: 'Rams' },
        ]}
        defaultValue={'1'}
        clearable
      />
    </Flex>
  );
};
