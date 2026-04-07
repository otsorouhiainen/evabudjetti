import {
	AlertCircle,
	ChevronRight,
	DollarSign,
	Minus,
} from '@tamagui/lucide-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { Card, SizableText, View, XStack, YStack } from 'tamagui';
import { useTransactionOccurrencesCache } from '@/src/finance/cache/transactionOccurrencesCache';
import { useTransactionSummaries } from '@/src/finance/hook/useTransactionSummaries';
import { createMonthKey } from '@/src/finance/logic/util';

export default function BudgetMonthsScreen() {
	const { year } = useLocalSearchParams<{ year: string }>();
	const router = useRouter();
	const { t } = useTranslation();

	const yearNum = Number(year);

	const yearlySummaries = useTransactionSummaries(yearNum, 0, yearNum, 11);

	const occurrencesCache = useTransactionOccurrencesCache((state) => state);

	const monthKeys = [
		'january',
		'february',
		'march',
		'april',
		'may',
		'june',
		'july',
		'august',
		'september',
		'october',
		'november',
		'december',
	];

	return (
		<YStack flex={1} backgroundColor="$background">
			<ScrollView contentInsetAdjustmentBehavior="automatic">
				<YStack padding="$4" gap="$3">
					{yearlySummaries.map((_, index) => {
						const routeId = `${yearNum}-${index.toString().padStart(2, '0')}`;
						const monthKey = createMonthKey(yearNum, index);

						const monthOccurrences =
							occurrencesCache.getMonth(
								monthKey,
							).transactionOccurrences;

						let plannedCashFlow = 0;
						for (const occ of monthOccurrences) {
							if (!occ.realTransaction) {
								if (occ.type === 'income') {
									plannedCashFlow += Math.abs(occ.amount);
								} else if (occ.type === 'expense') {
									plannedCashFlow -= Math.abs(occ.amount);
								}
							}
						}

						const change = plannedCashFlow;
						const isWarning = change < 0;
						const isNeutral = change === 0;

						const translatedMonth = t(monthKeys[index]);

						const bgColor = isWarning
							? '#fce4ec'
							: isNeutral
								? '#f5f5f5'
								: '#e0f2f1';
						const borderColor = isWarning
							? '#f8bbd0'
							: isNeutral
								? '#e0e0e0'
								: '#b2dfdb';
						const iconColor = isWarning
							? '#d32f2f'
							: isNeutral
								? '#757575'
								: '#00796b';

						return (
							<Card
								key={routeId}
								bordered
								padding="$4"
								onPress={() =>
									router.push(`/budget/detail/${routeId}`)
								}
								backgroundColor={bgColor}
								borderColor={borderColor}
								pressStyle={{ scale: 0.98 }}
							>
								<XStack
									justifyContent="space-between"
									alignItems="center"
								>
									<XStack gap="$4" alignItems="center">
										<View
											padding="$2"
											borderRadius={100}
											backgroundColor="white"
											borderWidth={1}
											borderColor="$borderColor"
										>
											{isWarning ? (
												<AlertCircle
													size={20}
													color={iconColor}
												/>
											) : isNeutral ? (
												<Minus
													size={20}
													color={iconColor}
												/>
											) : (
												<DollarSign
													size={20}
													color={iconColor}
												/>
											)}
										</View>
										<YStack>
											<SizableText
												fontWeight="bold"
												size="$5"
											>
												{translatedMonth}
											</SizableText>
											<SizableText color={iconColor}>
												{change > 0 ? '+' : ''}
												{change.toFixed(2)} €
											</SizableText>
										</YStack>
									</XStack>
									<XStack gap="$3" alignItems="center">
										<SizableText color="$color10">
											{yearNum}
										</SizableText>
										<ChevronRight
											size={20}
											color="$color10"
										/>
									</XStack>
								</XStack>
							</Card>
						);
					})}
				</YStack>
			</ScrollView>
		</YStack>
	);
}
