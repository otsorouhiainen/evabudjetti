import * as eva from '@eva-design/eva';
import type { IconProps } from '@ui-kitten/components';
import {
	ApplicationProvider,
	Button,
	Card,
	CheckBox,
	Datepicker,
	Icon,
	IconRegistry,
	Input,
	Layout,
	Text,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { format, parseISO } from 'date-fns';
import { useMemo, useState } from 'react';
import {
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
	{ key: 'support', label: 'Tuki' },
	{ key: 'rental', label: 'Vuokratulo' },
	{ key: 'other', label: 'Muu' },
	{ key: 'add', label: 'Lisää kategoria (+)' },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]['key'];

const CalendarIcon = (props: IconProps) => (
	<Icon {...props} name="calendar-outline" />
);

export default function AddTransaction() {
	const [type, setType] = useState<
		TransactionType.Income | TransactionType.Expense
	>(TransactionType.Income);
	const [category, setCategory] = useState<CategoryKey>('support');
	const [name, setName] = useState('Tuki');
	const [amount, setAmount] = useState('');
	const [date, setDate] = useState<Date | null>(new Date(2025, 10, 4)); // 31/07/2025
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

	const isValid = useMemo(
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

	const handleCancel = () => {
		setName('');
		setAmount('');
		setDate(null);
		setRepeat(false);
		setDescription('');
		setRepeatInterval('kuukausittain');
		setRepeatValue('');
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
							<Text appearance="hint" style={styles.labelTop}>
								Kategoria
							</Text>
							<View style={styles.chipsRow}>
								{CATEGORIES.map(({ key, label }) => {
									const selected = key === category;
									return (
										<TouchableOpacity
											key={key}
											onPress={() => {
												setCategory(key);
												if (
													type ===
													TransactionType.Income
												)
													setName(label);
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
										? 'TULON nimi'
										: 'MENON nimi'}
								</Text>
								<Input
									value={name}
									onChangeText={setName}
									placeholder={
										type === TransactionType.Income
											? 'Tulon nimi'
											: 'Menon nimi'
									}
									style={styles.input}
									size="medium"
								/>

								<Text style={styles.inputLabel}>Määrä</Text>
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
								</Text>
								{Platform.OS === 'web' ? (
									<Input
										value={
											date
												? format(date, 'dd-MM-yyyy')
												: ''
										}
										onChangeText={(val) =>
											setDate(val ? parseISO(val) : null)
										}
										placeholder="DD-MM-YYYY"
										style={styles.input}
										size="medium"
									/>
								) : (
									<Datepicker
										date={date || undefined}
										onSelect={(next: Date) => setDate(next)}
										accessoryRight={CalendarIcon}
										style={styles.input}
										size="medium"
									/>
								)}

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
															? { color: '#fff' }
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
								disabled={!isValid}
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
									}
								}}
							>
								{type === TransactionType.Income
									? 'LISÄÄ TULO'
									: 'LISÄÄ MENO'}
							</Button>

							<Button
								size="large"
								style={[
									styles.submitBtn,
									{
										backgroundColor:
											customTheme['color-primary-500'],
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
});
