import { Calendar } from '@tamagui/lucide-icons';
import { format, parse } from 'date-fns';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Button, Input, SizableText } from 'tamagui';

type Props = {
	value?: Date | null;
	onChange: (value: Date) => void;
};

export const MultiPlatformDatePicker: React.FC<Props> = ({
	value,
	onChange,
}) => {
	const [editorDate, setEditorDate] = useState<string>('');
	const [datePickerOpen, setDatePickerOpen] = useState(false);
	const [date, setDate] = useState<Date | null>(value || null);

	useEffect(() => {
		setDate(value || null);
		setEditorDate(value ? format(value, 'dd-MM-yyyy') : '');
	}, [value]);

	// Only update date when editorDate is valid and different
	useEffect(() => {
		const isValidDateFormat = /^\d{2}-\d{2}-\d{4}$/.test(editorDate);
		if (isValidDateFormat) {
			const parsedDate = parse(editorDate, 'dd-MM-yyyy', new Date());
			if (!Number.isNaN(parsedDate.getTime())) {
				const parsedTime = parsedDate.getTime();
				let currentTime = NaN;
				if (date instanceof Date) {
					currentTime = date.getTime();
				}
				if (Number.isNaN(currentTime) || parsedTime !== currentTime) {
					onChange(parsedDate);
					setDate(parsedDate);
				}
			}
		}
	}, [editorDate, onChange, date]);

	if (Platform.OS === 'web') {
		return (
			<View style={styles.dateElementsContainer}>
				<Input
					style={{ height: '100%' }}
					placeholder="Write the date here (DD-MM-YYYY)"
					value={editorDate}
					onChangeText={setEditorDate}
				/>
			</View>
		);
	}

	return (
		<>
			<DatePicker
				modal
				open={datePickerOpen}
				mode="date"
				date={date instanceof Date ? date : new Date()}
				onConfirm={(selectedDate) => {
					setDatePickerOpen(false);
					setDate(selectedDate);
					onChange(selectedDate);
				}}
				onCancel={() => {
					setDatePickerOpen(false);
				}}
			/>
			<View style={styles.dateElementsContainer}>
				<SizableText
					style={{ height: '100%' }}
					color="$primary100"
					size="$title3"
				>
					Date: {editorDate}
				</SizableText>
				<Button
					style={{ height: '100%' }}
					icon={Calendar}
					onPress={() => setDatePickerOpen(true)}
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	dateElementsContainer: {
		height: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
});
