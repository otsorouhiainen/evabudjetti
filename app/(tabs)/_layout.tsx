import { ChartColumn, Home, Wallet } from '@tamagui/lucide-icons';
import { Tabs } from 'expo-router';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'tamagui';

interface BottomNavOption {
	icon: ReactElement;
	name: string;
	route: string;
}

export default function TabLayout() {
	const theme = useTheme();
	const { t } = useTranslation();

	const bottomNavOptions: BottomNavOption[] = [
		{
			icon: <Home size={'$icons.md'} color={theme.white.val} />,
			name: t('Home'),
			route: 'index',
		},
		{
			icon: <Wallet size={'$icons.md'} color={theme.white.val} />,
			name: t('Budget'),
			route: 'budget',
		},
		{
			icon: <ChartColumn size={'$icons.md'} color={theme.white.val} />,
			name: t('Summary'),
			route: 'newSummary',
		},
	];
	return (
		<Tabs
			screenOptions={{
				tabBarStyle: { backgroundColor: theme.primary100.val },
				tabBarActiveBackgroundColor: theme.primary200.val,
				tabBarLabelStyle: { color: theme.white.val },
			}}
		>
			{bottomNavOptions.map((page) => (
				<Tabs.Screen
					key={page.route}
					name={page.route}
					options={{
						title: page.name,
						tabBarIcon: () => page.icon,
					}}
				/>
			))}
		</Tabs>
	);
}
