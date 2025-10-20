import * as eva from '@eva-design/eva';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
	ApplicationProvider,
	Button,
	Icon,
	IconRegistry,
	Layout,
	Text,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomNav } from '../src/components/BottomNav';
import { TotalsCard } from '../src/components/TotalsCard';
import { customTheme } from '../src/theme/eva-theme';

type Period = 'PÄIVÄ' | 'KUUKAUSI' | 'VUOSI';

export interface Txn {
	id: string;
	name: string;
	date: string; // dd.mm.yyyy
	amount: number; // + or -5
}

export enum PeriodType {
	Day = 'PÄIVÄ', // TODO: i18n to be added
	Month = 'KUUKAUSI',
	Yearly = 'VUOSI',
}

const FUTURE_TX: Txn[] = [
	{ id: '1', name: 'Bussikortti', date: '05.10.2025', amount: -50 },
	{ id: '2', name: 'Opintotuki', date: '06.10.2025', amount: +280 },
	{ id: '3', name: 'Opintolaina', date: '06.10.2025', amount: +300 },
];
const PAST_TX: Txn[] = [
	{ id: '4', name: 'Lemmikki', date: '03.10.2025', amount: -60 },
	{ id: '5', name: 'Puhelinlasku', date: '01.10.2025', amount: -27 },
];

export default function Budget() {
	const [period, setPeriod] = useState<Period>('KUUKAUSI');
	const [month] = useState('Lokakuu');
	const [year] = useState('2025');
	const [incomesOpen, setIncomesOpen] = useState(true);
	const [expensesOpen, setExpensesOpen] = useState(true);
	const [helpVisible, setHelpVisible] = useState(false);

	const totals = useMemo(
		() => ({
			incomes: 234,
			expenses: 123,
			date: '04.10.2025',
			balance: 111,
			discretionary: 6,
		}),
		[],
	);

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
						{/* Top header */}
						<ScrollView
							contentContainerStyle={styles.scroll}
							bounces
						>
							{/* Period segmented tabs */}
							<View style={styles.segmentWrap}>
								{(
									[
										PeriodType.Day,
										PeriodType.Month,
										PeriodType.Yearly,
									] as Period[]
								).map((p) => {
									const active = p === period;
									return (
										<TouchableOpacity
											key={p}
											onPress={() => setPeriod(p)}
											style={[
												styles.segmentItem,
												active && {
													backgroundColor:
														customTheme[
															'color-primary-500'
														],
												},
											]}
											activeOpacity={0.9}
										>
											<Text
												category="s1"
												style={[
													styles.segmentText,
													active
														? {
																color: customTheme[
																	'color-white'
																],
															}
														: {
																color: customTheme[
																	'color-primary-600'
																],
															},
												]}
											>
												{p}
											</Text>
										</TouchableOpacity>
									);
								})}
							</View>

							{/* Title + month selector */}
							<View style={{ marginTop: 6 }}>
								<Text category="h5" style={styles.title}>
									Budjetti
								</Text>
								<View style={styles.monthRow}>
									<TouchableOpacity style={styles.monthBtn}>
										<Icon
											name="arrow-ios-back-outline"
											fill={customTheme['color-black']}
											style={{ width: 18, height: 18 }}
										/>
									</TouchableOpacity>
									<Text style={{ fontWeight: '700' }}>
										{month} {year}
									</Text>
									<TouchableOpacity style={styles.monthBtn}>
										<Icon
											name="arrow-ios-forward-outline"
											fill={customTheme['color-black']}
											style={{ width: 18, height: 18 }}
										/>
									</TouchableOpacity>
								</View>
							</View>

							{/* Totals cards */}
							<TotalsCard
								title="Tulot"
								value={totals.incomes}
								open={incomesOpen}
								setOpen={setIncomesOpen}
							/>
							<TotalsCard
								title="Menot"
								value={totals.expenses}
								open={expensesOpen}
								setOpen={setExpensesOpen}
							/>

							{/* Snapshot */}
							<View style={{ marginTop: 4 }}>
								<Text
									category="s2"
									style={{ fontWeight: '800' }}
								>
									{totals.date}
								</Text>
								<Text>
									Tilillä rahaa:{' '}
									<Text category="s1">{totals.balance}€</Text>
								</Text>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										gap: 6,
									}}
								>
									<Text>
										Käyttövara:{' '}
										<Text category="s1">
											{totals.discretionary}€
										</Text>
									</Text>
									<MaterialCommunityIcons
										name="help-circle-outline"
										size={18}
										color={customTheme['color-black']}
										onPress={() => setHelpVisible(true)}
										style={{
											marginLeft: 2,
											marginTop: 2,
											opacity: 0.8,
											cursor: 'pointer',
										}}
									/>
								</View>
							</View>

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
											Käyttövara tarkoittaa rahamäärää,
											joka jää jäljelle tulojen ja menojen
											jälkeen. Se auttaa sinua
											ymmärtämään, kuinka paljon rahaa
											sinulla on käytettävissä muihin
											menoihin tai säästöihin kuukauden
											aikana.
										</Text>
										<Button
											onPress={() =>
												setHelpVisible(false)
											}
											style={{ alignSelf: 'center' }}
										>
											SULJE
										</Button>
									</View>
								</View>
							)}

							{/* Future events */}
							<Text category="s1" style={styles.sectionTitle}>
								Tulevat tapahtumat
							</Text>
							<View style={styles.listWrap}>
								{FUTURE_TX.map((t) => (
									<View key={t.id} style={styles.bill}>
										<Text style={styles.billName}>
											{t.name}
										</Text>
										<Text
											appearance="hint"
											style={styles.billDate}
										>
											{t.date}
										</Text>
										<View
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												gap: 8,
											}}
										>
											<Text
												style={[
													styles.billAmt,
													{
														color:
															t.amount >= 0
																? customTheme[
																		'color-primary-300'
																	]
																: customTheme[
																		'color-black'
																	],
													},
												]}
											>
												{t.amount >= 0 ? '+' : ''}
												{t.amount}€
											</Text>
											<MaterialCommunityIcons
												name="pencil-outline"
												size={16}
												color={
													customTheme['color-black']
												}
											/>
										</View>
									</View>
								))}
							</View>

							{/* Past events */}
							<Text category="s1" style={styles.sectionTitle}>
								Menneet tapahtumat
							</Text>
							<View style={styles.listWrap}>
								{PAST_TX.map((t) => (
									<View key={t.id} style={styles.bill}>
										<Text style={styles.billName}>
											{t.name}
										</Text>
										<Text
											appearance="hint"
											style={styles.billDate}
										>
											{t.date}
										</Text>
										<View
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												gap: 8,
											}}
										>
											<Text style={styles.billAmt}>
												{t.amount}€
											</Text>
											<MaterialCommunityIcons
												name="pencil-outline"
												size={16}
												color={
													customTheme['color-black']
												}
											/>
										</View>
									</View>
								))}
							</View>

							<View style={{ height: 90 }} />
						</ScrollView>

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
	safe: { flex: 1 },
	scroll: {
		paddingTop: 18,
		paddingHorizontal: 18,
		paddingBottom: 0,
		gap: 10,
	},
	segmentWrap: {
		flexDirection: 'row',
		alignSelf: 'center',
		backgroundColor: customTheme['color-segment-wrap'],
		borderRadius: 24,
		padding: 4,
		gap: 6,
	},
	segmentItem: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
		backgroundColor: customTheme['color-white'],
	},
	segmentText: { fontWeight: '700' },
	title: { fontWeight: '800' },
	monthRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		marginTop: 2,
	},
	monthBtn: {
		aspectRatio: 1,
		flexBasis: '10%',
		minWidth: 28,
		maxWidth: 40,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: customTheme['color-button-bg'],
	},
	totalCard: {
		borderRadius: 14,
		paddingVertical: 6,
		paddingHorizontal: 10,
		backgroundColor: customTheme['color-primary-600'],
		shadowColor: customTheme['color-black'],
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 6,
		elevation: 4,
	},
	totalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	totalTitle: { fontWeight: '800' },
	totalRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
	chev: {
		aspectRatio: 1,
		width: '60%',
		minWidth: 16,
		maxWidth: 22,
		tintColor: customTheme['color-black'],
	},
	sectionTitle: { marginTop: 8, marginBottom: 4, fontWeight: '800' },
	listWrap: { gap: 8 },
	bill: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: customTheme['color-button-bg'],
		borderRadius: 12,
		paddingVertical: 10,
		paddingHorizontal: 12,
		gap: 10,
	},
	billName: { flex: 1, fontWeight: '700' },
	billDate: { flex: 2, minWidth: 60, maxWidth: 120, textAlign: 'center' },
	billAmt: {
		flex: 1,
		minWidth: 50,
		maxWidth: 80,
		textAlign: 'right',
		fontWeight: '800',
	},
	modalOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: customTheme['color-black'],
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 5,
	},
	modalBox: {
		backgroundColor: customTheme['color-white'],
		borderRadius: 16,
		padding: 24,
		width: '80%',
		minWidth: 220,
		maxWidth: 400,
		shadowColor: customTheme['color-black'],
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.18,
		shadowRadius: 8,
		elevation: 8,
	},
});
