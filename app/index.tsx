import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SizableText, YStack } from 'tamagui';

export default function InstructionLanding() {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
			<YStack>
				<SizableText size="$title1" color="$primary200">
					{t('EVA MyBudget')}
				</SizableText>
				<SizableText size="$title2" color="$black">
					{t('Supporting your financial well-being')}
				</SizableText>
			</YStack>
		</SafeAreaView>
	);
}
