import { Check } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	Button,
	Checkbox,
	Label,
	ListItem,
	SizableText,
	Text,
	XStack,
	YGroup,
	YStack,
} from 'tamagui';
import { useInstructionStore } from '@/src/store/useInstructionStore';

export default function Introduction() {
	const { t } = useTranslation();
	const router = useRouter();
	const [instructionsRead, setInstructionsRead] = useState(false);
	const { setInstructionShown } = useInstructionStore();

	const showApp = () => {
		setInstructionShown(true);
		router.push('/');
	};

	return (
		<SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
			<YStack
				backgroundColor="$white"
				paddingTop="$paddingmd"
				paddingHorizontal={10}
				alignItems="center"
				flex={1}
				gap={40}
			>
				<YStack alignItems="center">
					<Text
						fontSize="$10"
						fontWeight={700}
						color="$primary100"
						textAlign="center"
						numberOfLines={1}
						adjustsFontSizeToFit
					>
						{t('Welcome')}
					</Text>
					<Text
						fontSize="$7"
						fontWeight={600}
						color="$primary100"
						textAlign="center"
						numberOfLines={1}
						adjustsFontSizeToFit
					>
						{t('to EVA MyBudget')}
					</Text>
				</YStack>

				<YGroup gap={15} width={300}>
					<YGroup.Item>
						<ListItem>
							<SizableText
								size="$title2"
								color="$black"
								textAlign="center"
							>
								{t('1. instruction')}
							</SizableText>
						</ListItem>
					</YGroup.Item>

					<YGroup.Item>
						<ListItem>
							<SizableText
								size="$title2"
								color="$black"
								textAlign="center"
							>
								{t('2. instruction')}
							</SizableText>
						</ListItem>
					</YGroup.Item>

					<YGroup.Item>
						<ListItem>
							<SizableText
								size="$title2"
								color="$black"
								textAlign="center"
							>
								{t('3. instruction')}
							</SizableText>
						</ListItem>
					</YGroup.Item>
				</YGroup>

				<XStack alignItems="center" gap={5}>
					<Checkbox
						id="check"
						checked={instructionsRead}
						onCheckedChange={(val: boolean) =>
							setInstructionsRead(val)
						}
						size="$6"
						borderColor="$primary100"
					>
						<Checkbox.Indicator>
							<Check color="$primary100" />
						</Checkbox.Indicator>
					</Checkbox>

					<Label size="$5" htmlFor="check" color="$primary100">
						{t('I have read the terms and conditions')}
					</Label>
				</XStack>

				<Button
					size={52}
					width={250}
					backgroundColor="$primary100"
					alignSelf="center"
					disabled={!instructionsRead}
					opacity={!instructionsRead ? 0.5 : 1}
					onPress={showApp}
				>
					<SizableText size="$title2" color="$white">
						{t('Continue')}
					</SizableText>
				</Button>
			</YStack>
		</SafeAreaView>
	);
}
