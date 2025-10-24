import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
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
		transparent
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
		icon: <div>TEST1</div>,
		route: '/landing',
	},
	{
		icon: <div>TEST1</div>,
		route: '/add_transaction',
	},
	{
		icon: <div>TEST1</div>,
		route: '/budget',
	},
	{ icon: <div>TEST2</div>, route: '/spending' },
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
