import * as eva from '@eva-design/eva';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
	ApplicationProvider,
	Button,
	Card,
	Icon,
	IconRegistry,
	Layout,
	Text,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomNav } from '../src/components/BottomNav';
import { customTheme } from '../src/theme/eva-theme';

export default function Landing() {
	const router = useRouter();
	const [helpVisible, setHelpVisible] = useState(false);
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
						{/* Header */}
						<Layout style={styles.header} level="1">
							<Text category="h4" style={styles.title}>
								EVA OmaBudjetti
							</Text>
							<Text appearance="hint">
								Taloudenhallintasi tueksi
							</Text>
						</Layout>

						{/* Illustration row */}
						<Layout style={styles.illustrationWrap} level="1">
							<Icon
								name="question-mark-circle-outline"
								style={[
									styles.helpIcon,
									{ color: customTheme['color-primary-300'] },
								]}
								onPress={() => setHelpVisible(true)}
							/>
							<MaterialCommunityIcons
								name="piggy-bank"
								size={96}
								color={customTheme['color-primary-300']}
							/>
						</Layout>

						{/* Help Modal */}
						{helpVisible && (
							<View style={styles.modalOverlay}>
								<View style={styles.modalBox}>
									<Text
										category="h6"
										style={{ marginBottom: 8 }}
									>
										Ohjeet
									</Text>
									<Text style={{ marginBottom: 16 }}>
										Tervetuloa budjettisovellukseen! Käytä
										alavalikon painikkeita siirtyäksesi eri
										osioihin. Lisää tulo tai meno painamalla
										"Lisää tulo/meno". Voit tarkastella ja
										muokata budjettiasi sekä nähdä
										yhteenvedon taloudestasi.
									</Text>
									<Button
										onPress={() => setHelpVisible(false)}
										style={{ alignSelf: 'center' }}
									>
										SULJE
									</Button>
								</View>
							</View>
						)}

						{/* Balance card */}
						<Card disabled style={styles.balanceCard}>
							<Text category="s1" style={styles.dateText}>
								04.10.2025
							</Text>
							<Text style={styles.rowText}>
								Tilillä rahaa: <Text category="s1">1234€</Text>
							</Text>
							<Text style={styles.rowText}>
								Käyttövara: <Text category="s1">123€</Text>
							</Text>

							<Button size="small" style={styles.inspectBtn}>
								TARKASTELE
							</Button>
						</Card>

						{/* Primary CTA */}
						<Button
							size="large"
							style={[
								styles.primaryCta,
								{
									backgroundColor:
										customTheme['color-primary-300'],
								},
							]}
							onPress={() => router.push('/add_transaction')}
						>
							LISÄÄ TULO/MENO
						</Button>

						{/* Secondary CTAs */}
						<Layout style={styles.row} level="1">
							<Button
								size="large"
								style={[
									styles.secondaryBtn,
									{
										backgroundColor:
											customTheme['color-primary-300'],
									},
								]}
								onPress={() => router.push('/budget')}
							>
								NÄYTÄ BUDJETTI
							</Button>
							<Button
								size="large"
								style={[
									styles.secondaryBtn,
									{
										backgroundColor:
											customTheme['color-primary-300'],
									},
								]}
							>
								MUOKKAA BUDJETTIA
							</Button>
						</Layout>

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
		paddingTop: 24,
		paddingHorizontal: 20,
		gap: 18,
	},
	header: {
		alignItems: 'center',
		marginTop: 6,
	},
	title: {
		fontWeight: '800',
	},
	illustrationWrap: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 4,
		position: 'relative',
		width: 120,
		height: 110,
		alignSelf: 'center',
	},
	balanceCard: {
		alignSelf: 'center',
		width: '88%',
		borderRadius: 16,
		alignItems: 'center',
		paddingVertical: 16,
		gap: 6,
		backgroundColor: '#fff',
		// Shadow for iOS
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		// Elevation for Android
		elevation: 6,
	},
	dateText: {
		fontWeight: '700',
		marginBottom: 4,
	},
	rowText: {
		fontSize: 16,
	},
	inspectBtn: {
		marginTop: 10,
		alignSelf: 'center',
		borderRadius: 24,
		paddingHorizontal: 16,
	},
	primaryCta: {
		marginTop: 8,
		borderRadius: 28,
		paddingVertical: 14,
	},
	row: {
		flexDirection: 'row',
		gap: 14,
		justifyContent: 'space-between',
	},
	secondaryBtn: {
		flex: 1,
		borderRadius: 18,
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
	helpIcon: {
		position: 'absolute',
		top: 0,
		right: -80,
		width: 28,
		height: 28,
		zIndex: 10,
	},
	modalOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.3)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 100,
	},
	modalBox: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 24,
		width: 320,
		maxWidth: '90%',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.18,
		shadowRadius: 8,
		elevation: 8,
	},
});
