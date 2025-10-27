import * as eva from '@eva-design/eva';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
	ApplicationProvider,
	Button,
	IconRegistry,
	Layout,
	Text,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { BottomNav } from '../src/components/BottomNav';
import { customTheme } from '../src/theme/eva-theme';

export default function Err() {
	const router = useRouter();
	return (
		<>
			<IconRegistry icons={EvaIconsPack} />
			<ApplicationProvider
				{...eva}
				theme={{ ...eva.light, ...customTheme }}
			>
				<View
					style={{
						flex: 1,
						inset: 0,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Layout style={styles.screen} level="1">
						<Layout style={styles.illustrationWrap} level="1">
							<MaterialCommunityIcons
								name="piggy-bank"
								size={192}
								color={customTheme['color-primary-300']}
							/>
						</Layout>

						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Text>404</Text>
							<Text>Jokin meni pieleen</Text>
						</View>

						<Button
							size="large"
							style={[
								styles.primaryCta,
								{
									backgroundColor:
										customTheme['color-primary-300'],
								},
							]}
							onPress={() => router.push('/landing')}
						>
							PALAA ETUSIVULLE
						</Button>

						{/* Bottom nav */}
						<BottomNav />
					</Layout>
				</View>
			</ApplicationProvider>
		</>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
		gap: 18,
	},

	illustrationWrap: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 4,
		position: 'relative',
		//a hack to force width for bottom bar
		width: 360,
		height: 220,
		alignSelf: 'center',
	},

	primaryCta: {
		marginTop: 8,
		borderRadius: 28,
		paddingVertical: 14,
	},

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
