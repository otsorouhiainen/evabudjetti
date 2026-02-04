import { Tabs } from "expo-router";
import type { ReactElement } from "react";
import { ChartColumn, Home, PlusCircle, Wallet } from '@tamagui/lucide-icons';

interface BottomNavOption {
	icon: ReactElement;
    name: string;
	route: string;
}

const bottomNavOptions: BottomNavOption[] = [
	{
		icon: <Home size={'$icons.md'} />,
        name: 'Home',
		route: 'landing',
	},
	{
		icon: <PlusCircle size={'$icons.md'} />,
        name: 'Add transaction',
		route: 'add_transaction',
	},
	{
		icon: <Wallet size={'$icons.md'} />,
        name: 'Budget',
		route: 'budget',
	},
	{
		icon: <ChartColumn size={'$icons.md'} />,
        name: 'Summary',
		route: 'summary',
	},
];

export default function TabLayout() {
    return (
        <Tabs>
            {bottomNavOptions.map((page) => (
                <Tabs.Screen
                    key={page.route}
                    name={page.route}
                    options={{
                        title: page.name,
                        tabBarIcon: () => page.icon
                    }}
                />
            ))}
        </Tabs>
    )
}