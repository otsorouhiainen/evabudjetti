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
	useTheme,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useMemo, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomNav } from '../src/components/BottomNav';
import { customTheme } from '../src/theme/eva-theme';

type CategoryKey = 'Tuki' | 'Vuokratulo' | 'Muu' | 'Lisää kategoria (+)';

const CalendarIcon = (props: IconProps) => (
	<Icon {...props} name="calendar-outline" />
);

export default function AddTransaction() {
	const theme = useTheme();
	const [type, setType] = useState<'TULO' | 'MENO'>('TULO');
	const [category, setCategory] = useState<CategoryKey>('Tuki');
	const [name, setName] = useState('Tuki');
	const [amount, setAmount] = useState('');
	const [date, setDate] = useState<Date | null>(new Date(2025, 10, 4)); // 31/07/2025
	const [repeat, setRepeat] = useState(false);

	const isValid = useMemo(
		() => name.trim().length > 0 && !!date && !!amount,
		[name, amount, date],
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
						<View style={styles.headerRow}>
							<Text category="h5" style={styles.headerTitle}>
								Lisää uusi
							</Text>
						</View>

						{/* Segmented: Tulo / Meno */}
						<View style={styles.segmentWrap}>
							{(['TULO', 'MENO'] as const).map((opt) => (
								<TouchableOpacity
									key={opt}
									activeOpacity={0.9}
									onPress={() => setType(opt)}
									style={[
										styles.segmentItem,
										opt === type && {
											backgroundColor:
												theme['color-primary-500'],
										},
									]}
								>
									<Text
										category="s1"
										style={[
											styles.segmentText,
											opt === type
												? { color: '#fff' }
												: {
														color: theme[
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

						{/* Category chips */}
						<Text appearance="hint" style={styles.labelTop}>
							Kategoria
						</Text>
						<View style={styles.chipsRow}>
							{(
								[
									'Tuki',
									'Vuokratulo',
									'Muu',
									'Lisää kategoria (+)',
								] as CategoryKey[]
							).map((c) => {
								const selected = c === category;
								return (
									<TouchableOpacity
										key={c}
										onPress={() => {
											setCategory(c);
											if (type === 'TULO') setName(c);
										}}
										style={[
											styles.chip,
											selected && {
												backgroundColor:
													theme['color-primary-600'],
											},
										]}
									>
										<Text
											style={[
												styles.chipText,
												selected && { color: '#fff' },
											]}
										>
											{c}
										</Text>
									</TouchableOpacity>
								);
							})}
						</View>

						{/* Form */}
						<Card disabled style={styles.formCard}>
							<Text style={styles.inputLabel}>
								{type === 'TULO' ? 'TULON nimi' : 'MENON nimi'}
							</Text>
							<Input
								value={name}
								onChangeText={setName}
								placeholder={
									type === 'TULO'
										? 'Tulon nimi'
										: 'Menon nimi'
								}
								style={styles.input}
								size="medium"
							/>

							<Text style={styles.inputLabel}>Määrä</Text>
							<Input
								value={amount}
								onChangeText={setAmount}
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

							<Text style={styles.inputLabel}>Päivämäärä</Text>
							{Platform.OS === 'web' ? (
								<Input
									value={
										date
											? date.toISOString().slice(0, 10)
											: ''
									}
									onChangeText={(val) =>
										setDate(val ? new Date(val) : null)
									}
									placeholder="YYYY-MM-DD"
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
								<CheckBox checked={repeat} onChange={setRepeat}>
									Toistuuko tapahtuma?
								</CheckBox>
							</View>
						</Card>

						{/* Submit */}
						<Button
							size="large"
							disabled={!isValid}
							style={[
								styles.submitBtn,
								{ backgroundColor: theme['color-primary-500'] },
							]}
							onPress={() => {
								// submit handler placeholder
								console.log({
									type,
									category,
									name,
									amount,
									date,
									repeat,
								});
							}}
						>
							{type === 'TULO' ? 'LISÄÄ TULO' : 'LISÄÄ MENO'}
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
	safe: { flex: 1 },
	screen: {
		flex: 1,
		paddingTop: 24,
		paddingHorizontal: 20,
		gap: 18,
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
		backgroundColor: '#E9F0F1',
		borderRadius: 24,
		padding: 4,
		gap: 6,
	},
	segmentItem: {
		paddingVertical: 6,
		paddingHorizontal: 16,
		borderRadius: 20,
		backgroundColor: '#fff',
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
		backgroundColor: '#E8F2EE',
		paddingVertical: 8,
		paddingHorizontal: 14,
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
	},
});
