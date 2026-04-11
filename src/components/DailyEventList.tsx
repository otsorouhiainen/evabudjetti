import type { Router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, YStack } from 'tamagui';
import type { TransactionOccurrence } from '../dataModel';
import DailyEventListItem from './DailyEventListItem';

interface Props {
	transactions: TransactionOccurrence[];
	monthKey: string;
	selectedDate: Date;
	router?: Router;
	formatCurrency: (value: number, hideSign?: boolean) => string;
}

const DailyEventList: React.FC<Props> = ({
	transactions,
	monthKey,
	selectedDate,
	router,
	formatCurrency,
}) => {
	const { t } = useTranslation();

	// Normalize dates: ensure each txn.date is a Date object so getTime() is available
	const normalizedTxns: TransactionOccurrence[] = transactions.map((t) => {
		const parsedDate =
			// if already a Date keep it, otherwise create a Date from the value
			t.date instanceof Date
				? t.date
				: new Date(t.date as unknown as string);
		return { ...t, date: parsedDate };
	});

	// Sort all transactions by date descending (Newest first)
	const sortedTxns = [...normalizedTxns].sort(
		(a, b) => b.date.getTime() - a.date.getTime(),
	);

	// Grouping all transactions by date (Newest first)
	const txnsByDate: TransactionOccurrence[][] = [];
	let prevDate = '';
	for (const txn of sortedTxns) {
		const newDate = txn.date.toLocaleDateString();
		if (newDate === prevDate) {
			txnsByDate[txnsByDate.length - 1].push(txn);
		} else {
			txnsByDate.push([txn]);
			prevDate = newDate;
		}
	}

	/* 
	Function to calculate the total balance change for 
	all transactions on a given date
	*/
	const sumOfTxns = (index: number) => {
		const dTxns = txnsByDate[index];
		let sum = 0;
		for (const t of dTxns) {
			if (t.type === 'income') sum += t.amount;
			else sum -= t.amount;
		}
		return sum;
	};

	// Array of month names for the title
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	// Get the year and month numbers from monthKey
	const year = Number(monthKey.slice(0, monthKey.indexOf('-')));
	const month =
		Number(monthKey.slice(monthKey.indexOf('-') + 1, monthKey.length)) - 1;

	// Always display current month. Also display year if not the same year as selected date.
	const title =
		monthNames[month] +
		(year !== selectedDate.getFullYear() ? ` ${year}` : '');
	const isSelectedMonth = month === selectedDate.getMonth();

	// Render unique item when selected day has no transactions
	if (txnsByDate.length === 0) {
		if (isSelectedMonth) {
			return (
				<YStack gap={8} marginBottom={8}>
					{title !== '' && (
						<Text fontSize={'$title1'} fontWeight={'700'} mt={'$2'}>
							{title}
						</Text>
					)}
					<DailyEventListItem
						dTxns={[]}
						date={selectedDate}
						sum={0}
						isSelected={true}
						router={router}
						formatCurrency={formatCurrency}
						key={`${selectedDate.getTime()}`}
					></DailyEventListItem>
				</YStack>
			);
		} else {
			return (
				<YStack gap={8} marginBottom={8}>
					{title !== '' && (
						<Text fontSize={'$title1'} fontWeight={'700'} mt={'$2'}>
							{title}
						</Text>
					)}
					<Text style={{ fontStyle: 'italic' }}>
						{t('No transactions')}.
					</Text>
				</YStack>
			);
		}
	} else {
		return (
			<YStack gap={8} marginBottom={8}>
				{title !== '' && (
					<Text fontSize={'$title1'} fontWeight={'700'} mt={'$2'}>
						{title}
					</Text>
				)}
				{txnsByDate.map((dTxns, index) => (
					<DailyEventListItem
						dTxns={dTxns}
						date={dTxns[0].date}
						sum={sumOfTxns(index)}
						isSelected={
							dTxns[0].date.toDateString() ===
							selectedDate.toDateString()
						}
						router={router}
						formatCurrency={formatCurrency}
						key={`${dTxns[0].date.getTime()}`}
					></DailyEventListItem>
				))}
			</YStack>
		);
	}
};

export default DailyEventList;
