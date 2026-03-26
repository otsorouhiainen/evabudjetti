import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { Button, Card, SizableText, XStack, YStack, Separator } from 'tamagui';
import { useOccurrencesAndBalances } from '@/src/finance/hook/useOccurrencesAndBalances';

export default function DetailedMonthScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [expensesExpanded, setExpensesExpanded] = useState(false);
	const [incomeExpanded, setIncomeExpanded] = useState(false);
	const { t } = useTranslation();

	const [yearStr, monthStr] = id.split('-');
    const yearNum = Number(yearStr);
    const monthNum = Number(monthStr);

	const monthDataArray = useOccurrencesAndBalances(yearNum, monthNum, yearNum, monthNum);
    const monthData = monthDataArray[0];

	const { expenseBreakdown, incomeBreakdown, totalExpenses, totalIncomes } = useMemo(() => {
        const expenses: Record<string, number> = {};
        const incomes: Record<string, number> = {};
        let totalExp = 0;
        let totalInc = 0;

        if (!monthData) return { expenseBreakdown: [], incomeBreakdown: [], totalExpenses: 0, totalIncomes: 0 };

        for (const occ of monthData.transactionOccurrences) {
            // If planned, prefix so the user knows it's an estimate.
            const name = occ.realTransaction 
                ? occ.name 
                : `${occ.name} (${t('Planned')})`;
            
            const amount = Math.abs(occ.amount);

            if (occ.type === 'expense') {
                expenses[name] = (expenses[name] || 0) + amount;
                totalExp += amount;
            } else {
                incomes[name] = (incomes[name] || 0) + amount;
                totalInc += amount;
            }
        }

		return {
            expenseBreakdown: Object.entries(expenses).sort((a, b) => b[1] - a[1]),
            incomeBreakdown: Object.entries(incomes).sort((a, b) => b[1] - a[1]),
            totalExpenses: totalExp,
            totalIncomes: totalInc
        };
    }, [monthData, t]);

	return (
		<YStack flex={1} backgroundColor="$background">
			<Stack.Screen
				options={{ title: `${monthNum + 1} / ${yearNum}` }}
			/>
			<ScrollView>
				<YStack padding="$4" gap="$4" paddingBottom="$10">
					<YStack gap="$2">
						<Button
							height={60}
							justifyContent="space-between"
							onPress={() =>
								setExpensesExpanded(!expensesExpanded)
							}
							backgroundColor="white"
							borderWidth={1}
							borderColor="$borderColor"
						>
							<SizableText fontWeight="bold">
								{t('Expenses')}
							</SizableText>
							<XStack gap="$2" alignItems="center">
								<SizableText fontWeight="bold">
                                	{totalExpenses.toFixed(2)}€
                            	</SizableText>
								{expensesExpanded ? (
									<ChevronUp size={20} />
								) : (
									<ChevronDown size={20} />
								)}
							</XStack>
						</Button>

						{expensesExpanded && (
							<Card
								bordered
								padding="$4"
								backgroundColor="#fafafa"
							>
								<YStack separator={<Separator borderColor="$borderColor" opacity={0.5} />}>
									{expenseBreakdown.map(([cat, amount]) => (
										<YStack key={cat} margin="$1">
											<XStack justifyContent="space-between">
												<SizableText fontWeight="bold">
													{cat}
												</SizableText>
												<SizableText fontWeight="bold">
													{amount.toFixed(2)}€
												</SizableText>
											</XStack>
										</YStack>
									))}
								</YStack>
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
							<SizableText fontWeight="bold">
								{t('Incomes')}
							</SizableText>
							<XStack gap="$2" alignItems="center">
								<SizableText fontWeight="bold">
                                	{totalIncomes.toFixed(2)}€
                            	</SizableText>
								{incomeExpanded ? (
									<ChevronUp size={20} />
								) : (
									<ChevronDown size={20} />
								)}
							</XStack>
						</Button>

						{incomeExpanded && (
							<Card bordered
								padding="$4"
								backgroundColor="#FAFAFA"
							>
								<YStack separator={<Separator borderColor="$borderColor" opacity={0.5}/>}>
									{incomeBreakdown.map(([cat, amount]) => (
										<YStack key={cat} margin="$1">
											<XStack justifyContent="space-between">
												<SizableText fontWeight="bold">
													{cat}
												</SizableText>
												<SizableText fontWeight="bold">
													{amount.toFixed(2)}€
												</SizableText>
											</XStack>
										</YStack>
									))}
								</YStack>
							</Card>
						)}
					</YStack>
				</YStack>
			</ScrollView>
		</YStack>
	);
}
