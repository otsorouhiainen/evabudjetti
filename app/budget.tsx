import * as eva from '@eva-design/eva';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
	ApplicationProvider,
	Button,
	Card,
	Icon,
	IconRegistry,
	Input,
	Layout,
	Tab,
	TabView,
	Text,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomNav } from '../src/components/BottomNav';
import { customTheme } from '../src/theme/eva-theme';

const today = new Date();

type Txn = {
	id: string;
	name: string;
	date: string; // dd.mm.yyyy
	amount: number; // + or -
};

function parseTxnDate(dateStr: string): Date {
	// "dd.mm.yyyy" → Date
	const [day, month, year] = dateStr.split('.').map(Number);
	return new Date(year, month - 1, day);
}

function splitTransactions(transactions: Txn[]) {
	today.setHours(0, 0, 0, 0); // normalize to midnight

	const past: Txn[] = [];
	const future: Txn[] = [];

	for (const tx of transactions) {
		const txDate = parseTxnDate(tx.date);
		if (txDate < today) {
			past.push(tx);
		} else {
			future.push(tx);
		}
	}

	return { past, future };
}

const MOCK_TX: Txn[] = [
	{ id: '4', name: 'Lemmikki', date: '20.10.2025', amount: -60 },
	{ id: '5', name: 'Puhelinlasku', date: '01.10.2025', amount: -27 },
	{ id: '1', name: 'Bussikortti', date: '22.10.2025', amount: -50 },
	{ id: '2', name: 'Opintotuki', date: '25.10.2025', amount: +280 },
	{ id: '3', name: 'Opintolaina', date: '06.10.2025', amount: +300 },
];

function formatCurrency(value: number, hideSign?: boolean) {
	return Intl.NumberFormat('fi-FI', {
		style: 'currency',
		currency: 'EUR',
		signDisplay: hideSign ? 'never' : 'auto',
	}).format(value);
}

export default function Budget() {
	const [incomesOpen, setIncomesOpen] = useState(true);
	const [expensesOpen, setExpensesOpen] = useState(true);
	const [helpVisible, setHelpVisible] = useState(false);
	const [editOpen, setEditVisible] = useState(false);
	const [editingTxn, setEditingTxn] = useState<Txn | null>(null);
	const [currentDate, setcurrentDate] = useState(new Date());
	const [transactions, setTransactions] = useState<Txn[]>(MOCK_TX);
	const [selectedIndex, setSelectedIndex] = React.useState(0);

	const { past, future } = useMemo(
		() => splitTransactions(transactions),
		[transactions],
	);

	const POSITIVE_TX: Txn[] = [...future, ...past].filter(
		(ex) => ex.amount >= 0,
	);

	const NEGATIVE_TX: Txn[] = [...future, ...past].filter(
		(ex) => ex.amount < 0,
	);

	const monthLabel = new Intl.DateTimeFormat('fi-FI', {
		month: 'long',
		year: 'numeric',
	}).format(currentDate);

	const handlePrev = () => {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() - 1);
		setcurrentDate(newDate);
	};

	const handleNext = () => {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() + 1);
		setcurrentDate(newDate);
	};

	const handleSave = () => {
		if (!editingTxn) return;
		setTransactions((prev) =>
			prev.map((tx) => (tx.id === editingTxn.id ? editingTxn : tx)),
		);
		setEditVisible(false);
		setEditingTxn(null);
	};

	const totals = useMemo(
		() => ({
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
				<View style={{ flex: 1, alignItems: 'center' }}>
					<Layout style={styles.screen} level="1">
						<TabView
							style={{ flex: 1, width: 415 }}
							selectedIndex={selectedIndex}
							onSelect={(index) => setSelectedIndex(index)}
							swipeEnabled={false}
						>
							<Tab title="Päivä">
								<Layout
									style={{
										flex: 1,
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Text>Päivän näkymä</Text>
								</Layout>
							</Tab>
							<Tab title="Kuukausi">
								<Layout
									style={{
										flex: 1,
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									{/* Top header */}
									<ScrollView
										contentContainerStyle={styles.scroll}
										bounces
									>
										{/* Title + month selector */}
										<View style={{ marginTop: 6 }}>
											<Text
												category="h5"
												style={styles.title}
											>
												Budjetti
											</Text>
											<View style={styles.monthRow}>
												<TouchableOpacity
													style={styles.monthBtn}
													onPress={() => handlePrev()}
												>
													<Icon
														name="arrow-ios-back-outline"
														fill={
															customTheme[
																'color-black'
															]
														}
														style={{
															width: 18,
															height: 18,
														}}
													/>
												</TouchableOpacity>
												<Text
													style={{
														fontWeight: '700',
													}}
												>
													{monthLabel}
												</Text>
												<TouchableOpacity
													style={styles.monthBtn}
													onPress={() => handleNext()}
												>
													<Icon
														name="arrow-ios-forward-outline"
														fill={
															customTheme[
																'color-black'
															]
														}
														style={{
															width: 18,
															height: 18,
														}}
													/>
												</TouchableOpacity>
											</View>
										</View>

										{/* Totals cards */}
										<Card disabled style={styles.totalCard}>
											<TouchableOpacity
												style={styles.totalHeader}
												onPress={() =>
													setIncomesOpen((v) => !v)
												}
												activeOpacity={0.8}
											>
												<Text
													category="s1"
													style={styles.totalTitle}
												>
													Tulot
												</Text>
												<View style={styles.totalRight}>
													<Text
														category="s1"
														style={{
															fontWeight: '800',
														}}
													>
														{formatCurrency(
															POSITIVE_TX.reduce(
																(acc, income) =>
																	acc +
																	income.amount,
																0,
															),
														)}
													</Text>
													<Icon
														name={
															incomesOpen
																? 'chevron-down-outline'
																: 'chevron-right-outline'
														}
														style={styles.chev}
													/>
												</View>
											</TouchableOpacity>

											{/* income dropdown */}
											{incomesOpen && (
												<View style={{ marginTop: 10 }}>
													{POSITIVE_TX.map(
														(income) => (
															<View
																key={income.id}
																style={
																	styles.totalHeader
																}
															>
																<Text category="s1">
																	{
																		income.name
																	}
																</Text>
																<View
																	style={
																		styles.totalRight
																	}
																>
																	<Text category="s1">
																		{formatCurrency(
																			income.amount,
																		)}
																	</Text>
																	<TouchableOpacity
																		onPress={() => {
																			setEditVisible(
																				true,
																			);
																			setEditingTxn(
																				income,
																			);
																		}}
																	>
																		<MaterialCommunityIcons
																			name="pencil-outline"
																			size={
																				18
																			}
																			color={
																				customTheme[
																					'color-black'
																				]
																			}
																		/>
																	</TouchableOpacity>
																</View>
															</View>
														),
													)}
												</View>
											)}
										</Card>

										<Card disabled style={styles.totalCard}>
											<TouchableOpacity
												style={styles.totalHeader}
												onPress={() =>
													setExpensesOpen((v) => !v)
												}
												activeOpacity={0.8}
											>
												<Text
													category="s1"
													style={styles.totalTitle}
												>
													Menot
												</Text>
												<View style={styles.totalRight}>
													<Text
														category="s1"
														style={{
															fontWeight: '800',
														}}
													>
														{formatCurrency(
															NEGATIVE_TX.reduce(
																(
																	acc,
																	expense,
																) =>
																	acc +
																	expense.amount,
																0,
															),
															true,
														)}
													</Text>
													<Icon
														name={
															expensesOpen
																? 'chevron-down-outline'
																: 'chevron-right-outline'
														}
														style={styles.chev}
													/>
												</View>
											</TouchableOpacity>

											{/* expense dropdown */}
											{expensesOpen && (
												<View style={{ marginTop: 10 }}>
													{NEGATIVE_TX.map(
														(expense) => (
															<View
																key={expense.id}
																style={
																	styles.totalHeader
																}
															>
																<Text category="s1">
																	{
																		expense.name
																	}
																</Text>
																<View
																	style={
																		styles.totalRight
																	}
																>
																	<Text category="s1">
																		{formatCurrency(
																			expense.amount,
																			true,
																		)}
																	</Text>
																	<TouchableOpacity
																		onPress={() => {
																			setEditVisible(
																				true,
																			);
																			setEditingTxn(
																				expense,
																			);
																		}}
																	>
																		<MaterialCommunityIcons
																			name="pencil-outline"
																			size={
																				18
																			}
																			color={
																				customTheme[
																					'color-black'
																				]
																			}
																		/>
																	</TouchableOpacity>
																</View>
															</View>
														),
													)}
												</View>
											)}
										</Card>

										{/* Snapshot */}
										<View style={{ marginTop: 4 }}>
											<Text
												category="s2"
												style={{ fontWeight: '800' }}
											>
												{today.toLocaleDateString()}
											</Text>
											<Text>
												Tilillä rahaa:{' '}
												<Text category="s1">
													{totals.balance}0€
												</Text>
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
														{totals.discretionary}0€
													</Text>
												</Text>
												<MaterialCommunityIcons
													name="help-circle-outline"
													size={18}
													color={
														customTheme[
															'color-black'
														]
													}
													onPress={() =>
														setHelpVisible(true)
													}
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
														style={{
															marginBottom: 8,
														}}
													>
														Ohjeet
													</Text>
													<Text
														style={{
															marginBottom: 16,
														}}
													>
														Käyttövara tarkoittaa
														rahamäärää, joka jää
														jäljelle tulojen ja
														menojen jälkeen. Se
														auttaa sinua
														ymmärtämään, kuinka
														paljon rahaa sinulla on
														käytettävissä muihin
														menoihin tai säästöihin
														kuukauden aikana.
													</Text>
													<Button
														onPress={() =>
															setHelpVisible(
																false,
															)
														}
														style={{
															alignSelf: 'center',
														}}
													>
														SULJE
													</Button>
												</View>
											</View>
										)}

										{/* Future events */}
										<Text
											category="s1"
											style={styles.sectionTitle}
										>
											Tulevat tapahtumat
										</Text>
										<View style={styles.listWrap}>
											{future.map((t) => (
												<View
													key={t.id}
													style={styles.pill}
												>
													<Text
														style={styles.pillName}
													>
														{t.name}
													</Text>
													<Text
														appearance="hint"
														style={styles.pillDate}
													>
														{t.date}
													</Text>
													<View
														style={{
															flexDirection:
																'row',
															alignItems:
																'center',
															gap: 8,
														}}
													>
														<Text
															style={[
																styles.pillAmt,
																{
																	color:
																		t.amount >=
																		0
																			? customTheme[
																					'color-primary-300'
																				]
																			: customTheme[
																					'color-black'
																				],
																},
															]}
														>
															{t.amount >= 0
																? '+'
																: ''}
															{t.amount}€
														</Text>

														<TouchableOpacity
															onPress={() => {
																setEditVisible(
																	true,
																);
																setEditingTxn(
																	t,
																);
															}}
														>
															<MaterialCommunityIcons
																name="pencil-outline"
																size={18}
																color={
																	customTheme[
																		'color-black'
																	]
																}
															/>
														</TouchableOpacity>
													</View>
												</View>
											))}
										</View>

										{/* Past events */}
										<Text
											category="s1"
											style={styles.sectionTitle}
										>
											Menneet tapahtumat
										</Text>
										<View style={styles.listWrap}>
											{past.map((t) => (
												<View
													key={t.id}
													style={styles.pill}
												>
													<Text
														style={styles.pillName}
													>
														{t.name}
													</Text>
													<Text
														appearance="hint"
														style={styles.pillDate}
													>
														{t.date}
													</Text>
													<View
														style={{
															flexDirection:
																'row',
															alignItems:
																'center',
															gap: 8,
														}}
													>
														<Text
															style={[
																styles.pillAmt,
																{
																	color:
																		t.amount >=
																		0
																			? customTheme[
																					'color-primary-300'
																				]
																			: customTheme[
																					'color-black'
																				],
																},
															]}
														>
															{t.amount >= 0
																? '+'
																: ''}
															{t.amount}€
														</Text>
														<TouchableOpacity
															onPress={() => {
																setEditVisible(
																	true,
																);
																setEditingTxn(
																	t,
																);
															}}
														>
															<MaterialCommunityIcons
																name="pencil-outline"
																size={18}
																color="#1c1c1c"
															/>
														</TouchableOpacity>
													</View>
												</View>
											))}
										</View>

										{/* Edit modal */}
										{editOpen && (
											<View style={styles.modalOverlay}>
												<View style={styles.modalBox}>
													<Text category="h6">
														Edit Transaction
													</Text>
													<Input
														label="Name"
														value={editingTxn?.name}
														style={{
															marginVertical: 8,
														}}
														onChangeText={(text) =>
															setEditingTxn(
																(prev) =>
																	prev
																		? {
																				...prev,
																				name: text,
																			}
																		: prev,
															)
														}
													/>
													<Input
														label="Amount (€)"
														keyboardType="numeric"
														value={String(
															editingTxn?.amount,
														)}
														onChangeText={(text) =>
															setEditingTxn(
																(prev) =>
																	prev
																		? {
																				...prev,
																				amount: Number(
																					text,
																				),
																			}
																		: prev,
															)
														}
														style={{
															marginVertical: 8,
														}}
													/>

													<Input
														label="Date"
														value={editingTxn?.date}
														placeholder="dd.mm.yyyy"
														onChangeText={(text) =>
															setEditingTxn(
																(prev) =>
																	prev
																		? {
																				...prev,
																				date: text,
																			}
																		: prev,
															)
														}
														style={{
															marginVertical: 8,
														}}
													/>
													<View
														style={styles.monthRow}
													>
														<Button
															onPress={() =>
																handleSave()
															}
															style={{
																alignSelf:
																	'center',
															}}
														>
															SAVE
														</Button>
														<Button
															onPress={() =>
																setEditVisible(
																	false,
																)
															}
															style={{
																alignSelf:
																	'center',
															}}
														>
															CLOSE
														</Button>
													</View>
												</View>
											</View>
										)}

										<View style={{ height: 90 }} />
									</ScrollView>
								</Layout>
							</Tab>
							<Tab title="Vuosi">
								<Layout
									style={{
										flex: 1,
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Text>Vuoden näkymä</Text>
								</Layout>
							</Tab>
						</TabView>
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
		backgroundColor: customTheme['color-white'],
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
	segmentText: {
		fontWeight: '700',
		color: customTheme['color-black'],
	},
	title: { fontWeight: '800' },
	monthRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		marginTop: 2,
	},
	monthBtn: {
		width: 30,
		height: 30,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: customTheme['color-white'],
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
	chev: { width: 18, height: 18, tintColor: customTheme['color-black'] },
	income: {
		flexDirection: 'row',
	},
	sectionTitle: { marginTop: 8, marginBottom: 4, fontWeight: '800' },
	listWrap: { gap: 8 },
	pill: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: customTheme['color-primary-600'],
		borderRadius: 12,
		paddingVertical: 10,
		paddingHorizontal: 12,
		gap: 10,
	},
	pillName: { flex: 1, fontWeight: '700' },
	pillDate: { width: 100, textAlign: 'center' },
	pillAmt: { width: 70, textAlign: 'right', fontWeight: '800' },
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
		backgroundColor: customTheme['color-white'],
		borderRadius: 16,
		padding: 24,
		width: 320,
		maxWidth: '90%',
		shadowColor: customTheme['color-black'],
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.18,
		shadowRadius: 8,
		elevation: 8,
	},
});
