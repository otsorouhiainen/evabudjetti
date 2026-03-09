import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Card, SizableText, XStack, YStack } from 'tamagui';
import { test_category_names, test_transactions } from '@/src/utils/fakeTransactions';
import { allMonthsData } from '@/src/utils/mockDataSummary';

export default function DetailedMonthScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [expensesExpanded, setExpensesExpanded] = useState(false);
    const [incomeExpanded, setIncomeExpanded] = useState(false);

    const month = useMemo(() => {
        return allMonthsData.find((m) => m.id === id);
    }, [id]);

    const categoryBreakdown = useMemo(() => {
        const expenses = test_transactions.filter((t) => t.type === 'expense');
        const grouped: Record<string, number> = {};
        for (const t of expenses) {
            grouped[test_category_names[t.categoryId]] =
                (grouped[test_category_names[t.categoryId]] || 0) + t.amount;
        }
        return Object.entries(grouped);
    }, []);

    if (!month) return null;

    return (
        <YStack flex={1} backgroundColor="$background">
            <Stack.Screen options={{ title: `${month.name}n tiedot` }} />
            <ScrollView>
                <YStack padding="$4" gap="$4" paddingBottom="$10">
                    <YStack>
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
                                {expensesExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </XStack>
                        </Button>

                        {expensesExpanded && (
                            <Card bordered padding="$4" backgroundColor="#fafafa">
                                {categoryBreakdown.map(([cat, amount]) => (
                                    <YStack key={cat} marginBottom="$3">
                                        <XStack justifyContent="space-between">
                                            <SizableText fontWeight="bold">{cat}</SizableText>
                                            <SizableText fontWeight="bold">{amount.toFixed(2)}€</SizableText>
                                        </XStack>
                                        <YStack paddingLeft="$4" marginTop="$1" borderLeftWidth={1} borderColor="$borderColor">
                                            <XStack justifyContent="space-between">
                                                <SizableText size="$2" color="$color10">Esimerkki rivi</SizableText>
                                                <SizableText size="$2" color="$color10">/kk</SizableText>
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
                                {incomeExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
            </ScrollView>
        </YStack>
    );
}