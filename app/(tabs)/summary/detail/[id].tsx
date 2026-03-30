import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { Button, Card, Separator, SizableText, XStack, YStack } from 'tamagui';
import { useTransactionSummaries } from '@/src/finance/hook/useTransactionSummaries';

export default function DetailedMonthScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [expensesExpanded, setExpensesExpanded] = useState(false);
	const [incomeExpanded, setIncomeExpanded] = useState(false);
	const { t } = useTranslation();

	const [yearStr, monthStr] = id.split('-');
	const yearNum = Number(yearStr);
	const monthNum = Number(monthStr);

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
	const translatedMonth = t(monthKeys[monthNum]);
	const formattedTitle = `${translatedMonth} ${yearNum}`;

	const monthDataArray = useTransactionSummaries(
		yearNum,
		monthNum,
		yearNum,
		monthNum,
	);
	const monthData = monthDataArray[0];

	const { expenseBreakdown, incomeBreakdown, totalExpenses, totalIncomes } =
		useMemo(() => {
			if (!monthData)
				return {
					expenseBreakdown: [],
					incomeBreakdown: [],
					totalExpenses: 0,
					totalIncomes: 0,
				};

			const totalExp = monthData.totalExpense || 0;
			const totalInc = monthData.totalIncome || 0;

			const rawExpenses = monthData.expenseByCategory || {};
			const rawIncomes = monthData.incomeByCategory || {};

			const expenseBreakdown = Object.entries(rawExpenses)
				.map(([categoryId, amount]) => {
					const numAmount = Math.abs(Number(amount));
					const categoryName =
						categoryId === 'null' || categoryId === 'undefined'
							? t('Uncategorized')
							: `${t('Category')} ${categoryId}`;

					return [categoryName, numAmount] as [string, number];
				})
				.sort((a, b) => b[1] - a[1]);

			const incomeBreakdown = Object.entries(rawIncomes)
				.map(([categoryId, amount]) => {
					const numAmount = Math.abs(Number(amount));
					const categoryName =
						categoryId === 'null' || categoryId === 'undefined'
							? t('Uncategorized')
							: `${t('Category')} ${categoryId}`;
					return [categoryName, numAmount] as [string, number];
				})
				.sort((a, b) => b[1] - a[1]);

			if (expenseBreakdown.length === 0 && totalExp > 0) {
				expenseBreakdown.push([t('Uncategorized'), totalExp]);
			}
			if (incomeBreakdown.length === 0 && totalInc > 0) {
				incomeBreakdown.push([t('Uncategorized'), totalInc]);
			}

			return {
				expenseBreakdown,
				incomeBreakdown,
				totalExpenses: totalExp,
				totalIncomes: totalInc,
			};
		}, [monthData, t]);

	return (
		<YStack flex={1} backgroundColor="$background">
			<Stack.Screen options={{ title: formattedTitle }} />
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
								{expenseBreakdown.length === 0 ? (
									<SizableText
										color="$color10"
										textAlign="center"
										paddingVertical="$2"
									>
										{t('No expenses this month')}
									</SizableText>
								) : (
									<YStack
										separator={
											<Separator
												borderColor="$borderColor"
												opacity={0.5}
											/>
										}
									>
										{expenseBreakdown.map(
											([cat, amount]) => (
												<YStack
													key={cat}
													paddingVertical="$2"
												>
													<XStack justifyContent="space-between">
														<SizableText
															fontWeight="bold"
															fontSize={15}
														>
															{cat}
														</SizableText>
														<SizableText fontWeight="bold">
															{amount.toFixed(2)}€
														</SizableText>
													</XStack>
												</YStack>
											),
										)}
									</YStack>
								)}
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
							<Card
								bordered
								padding="$4"
								backgroundColor="#FAFAFA"
							>
								{incomeBreakdown.length === 0 ? (
									<SizableText
										color="$color10"
										textAlign="center"
										paddingVertical="$2"
									>
										{t('No income this month')}
									</SizableText>
								) : (
									<YStack
										separator={
											<Separator
												borderColor="$borderColor"
												opacity={0.5}
											/>
										}
									>
										{incomeBreakdown.map(
											([cat, amount]) => (
												<YStack
													key={cat}
													paddingVertical="$2"
												>
													<XStack justifyContent="space-between">
														<SizableText
															fontWeight="bold"
															fontSize={15}
														>
															{cat}
														</SizableText>
														<SizableText fontWeight="bold">
															{amount.toFixed(2)}€
														</SizableText>
													</XStack>
												</YStack>
											),
										)}
									</YStack>
								)}
							</Card>
						)}
					</YStack>
				</YStack>
			</ScrollView>
		</YStack>
	);
}
