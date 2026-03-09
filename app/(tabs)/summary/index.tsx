import { Calendar, ChevronRight } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { Card, SizableText, View, XStack, YStack } from 'tamagui';
import { allMonthsData } from '@/src/utils/mockDataSummary';

export default function YearsScreen() {
	const router = useRouter();
	const { t } = useTranslation();

	const availableYears = useMemo(() => {
		const years = allMonthsData.map((m) => m.year);
		return Array.from(new Set(years)).sort((a, b) => a.localeCompare(b));
	}, []);

	return (
		<YStack flex={1} backgroundColor="$background">
			<ScrollView>
				<YStack padding="$4" gap="$3">
					<SizableText size="$5" color="$color10" marginBottom="$2">
						{t('Choose a year')}
					</SizableText>
					{availableYears.map((year) => (
						<Card
							key={year}
							bordered
							padding="$4"
							onPress={() => router.push(`/summary/${year}`)}
							backgroundColor="white"
							borderColor="$borderColor"
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
										backgroundColor="#f0f4f8"
									>
										<Calendar size={20} color="#0277bd" />
									</View>
									<SizableText fontWeight="bold" size="$6">
										{t('Year')} {year}
									</SizableText>
								</XStack>
								<ChevronRight size={20} color="$color10" />
							</XStack>
						</Card>
					))}
				</YStack>
			</ScrollView>
		</YStack>
	);
}
