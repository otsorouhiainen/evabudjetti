import { ChartColumn, Home, PlusCircle, Wallet } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, useTheme, XStack } from 'tamagui';

interface NavButtonProps {
	iconColor?: string;
	btnColor?: string;
	btnIcon: ReactElement;
}

const NavButton = ({
	btnColor,
	btnIcon,
	onPress,
}: NavButtonProps & { onPress?: () => void }) => (
	<Button
		chromeless
		icon={btnIcon}
		color={btnColor}
		onPress={onPress}
		size={60}
		width={'25%'}
		borderRadius={10}
	/>
);

type RouteString = '/' | '/add_transaction' | '/budget' | '/summary';

interface BottomNavOption {
	icon: ReactElement;
	route: RouteString;
}

const bottomNavOptions: BottomNavOption[] = [
	{
		icon: <Home size={'$icons.md'} />,
		route: '/',
	},
	{
		icon: <PlusCircle size={'$icons.md'} />,
		route: '/add_transaction',
	},
	{
		icon: <Wallet size={'$icons.md'} />,
		route: '/budget',
	},
	{
		icon: <ChartColumn size={'$icons.md'} />,
		route: '/summary',
	},
];

export const BottomNav = () => {
	const insets = useSafeAreaInsets();
	const theme = useTheme();
	const router = useRouter();
	return (
		<XStack
			position="absolute"
			bottom={insets.bottom}
			left={0}
			right={0}
			alignItems="center"
			backgroundColor="$primary100"
			justifyContent="space-evenly"
		>
			{bottomNavOptions.map((option) => (
				<NavButton
					key={option.route}
					btnIcon={option.icon}
					btnColor={theme.white.val}
					onPress={() => router.push(option.route)}
				/>
			))}
		</XStack>
	);
};
