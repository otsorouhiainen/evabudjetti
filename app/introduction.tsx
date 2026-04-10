import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Checkbox, SizableText, YStack } from 'tamagui';
import { useInstructionStore } from '@/src/store/useInstructionStore';

export default function Introduction() {
	const { t } = useTranslation();
	const { instructionShown, setInstructionShown } = useInstructionStore();

	return (
		<SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
			<YStack
				backgroundColor="$white"
				paddingTop="$paddingmd"
				paddingHorizontal={10}
				alignItems="center"
				flex={1}
				gap={30}
			>
				<YStack allignItems="center"></YStack>
			</YStack>
		</SafeAreaView>
	);
}
