import { ActionIcon, Menu } from "@mantine/core"
import { HiOutlineMenu } from "react-icons/hi";

export const MenuButton = () => {

    return (
        <Menu
            trigger="click-hover"
            loop={false}
            withinPortal={false}
            trapFocus={false}
            menuItemTabIndex={0}
        >   
            <Menu.Target>
                <ActionIcon variant="subtle" radius='md'>
                    <HiOutlineMenu size={24} />
                </ActionIcon>
            </Menu.Target>
        
            <Menu.Dropdown>
                <Menu.Item>
                    Servers
                </Menu.Item>
                <Menu.Item>
                    Channels
                </Menu.Item>
                <Menu.Item>
                    Teams
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}