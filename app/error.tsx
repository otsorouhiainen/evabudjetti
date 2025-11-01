import { MessageCircleQuestion, PiggyBank } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, SizableText, Stack, XStack, YStack } from 'tamagui';

export default function Landing() {
	const router = useRouter();
	const [helpVisible, setHelpVisible] = useState(false);

	return (
		<>
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				overflow="scroll"
			>
				<YStack
					flex={1}
					paddingTop={24}
					paddingHorizontal={20}
					gap={18}
					maxWidth={600}
				>
					{/* Header */}
					<YStack
						alignItems="center"
						marginTop={6}
						justifyContent="space-between"
						gap={'$2'}
					>
						<Button
							disabled
							transparent
							icon={<PiggyBank />}
							size={400}
							marginBottom={-80}
							color={'$primary300'}
						/>
						<SizableText size={'$title2'}>404</SizableText>
						<SizableText size={'$title2'} marginBottom={16}>
							Jokin meni pieleen
						</SizableText>
					</YStack>
					{/* Primary CTA */}

					<Button
						size="$4"
						marginTop={8}
						borderRadius={28}
						paddingVertical={20}
						backgroundColor="$primary300"
						color="$white"
						onPress={() => router.push('/landing')}
					>
						PALAA ETUSIVULLE
					</Button>
					<YStack height={48} />
				</YStack>
			</YStack>
		</>
	);
}
