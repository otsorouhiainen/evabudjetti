import * as eva from '@eva-design/eva';
import type { IconProps } from '@ui-kitten/components';
import {
	ApplicationProvider,
	Button,
	Card,
	CheckBox,
	Icon,
	IconRegistry,
	Input,
	Layout,
	Text,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { format, parse, isValid } from 'date-fns';
import { useMemo, useState } from 'react';
import {
	Alert,
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { BottomNav } from '../src/components/BottomNav';
import { TransactionTypeSegment } from '../src/components/TransactionTypeSegment';
import { customTheme } from '../src/theme/eva-theme';

export enum TransactionType {
	Income = 'TULO', // TODO: i18n to be added
	Expense = 'MENO',
}

// TODO: categories to be dynamic from database
export const CATEGORIES = [
	{ key: 'support', label: 'Tuki', type: TransactionType.Income },
	{ key: 'rental', label: 'Vuokra', type: TransactionType.Expense },
	{ key: 'other', label: 'Muu', type: TransactionType.Income },
	{ key: 'electricity', label: 'Sähkö', type: TransactionType.Expense },
	{ key: 'water', label: 'Vesi', type: TransactionType.Expense },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]['key'];

const CalendarIcon = (props: IconProps) => (
	<Icon {...props} name="calendar-outline" />
);

export default function AddTransaction() {
	const [type, setType] = useState<
		TransactionType.Income | TransactionType.Expense
	>(TransactionType.Income);
	const [category, setCategory] = useState<CategoryKey | null>(null);
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [date, setDate] = useState<Date | null>(null);
	const [dateText, setDateText] = useState('');
	const [dateError, setDateError] = useState<string | null>(null);
	const [repeat, setRepeat] = useState(false);
	const [repeatInterval, setRepeatInterval] = useState<
		'kuukausittain' | 'oma aikaväli'
	>('kuukausittain');
	const [repeatValue, setRepeatValue] = useState('');
	const [errors, setErrors] = useState<{
		amount?: string;
		repeatValue?: string;
	}>({});

	const [description, setDescription] = useState('');
	const [expanded, setExpanded] = useState(false);
	const [categoryModalVisible, setCategoryModalVisible] = useState(false);
	const [newCategory, setNewCategory] = useState('');

	const visibleCategories = expanded ? CATEGORIES : CATEGORIES.slice(0, 3);

	const handleAddCategory = () => {
		//placeholder for adding category

		setNewCategory('');
		setCategoryModalVisible(false);
	};

	const isValidSubmit = useMemo(
		() => name.trim().length > 0 && !!date && !!amount,
		[name, amount, date],
	);

	const handleAmountChange = (newValue: string) => {
		const numeric = newValue.replace(/[^0-9.,]/g, '');
		const dotSeparators = numeric.replace(',', '.');
		const parts = dotSeparators.split('.');
		if (parts.length === 1) {
			setAmount(parts[0]);
		} else {
			const integer = parts[0];
			const decimal = parts.slice(1).join('').slice(0, 2);
			setAmount(`${integer}.${decimal}`);
		}
	};

	const handleDateChange = (newDate: string) => {
		setDateText(newDate);
		const parsed = parse(newDate, 'd-M-yyyy', new Date());

		if (isValid(parsed)) {
			setDate(parsed);
		} else {
			setDate(null);
		}
	};

	const handleDateBlur = () => {
		if (date) {
			setDateText(format(date, 'dd-MM-yyyy'));
			setDateError(null);
		} else {
			setDateError('Anna oikea päivämäärä muodossa dd-mm-yyyy');
		}
	};

	const handleCancel = () => {
		setCategory(null);
		setName('');
		setAmount('');
		setDate(null);
		setRepeat(false);
		setRepeatInterval('kuukausittain');
		setRepeatValue('');
		setDescription('');
		setErrors({});
	};

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
						<ScrollView
							contentContainerStyle={styles.scroll}
							bounces
						>
							{/* Top header */}
							<View style={styles.headerRow}>
								<Text category="h5" style={styles.headerTitle}>
									Lisää uusi
								</Text>
							</View>

							{/* Segmented: Tulo / Meno */}
							<TransactionTypeSegment
								type={type}
								setType={setType}
							/>

							{/* Category chips */}
							<View style={styles.categoryHeader}>
								<Text appearance="hint" style={styles.labelTop}>
									Kategoria
								</Text>
								<TouchableOpacity
									onPress={() => setExpanded(!expanded)}
								>
									<Icon
										name={
											expanded
												? 'chevron-up-outline'
												: 'chevron-down-outline'
										}
										fill={customTheme['color-black']}
										style={{ width: 22, height: 22 }}
									/>
								</TouchableOpacity>
							</View>
							<View style={styles.chipsRow}>
								<TouchableOpacity
									onPress={() =>
										setCategoryModalVisible(true)
									}
									style={styles.chip}
								>
									<Text>+</Text>
								</TouchableOpacity>
								<Modal
									visible={categoryModalVisible}
									transparent={true}
									onRequestClose={() =>
										setCategoryModalVisible(false)
									}
								>
									<View style={styles.modalOverlay}>
										<View style={styles.modalContainer}>
											<Text style={styles.inputLabel}>
												Lisää kategoria
											</Text>
											<Input
												value={newCategory}
												onChangeText={setNewCategory}
												placeholder="kirjoita kategoria"
												style={styles.input}
											/>
											<View style={styles.btnRow}>
												<Button
													appearance="outline"
													style={[
														styles.modalBtn,
														{
															backgroundColor:
																customTheme[
																	'color-white'
																],
														},
													]}
													onPress={() =>
														setCategoryModalVisible(
															false,
														)
													}
												>
													Peruuta
												</Button>
												<Button
													style={[
														styles.modalBtn,
														{
															backgroundColor:
																customTheme[
																	'color-primary-500'
																],
														},
													]}
													onPress={handleAddCategory}
												>
													Tallenna
												</Button>
											</View>
										</View>
									</View>
								</Modal>
								{visibleCategories
									.filter(
										(category) =>
											(type === TransactionType.Income &&
												category.type ===
													TransactionType.Income) ||
											(type === TransactionType.Expense &&
												category.type ===
													TransactionType.Expense),
									)
									.map(({ key, label }) => {
										const selected = key === category;
										return (
											<TouchableOpacity
												key={key}
												onPress={() => {
													setCategory(key);
												}}
												style={[
													styles.chip,
													selected && {
														backgroundColor:
															customTheme[
																'color-primary-600'
															],
													},
												]}
											>
												<Text
													style={[
														styles.chipText,
														selected && {
															color: customTheme[
																'color-white'
															],
														},
													]}
												>
													{label}
												</Text>
											</TouchableOpacity>
										);
									})}
							</View>
							{/* Form */}
							<Card disabled style={styles.formCard}>
								<Text style={styles.inputLabel}>
									{type === TransactionType.Income
										? TransactionType.Income + ' nimi'
										: TransactionType.Expense + ' nimi'}
									<Text
										style={{
											color: customTheme[
												'color-danger-500'
											],
										}}
									>
										{' '}
										*
									</Text>
								</Text>
								<Input
									value={name}
									onChangeText={setName}
									placeholder={
										type === TransactionType.Income
											? TransactionType.Income + ' nimi'
											: TransactionType.Expense + ' nimi'
									}
									style={styles.input}
									size="medium"
								/>

								<Text style={styles.inputLabel}>
									Määrä
									<Text
										style={{
											color: customTheme[
												'color-danger-500'
											],
										}}
									>
										{' '}
										*
									</Text>
								</Text>
								<Input
									value={amount}
									onChangeText={handleAmountChange}
									status={errors.amount ? 'danger' : 'basic'}
									caption={errors.amount}
									keyboardType="decimal-pad"
									placeholder="000,00 €"
									accessoryRight={() => (
										<Text
											appearance="hint"
											style={{ marginRight: 6 }}
										>
											€
										</Text>
									)}
									style={styles.input}
									size="medium"
								/>

								<Text style={styles.inputLabel}>
									Päivämäärä
									<Text
										style={{
											color: customTheme[
												'color-danger-500'
											],
										}}
									>
										{' '}
										*
									</Text>
								</Text>

								<Input
									value={dateText}
									onChangeText={handleDateChange}
									onBlur={handleDateBlur}
									placeholder="DD-MM-YYYY"
									status={dateError ? 'danger' : 'basic'}
									caption={dateError}
									keyboardType="numeric"
									style={styles.input}
									size="medium"
								/>

								<View style={{ marginTop: 8 }}>
									<CheckBox
										checked={repeat}
										onChange={setRepeat}
									>
										Toistuuko tapahtuma?
									</CheckBox>
								</View>

								{repeat && (
									<View style={styles.segmentWrap}>
										{(
											[
												'kuukausittain',
												'oma aikaväli',
											] as const
										).map((opt) => (
											<TouchableOpacity
												key={opt}
												activeOpacity={0.9}
												onPress={() => {
													setRepeatInterval(opt);
													if (opt !== 'oma aikaväli')
														setRepeatValue('');
												}}
												style={[
													styles.segmentItem,
													opt === repeatInterval && {
														backgroundColor:
															customTheme[
																'color-primary-500'
															],
													},
												]}
											>
												<Text
													category="s1"
													style={[
														styles.segmentText,
														opt === repeatInterval
															? {
																	color: customTheme[
																		'color-black'
																	],
																}
															: {
																	color: customTheme[
																		'color-primary-500'
																	],
																},
													]}
												>
													{opt}
												</Text>
											</TouchableOpacity>
										))}
									</View>
								)}

								{repeat &&
									repeatInterval === 'oma aikaväli' && (
										<Input
											value={repeatValue}
											onChangeText={setRepeatValue}
											status={
												errors.repeatValue
													? 'danger'
													: 'basic'
											}
											caption={errors.repeatValue}
											keyboardType="numeric"
											accessoryRight={() => (
												<Text
													appearance="hint"
													style={{ marginRight: 6 }}
												>
													päivän välein
												</Text>
											)}
											style={styles.input}
											size="medium"
										/>
									)}

								<Text style={styles.inputLabel}>
									Lisätietoa
								</Text>
								<Input
									value={description}
									onChangeText={setDescription}
									placeholder="anna lisätietoa"
									style={styles.input}
									size="medium"
								/>
							</Card>

							{/* Submit */}
							<Button
								size="large"
								disabled={!isValidSubmit}
								style={[
									styles.submitBtn,
									{
										backgroundColor:
											customTheme['color-primary-500'],
									},
								]}
								onPress={() => {
									// submit handler placeholder
									const newErrors: typeof errors = {};

									if (amount.at(-1) === '.') {
										newErrors.amount =
											'Kirjoita oikea summa';
									}
									if (
										repeat === true &&
										repeatInterval === 'oma aikaväli' &&
										repeatValue === ''
									) {
										newErrors.repeatValue =
											'Anna toistuvuuden aikaväli';
									}

									setErrors(newErrors);

									if (Object.keys(newErrors).length === 0) {
										console.log({
											type,
											category,
											name,
											amount,
											date,
											repeat,
											description,
											repeatInterval,
											repeatValue,
										});
										Alert.alert(
											'Tallennettu',
											`${
												type === TransactionType.Income
													? TransactionType.Income
													: TransactionType.Expense
											} lisätty.`,
										);
									}
								}}
							>
								{type === TransactionType.Income
									? 'LISÄÄ ' + TransactionType.Income
									: 'LISÄÄ ' + TransactionType.Expense}
							</Button>

							{/* Cancel */}
							<Button
								size="large"
								appearance="outline"
								style={[
									styles.submitBtn,
									{
										backgroundColor:
											customTheme['color-white'],
									},
								]}
								onPress={handleCancel}
							>
								Peruuta
							</Button>
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
	safe: { flex: 1 },
	screen: {
		flex: 1,
		paddingTop: 24,
		paddingHorizontal: 20,
		gap: 18,
	},
	scroll: {
		paddingTop: 18,
		paddingHorizontal: 18,
		paddingBottom: 80,
		gap: 10,
	},
	headerRow: {
		marginTop: 4,
	},
	headerTitle: {
		fontWeight: '800',
	},
	categoryHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	segmentWrap: {
		flexDirection: 'row',
		alignSelf: 'flex-start',
		backgroundColor: customTheme['color-segment-wrap'],
		borderRadius: 24,
		padding: 4,
		gap: 6,
	},
	segmentItem: {
		paddingVertical: 6,
		paddingHorizontal: '8%',
		borderRadius: 20,
		backgroundColor: customTheme['color-white'],
		minWidth: 60,
		maxWidth: 120,
		flexShrink: 1,
	},
	segmentText: { fontWeight: '700' },
	labelTop: {
		marginTop: 4,
		marginBottom: -6,
	},
	chipsRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},
	chip: {
		backgroundColor: customTheme['color-button-bg'],
		paddingVertical: 8,
		paddingHorizontal: '7%',
		borderRadius: 12,
	},
	chipText: {
		fontWeight: '700',
	},
	modalOverlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	modalContainer: {
		width: 320,
		padding: 20,
		backgroundColor: customTheme['color-white'],
		borderRadius: 10,
	},
	formCard: {
		paddingVertical: 14,
		paddingHorizontal: 12,
		borderRadius: 16,
		gap: 6,
	},
	inputLabel: {
		marginTop: 4,
		marginBottom: -4,
		fontWeight: '700',
		fontSize: 13,
	},
	input: {
		marginTop: 6,
		borderRadius: 10,
	},
	submitBtn: {
		marginTop: 8,
		borderRadius: 22,
		paddingVertical: 14,
		width: '80%',
		alignSelf: 'center',
		minWidth: 120,
		maxWidth: 320,
	},
	btnRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 20,
	},
	modalBtn: {
		borderRadius: 12,
	},
});
