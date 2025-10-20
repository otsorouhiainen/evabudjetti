import { Button, Icon, Layout } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { customTheme } from '../../src/theme/eva-theme';

interface NavIconProps {
	name: string;
	iconColor?: string;
	btnColor?: string;
	borderColor?: string;
}

const NavIcon = ({
	name,
	iconColor,
	btnColor,
	borderColor,
	onPress,
}: NavIconProps & { onPress?: () => void }) => (
	<Button
		appearance="ghost"
		accessoryLeft={(props) => (
			<Icon {...props} name={name} fill={iconColor} />
		)}
		style={[
			styles.navBtn,
			btnColor ? { backgroundColor: btnColor } : null,
			borderColor ? { borderWidth: 2, borderColor } : null,
		]}
		onPress={onPress}
	/>
);

type RouteString = '/landing' | '/add_transaction' | '/budget' | '/spending';

interface BottomNavOption {
	name: string;
	route: RouteString;
}

const bottomNavOptions: BottomNavOption[] = [
	{ name: 'home-outline', route: '/landing' },
	{ name: 'plus-circle-outline', route: '/add_transaction' },
	{ name: 'grid-outline', route: '/budget' },
	{ name: 'pie-chart-outline', route: '/spending' },
];

export const BottomNav = () => {
	const router = useRouter();
	return (
		<Layout
			style={[
				styles.bottomBar,
				{ backgroundColor: customTheme['color-primary-100'] },
			]}
			level="2"
		>
			{bottomNavOptions.map((option) => (
				<NavIcon
					key={option.name}
					name={option.name}
					iconColor={customTheme['color-white']}
					btnColor={customTheme['color-primary-100']}
					borderColor={customTheme['color-primary-200']}
					onPress={() => router.push(option.route)}
				/>
			))}
		</Layout>
	);
};

const styles = StyleSheet.create({
	bottomBar: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		paddingHorizontal: 18,
		paddingVertical: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopLeftRadius: 18,
		borderTopRightRadius: 18,
	},
	navBtn: {
		borderRadius: 16,
	},
});
