import { ChartColumn, Home, PlusCircle, Wallet } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, useTheme, XStack } from 'tamagui';

interface NavButtonProps {
	iconColor?: string;
	btnColor?: string;
	borderColor?: string;
	btnIcon: ReactElement;
}

const NavButton = ({
	btnColor,
	borderColor,
	btnIcon,
	onPress,
}: NavButtonProps & { onPress?: () => void }) => (
	<Button
		chromeless
		icon={btnIcon}
		color={btnColor}
		onPress={onPress}
		borderColor={borderColor}
		size={25}
		borderRadius={20}
		padding={10}
	/>
);

type RouteString = '/landing' | '/add_transaction' | '/budget' | '/summary';

interface BottomNavOption {
	icon: ReactElement;
	route: RouteString;
}

const bottomNavOptions: BottomNavOption[] = [
	{
		icon: <Home size={'$icons.md'} />,
		route: '/landing',
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
			paddingHorizontal={20}
			paddingVertical={10}
			justifyContent="space-between"
			alignItems="center"
			backgroundColor="$primary100"
			borderTopLeftRadius={6}
			borderTopRightRadius={6}
			elevation={10}
			shadowColor="$black"
			shadowOffset={{ width: 0, height: -2 }}
			shadowOpacity={0.1}
			shadowRadius={4}
		>
			{bottomNavOptions.map((option) => (
				<NavButton
					key={option.route}
					btnIcon={option.icon}
					btnColor={theme.white.val}
					borderColor={theme.primary200.val}
					onPress={() => router.push(option.route)}
				/>
			))}
		</XStack>
	);
};
