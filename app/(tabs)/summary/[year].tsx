import { AlertCircle, ChevronRight, DollarSign } from '@tamagui/lucide-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { Card, SizableText, View, XStack, YStack } from 'tamagui';
import { useBalances } from '@/src/finance/hook/useBalances';

export default function MonthsScreen() {
	const { year } = useLocalSearchParams<{ year: string }>();
	const router = useRouter();
	const { t } = useTranslation();

	const yearNum = Number(year);

	const yearlyBalances = useBalances(yearNum, 0, yearNum, 11);

	return (
		<YStack flex={1} backgroundColor="$background">
			<ScrollView>
				<YStack padding="$4" gap="$3">
					{yearlyBalances.map((monthData, index) => {
                        // If there is no data for a month, default to 0
                        const start = monthData?.startBalance ?? 0;
                        const end = monthData?.endBalance ?? 0;
                        
                        // Calculate the net change for the month
                        const change = end - start;
                        const isWarning = change < 0;

                        // Format the month name cleanly (e.g., "Tammikuu")
                        const date = new Date(yearNum, index, 1);
                        const monthName = date.toLocaleString('fi-FI', { month: 'long' });
                        
                        // Create the ID to pass to the detail screen (e.g., "2026-00" for Jan)
                        const routeId = `${yearNum}-${index.toString().padStart(2, '0')}`;
						return (
							<Card
                                key={routeId}
                                bordered
                                padding="$4"
                                onPress={() => router.push(`/summary/detail/${routeId}`)}
                                backgroundColor={isWarning ? '#fce4ec' : '#e0f2f1'}
                                borderColor={isWarning ? '#f8bbd0' : '#b2dfdb'}
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
													color="#d32f2f"
												/>
											) : (
												<DollarSign
													size={20}
													color="#00796b"
												/>
											)}
										</View>
										<YStack>
											<SizableText
												fontWeight="bold"
												size="$5"
											>
												{t(monthName)}
											</SizableText>
											<SizableText
												color={
													isWarning
														? '#d32f2f'
														: '#00796b'
												}
											>
												{change > 0
													? `+${change.toFixed(2)}`
													: change.toFixed(2)}
												€
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
