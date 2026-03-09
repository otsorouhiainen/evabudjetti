import { AlertCircle, ChevronRight, DollarSign } from '@tamagui/lucide-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { Card, SizableText, View, XStack, YStack } from 'tamagui';
import { allMonthsData } from '@/src/utils/mockDataSummary';

export default function MonthsScreen() {
	const { year } = useLocalSearchParams<{ year: string }>();
	const router = useRouter();

	const monthsForYear = useMemo(() => {
		return allMonthsData.filter((m) => m.year === year);
	}, [year]);

	return (
		<YStack flex={1} backgroundColor="$background">
			<ScrollView>
				<YStack padding="$4" gap="$3">
					{monthsForYear.map((item) => {
						const isWarning = item.status === 'warning';
						return (
							<Card
								key={item.id}
								bordered
								padding="$4"
								onPress={() =>
									router.push(`/summary/detail/${item.id}`)
								}
								backgroundColor={
									isWarning ? '#fce4ec' : '#e0f2f1'
								}
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
												{item.name}
											</SizableText>
											<SizableText
												color={
													isWarning
														? '#d32f2f'
														: '#00796b'
												}
											>
												{item.change > 0
													? `+${item.change.toFixed(2)}`
													: item.change.toFixed(2)}
												€
											</SizableText>
										</YStack>
									</XStack>
									<XStack gap="$3" alignItems="center">
										<SizableText color="$color10">
											{item.year}
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
