import { Calendar } from '@tamagui/lucide-icons';
import { format, formatISO } from 'date-fns';
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
		setEditorDate(
			value ? formatISO(value, { representation: 'date' }) : '',
		);
	}, [value]);

	useEffect(() => {
		if (date) {
			setEditorDate(format(date, 'dd-MM-yyyy'));
		} else {
			setEditorDate('');
		}
	}, [date]);

	useEffect(() => {
		const isValidDateFormat = /^\d{2}-\d{2}-\d{4}$/.test(editorDate);
		if (isValidDateFormat) {
			const [day, month, year] = editorDate.split('-').map(Number);
			const parsedDate: Date = new Date(year, month - 1, day);
			if (!Number.isNaN(parsedDate.getTime())) {
				const parsedTime = parsedDate.getTime();
				console.log('parsed time', parsedTime);
				let currentTime = NaN;
				if (date instanceof Date) {
					currentTime = date.getTime();
				}
				// Only update if the parsed date differs from the current date (compare by timestamp)
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
					onChangeText={(text: string) => {
						setEditorDate(text);
					}}
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
				date={date ?? new Date()}
				onConfirm={(date) => {
					setDatePickerOpen(false);
					setDate(date);
				}}
				onCancel={() => {
					setDatePickerOpen(false);
				}}
			/>
			<View style={styles.dateElementsContainer}>
				<SizableText
					style={{ height: '100%' }}
					color="$primary300"
					size="$title3"
				>
					Date: {editorDate ? format(editorDate, 'dd-MM-yyyy') : ''}
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
