import * as eva from '@eva-design/eva';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
	ApplicationProvider,
	Button,
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
import { BudgetDropdown } from '@/src/components/BudgetDropdown';
import { BudgetEventList } from '@/src/components/BudgetEventList';
import { BottomNav } from '../src/components/BottomNav';
import { customTheme } from '../src/theme/eva-theme';

// Possibly removed later if declared for whole project
const today = new Date();

type Txn = {
	id: string;
	name: string;
	date: string; // dd.mm.yyyy
	amount: number; // + or -
};

function parseTxnDate(dateStr: string): Date {
	// "dd.mm.yyyy" → Date, intended for parsing from database entries
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
	{ id: '1', name: 'Bus card', date: '22.10.2025', amount: -50 },
	{ id: '2', name: 'Study benefit', date: '25.10.2025', amount: +280 },
	{ id: '3', name: 'Study loan', date: '06.10.2025', amount: +300 },
	{ id: '4', name: 'Pet', date: '20.10.2025', amount: -60 },
	{ id: '5', name: 'Phone bill', date: '01.10.2025', amount: -27 },
];

function formatCurrency(value: number, hideSign?: boolean) {
	// Formats given currency to a locale (currently finnish)
	// hidesign: hides minus sign on negative numbers if true.
	return Intl.NumberFormat('fi-FI', {
		style: 'currency',
		currency: 'EUR',
		signDisplay: hideSign ? 'never' : 'auto',
		unitDisplay: 'narrow',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
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
	const [error, setError] = useState('');

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

	const monthLabel = new Intl.DateTimeFormat('en-US', {
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

	const isValidDate = (text: string) => {
		// Regex for dd.mm.yyyy
		const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
		const match = regex.exec(text);

		if (!match) return false;

		const day = parseInt(match[1], 10);
		const month = parseInt(match[2], 10) - 1;
		const year = parseInt(match[3], 10);

		const date = new Date(year, month, day);

		// Check that JS didn’t autocorrect invalid dates (like 32.01.2025 → 01.02.2025)
		return (
			date.getFullYear() === year &&
			date.getMonth() === month &&
			date.getDate() === day
		);
	};

	const handleDateChange = (text: string) => {
		if (isValidDate(text)) {
			setError('');
		} else {
			setError('Invalid date, use format: dd.mm.yyyy');
		}
		setEditingTxn((prev) => (prev ? { ...prev, date: text } : prev));
	};

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
							style={{ flex: 1 }}
							selectedIndex={selectedIndex}
							onSelect={(index) => setSelectedIndex(index)}
							swipeEnabled={false}
						>
							<Tab title="Day">
								<Layout
									style={{
										flex: 1,
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Text>Day view</Text>
								</Layout>
							</Tab>
							<Tab title="Month">
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
										{/* month selector */}
										<View style={{ marginTop: 6 }}>
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

										{/* income dropdown */}
										<BudgetDropdown
											txns={POSITIVE_TX}
											name={'Incomes'}
											setEditVisible={setEditVisible}
											setEditingTxn={setEditingTxn}
											openDropdown={setIncomesOpen}
											isOpen={incomesOpen}
											formatCurrency={formatCurrency}
										/>

										{/* expense dropdown */}
										<BudgetDropdown
											txns={NEGATIVE_TX}
											name={'Expenses'}
											setEditVisible={setEditVisible}
											setEditingTxn={setEditingTxn}
											openDropdown={setExpensesOpen}
											isOpen={expensesOpen}
											formatCurrency={formatCurrency}
										/>

										{/* Snapshot */}
										<View style={{ marginTop: 4 }}>
											<Text
												category="s2"
												style={{ fontWeight: '800' }}
											>
												{today.toLocaleDateString()}
											</Text>
											<Text>
												Balance:{' '}
												<Text category="s1">
													{formatCurrency(
														totals.balance,
													)}
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
													Available:{' '}
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
										<BudgetEventList
											txns={future}
											title={'Future events'}
											setEditVisible={setEditVisible}
											setEditingTxn={setEditingTxn}
											formatCurrency={formatCurrency}
										/>

										{/* Past events */}
										<BudgetEventList
											txns={past}
											title={'Past events'}
											setEditVisible={setEditVisible}
											setEditingTxn={setEditingTxn}
											formatCurrency={formatCurrency}
										/>

										{/* Edit modal */}
										{editOpen && (
											<View style={styles.modalOverlay}>
												<View style={styles.modalBox}>
													<Text category="h6">
														Edit Transaction
													</Text>
													<Input
														label="Name"
														maxLength={25}
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
														maxLength={9}
														defaultValue={String(
															editingTxn?.amount,
														)}
														onChangeText={(text) =>
															setEditingTxn(
																(prev) =>
																	prev
																		? {
																				...prev,
																				amount:
																					Number.isFinite(
																						Number(
																							text.trim(),
																						),
																					) &&
																					!Number.isNaN(
																						Number(
																							text.trim(),
																						),
																					)
																						? Number(
																								text.trim(),
																							)
																						: prev.amount,
																			}
																		: prev,
															)
														}
														status={
															editingTxn?.amount ===
															0
																? 'danger'
																: 'static'
														}
														style={{
															marginVertical: 8,
														}}
													/>

													<Input
														label="Date"
														value={editingTxn?.date}
														maxLength={10}
														placeholder="dd.mm.yyyy"
														onChangeText={
															handleDateChange
														}
														status={
															error
																? 'danger'
																: 'static'
														}
														caption={
															error || 'dd.mm.yyy'
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
															disabled={
																error !== '' ||
																editingTxn?.amount ===
																	0
															}
														>
															SAVE
														</Button>
														<Button
															onPress={() => {
																setEditVisible(
																	false,
																);
																setError('');
															}}
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
							<Tab title="Year">
								<Layout
									style={{
										flex: 1,
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Text>Year view</Text>
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
