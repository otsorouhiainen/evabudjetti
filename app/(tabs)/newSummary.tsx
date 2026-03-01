import {
	AlertCircle,
	Calendar,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	DollarSign,
} from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Card, SizableText, View, XStack, YStack } from 'tamagui';
import { test_transactions } from '@/src/utils/fakeTransactions';
import { allMonthsData, type MonthSummary } from '@/src/utils/mockDataSummary';

export default function BudgetPOC() {
	const router = useRouter();

	const [selectedYear, setSelectedYear] = useState<string | null>(null);
	const [selectedMonthId, setSelectedMonthId] = useState<string | null>(null);

	// Extract unique years from the data
	const availableYears = useMemo(() => {
		const years = allMonthsData.map((m) => m.year);
		return Array.from(new Set(years)).sort((a, b) => a.localeCompare(b));
	}, []);

	// Filter months for the selected year
	const monthsForYear = useMemo(() => {
		if (!selectedYear) return [];
		return allMonthsData.filter((m) => m.year === selectedYear);
	}, [selectedYear]);

	// Find the specific month if one is selected
	const currentMonth = useMemo(() => {
		if (!selectedMonthId) return null;
		return allMonthsData.find((m) => m.id === selectedMonthId);
	}, [selectedMonthId]);

	// Handle the back button
	const handleBackPress = () => {
		if (selectedMonthId) {
			setSelectedMonthId(null);
		} else if (selectedYear) {
			setSelectedYear(null);
		} else {
			router.push('/');
		}
	};

	return (
		<YStack flex={1} backgroundColor="$background">
			<XStack
				padding="$4"
				alignItems="center"
				justifyContent="space-between"
				borderBottomWidth={1}
				borderColor="$borderColor"
			>
				<Button size="$3" onPress={handleBackPress}>
					{selectedMonthId
						? '< Takaisin'
						: selectedYear
							? '< Vuodet'
							: '< Koti'}
				</Button>
				<SizableText fontWeight="bold">Eva - OmaBudjetti</SizableText>
				<View width={60} />
			</XStack>

			<ScrollView>
				<YStack padding="$4" gap="$3">
					{!selectedYear && !selectedMonthId && (
						<>
							<SizableText
								size="$5"
								color="$color10"
								marginBottom="$2"
							>
								Valitse vuosi
							</SizableText>
							{availableYears.map((year) => (
								<YearListCard
									key={year}
									year={year}
									onPress={() => setSelectedYear(year)}
								/>
							))}
						</>
					)}

					{selectedYear && !selectedMonthId && (
						<>
							<SizableText
								size="$5"
								color="$color10"
								marginBottom="$2"
							>
								{selectedYear} Kuukaudet
							</SizableText>
							{monthsForYear.map((item) => (
								<MonthListCard
									key={item.id}
									item={item}
									onPress={() => setSelectedMonthId(item.id)}
								/>
							))}
						</>
					)}
					{selectedMonthId && currentMonth && (
						<DetailedMonthView month={currentMonth} />
					)}
				</YStack>
			</ScrollView>
		</YStack>
	);
}

function YearListCard({
	year,
	onPress,
}: {
	year: string;
	onPress: () => void;
}) {
	return (
		<Card
			bordered
			padding="$4"
			onPress={onPress}
			backgroundColor="white"
			borderColor="$borderColor"
			pressStyle={{ scale: 0.98 }}
		>
			<XStack justifyContent="space-between" alignItems="center">
				<XStack gap="$4" alignItems="center">
					<View
						padding="$2"
						borderRadius={100}
						backgroundColor="#f0f4f8"
					>
						<Calendar size={20} color="#0277bd" />
					</View>
					<SizableText fontWeight="bold" size="$6">
						Vuosi {year}
					</SizableText>
				</XStack>
				<ChevronRight size={20} color="$color10" />
			</XStack>
		</Card>
	);
}
function MonthListCard({
	item,
	onPress,
}: {
	item: MonthSummary;
	onPress: () => void;
}) {
	const isWarning = item.status === 'warning';
	return (
		<Card
			bordered
			padding="$4"
			onPress={onPress}
			backgroundColor={isWarning ? '#fce4ec' : '#e0f2f1'}
			borderColor={isWarning ? '#f8bbd0' : '#b2dfdb'}
			pressStyle={{ scale: 0.98 }}
		>
			<XStack justifyContent="space-between" alignItems="center">
				<XStack gap="$4" alignItems="center">
					<View
						padding="$2"
						borderRadius={100}
						backgroundColor="white"
						borderWidth={1}
						borderColor="$borderColor"
					>
						{isWarning ? (
							<AlertCircle size={20} color="#d32f2f" />
						) : (
							<DollarSign size={20} color="#00796b" />
						)}
					</View>
					<YStack>
						<SizableText fontWeight="bold" size="$5">
							{item.name}
						</SizableText>
						<SizableText color={isWarning ? '#d32f2f' : '#00796b'}>
							{item.change > 0
								? `+${item.change.toFixed(2)}`
								: item.change.toFixed(2)}
							€
						</SizableText>
					</YStack>
				</XStack>
				<XStack gap="$3" alignItems="center">
					<SizableText color="$color10">{item.year}</SizableText>
					<ChevronRight size={20} color="$color10" />
				</XStack>
			</XStack>
		</Card>
	);
}

function DetailedMonthView({ month }: { month: MonthSummary }) {
	const [expensesExpanded, setExpensesExpanded] = useState(false);
	const [incomeExpanded, setIncomeExpanded] = useState(false);

	const categoryBreakdown = useMemo(() => {
		const expenses = test_transactions.filter((t) => t.type === 'expense');
		const grouped: Record<string, number> = {};
		for (const t of expenses) {
			grouped[t.category] = (grouped[t.category] || 0) + t.amount;
		}
		return Object.entries(grouped);
	}, []);

	return (
		<YStack gap="$4">
			<YStack>
				<SizableText size="$3" color="$color10">
					{'<Budgetin nimi>'}
				</SizableText>
				<SizableText size="$9" fontWeight="800">
					{month.name} {month.year}
				</SizableText>
			</YStack>

			<YStack gap="$2">
				<Button
					height={60}
					justifyContent="space-between"
					onPress={() => setExpensesExpanded(!expensesExpanded)}
					backgroundColor="white"
					borderWidth={1}
					borderColor="$borderColor"
				>
					<SizableText fontWeight="bold">Menot</SizableText>
					<XStack gap="$2" alignItems="center">
						<SizableText fontWeight="bold">2345,00€</SizableText>
						{expensesExpanded ? (
							<ChevronUp size={20} />
						) : (
							<ChevronDown size={20} />
						)}
					</XStack>
				</Button>

				{expensesExpanded && (
					<Card bordered padding="$4" backgroundColor="#fafafa">
						{categoryBreakdown.map(([cat, amount]) => (
							<YStack key={cat} marginBottom="$3">
								<XStack justifyContent="space-between">
									<SizableText fontWeight="bold">
										{cat}
									</SizableText>
									<SizableText fontWeight="bold">
										{amount.toFixed(2)}€
									</SizableText>
								</XStack>
								<YStack
									paddingLeft="$4"
									marginTop="$1"
									borderLeftWidth={1}
									borderColor="$borderColor"
								>
									<XStack justifyContent="space-between">
										<SizableText size="$2" color="$color10">
											Esimerkki rivi
										</SizableText>
										<SizableText size="$2" color="$color10">
											/kk
										</SizableText>
									</XStack>
								</YStack>
							</YStack>
						))}
					</Card>
				)}
			</YStack>

			<YStack gap="$2">
				<Button
					height={60}
					justifyContent="space-between"
					onPress={() => setIncomeExpanded(!incomeExpanded)}
					backgroundColor="white"
					borderWidth={1}
					borderColor="$borderColor"
				>
					<SizableText fontWeight="bold">Tulot</SizableText>
					<XStack gap="$2" alignItems="center">
						<SizableText fontWeight="bold">2150,00€</SizableText>
						{incomeExpanded ? (
							<ChevronUp size={20} />
						) : (
							<ChevronDown size={20} />
						)}
					</XStack>
				</Button>

				{incomeExpanded && (
					<Card bordered padding="$4">
						<SizableText color="$color10" textAlign="center">
							Tuloja ei vielä ryhmitelty
						</SizableText>
					</Card>
				)}
			</YStack>
		</YStack>
	);
}
