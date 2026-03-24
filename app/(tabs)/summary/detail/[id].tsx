import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { Button, Card, SizableText, XStack, YStack } from 'tamagui';
import { db } from '@/src/db/client';
import { and, gte, lte, eq } from 'drizzle-orm';
import * as schema from '@/src/db/schema';
import { useEffect } from 'react';

export default function DetailedMonthScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [expensesExpanded, setExpensesExpanded] = useState(false);
	const [incomeExpanded, setIncomeExpanded] = useState(false);
	const { t } = useTranslation();

	const [transactions, setTransactions] = useState<any[]>([]);
	const [yearStr, monthStr] = id.split('-');
    const yearNum = Number(yearStr);
    const monthNum = Number(monthStr);

	useEffect(() => {
        async function fetchTransactions() {
            const startOfMonth = new Date(yearNum, monthNum, 1);
            const endOfMonth = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);

            const data = await db
                // 👇 Tell Drizzle exactly what data we want and flatten it
                .select({
                    amount: schema.realTransactions.amount,
                    type: schema.realTransactions.type,
                    categoryName: schema.categories.name,
                })
                .from(schema.realTransactions)
                .leftJoin(
                    schema.categories, 
                    eq(schema.realTransactions.categoryId, schema.categories.id)
                )
                .where(
                    and(
                        gte(schema.realTransactions.date, startOfMonth),
                        lte(schema.realTransactions.date, endOfMonth)
                    )
                );
            setTransactions(data);
        }
        fetchTransactions();
    }, [yearNum, monthNum]);
	
	const categoryBreakdown = useMemo(() => {
        // 👇 Filter by the 'type' column from your schema
        const expenses = transactions.filter((t) => t.type === 'expense'); 
        const grouped: Record<string, number> = {};
        
        for (const t of expenses) {
            // 👇 Read directly from the flattened categoryName
            const catName = t.categoryName || t('Uncategorized');
            // 👇 Read directly from the flattened amount
            grouped[catName] = (grouped[catName] || 0) + Math.abs(t.amount); 
        }
        
        return Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    }, [transactions, t]);

	const totalExpenses = categoryBreakdown.reduce((sum, [, amount]) => sum + amount, 0);
	const totalIncomes = transactions
    	.filter((t) => t.amount > 0)
    	.reduce((sum, t) => sum + t.amount, 0);

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
												<SizableText
													size="$2"
													color="$color10"
												>
													Esimerkki rivi
												</SizableText>
												<SizableText
													size="$2"
													color="$color10"
												>
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
								backgroundColor="#fafafa"
							>
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
												<SizableText
													size="$2"
													color="$color10"
												>
													Esimerkki rivi
												</SizableText>
												<SizableText
													size="$2"
													color="$color10"
												>
													/kk
												</SizableText>
											</XStack>
										</YStack>
									</YStack>
								))}
							</Card>
						)}
					</YStack>
				</YStack>
			</ScrollView>
		</YStack>
	);
}
