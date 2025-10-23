import { useRouter } from 'expo-router';
import { Button, useTheme, XStack } from 'tamagui';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import type { ReactElement } from 'react';

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
		transparent={true}
		icon={btnIcon}
		color={btnColor}
		onPress={onPress}
		borderRadius={42}
		paddingHorizontal={22}
		borderWidth={2}
		borderColor={borderColor}
		size={36}
	/>
);

type RouteString = '/landing' | '/add_transaction' | '/budget' | '/spending';

interface BottomNavOption {
	icon: ReactElement;
	route: RouteString;
}

const bottomNavOptions: BottomNavOption[] = [
	{
		icon: <MaterialCommunityIcons name="home-outline" />,
		route: '/landing',
	},
	{
		icon: <MaterialCommunityIcons name="plus-circle-outline" />,
		route: '/add_transaction',
	},
	{
		icon: <MaterialCommunityIcons name="view-grid-outline" />,
		route: '/budget',
	},
	{ icon: <AntDesign name="pie-chart" />, route: '/spending' },
];

export const BottomNav = () => {
	const theme = useTheme();
	const router = useRouter();
	return (
		<XStack
			position="absolute"
			bottom={0}
			left={0}
			right={0}
			paddingHorizontal={22}
			height={45}
			justifyContent={'space-between'}
			alignItems="center"
			backgroundColor={'$primary100'}
			borderTopLeftRadius={6}
			borderTopRightRadius={6}
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
