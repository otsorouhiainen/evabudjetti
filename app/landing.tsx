import { MessageCircleQuestion, PiggyBank } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, SizableText, Stack, XStack, YStack } from 'tamagui';

export default function Landing() {
	const router = useRouter();
	const [helpVisible, setHelpVisible] = useState(false);

	return (
		<>
			{/* Help Modal */}
			{helpVisible && (
				<Stack
					position="absolute"
					top={0}
					bottom={0}
					left={0}
					right={0}
					backgroundColor="$black"
					justifyContent="center"
					alignItems="center"
					zIndex={10}
				>
					<YStack
						backgroundColor="$white"
						borderColor={'$black'}
						borderWidth={2}
						opacity={1}
						borderRadius={16}
						padding={24}
						width="80%"
						minWidth={220}
						shadowColor="$black"
						shadowOffset={{ width: 0, height: 2 }}
						shadowOpacity={0.18}
						shadowRadius={8}
						elevation={8}
						gap={'$4'}
					>
						<SizableText
							size={'$title1'}
							marginBottom={8}
							fontFamily="$heading"
						>
							Help
						</SizableText>
						<SizableText
							size={'$title2'}
							marginBottom={16}
							fontFamily="$body"
						>
							Welcome to the budget app! Use the bottom navigation
							buttons to move between sections. Add an income or
							expense by pressing "Add income/expense". You can
							view and edit your budget and see a summary of your
							finances.
						</SizableText>
						<Button
							onPress={() => setHelpVisible(false)}
							backgroundColor={'$primary300'}
							size={42}
							padding={22}
							alignSelf="center"
						>
							<SizableText
								fontFamily="$body"
								fontWeight="400"
								color="$white"
							>
								CLOSE
							</SizableText>
						</Button>
					</YStack>
				</Stack>
			)}
			<YStack flex={1}>
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						alignItems: 'center',
					}}
				>
					<YStack
						flex={1}
						paddingTop={24}
						paddingHorizontal={20}
						gap={18}
						width="100%"
						maxWidth={800}
					>
						{/* Header */}
						<YStack
							alignItems="center"
							marginTop={6}
							justifyContent="space-between"
							gap={'$2'}
						>
							<SizableText
								fontWeight={'$7'}
								size={'$title1'}
								fontFamily="$heading"
							>
								EVA Personal Budget
							</SizableText>
							<SizableText
								size={'$title2'}
								fontFamily="$body"
								hoverStyle={{ cursor: 'help' }}
							>
								Helping you manage your finances
							</SizableText>
							<Button
								disabled
								transparent
								icon={<PiggyBank />}
								size={200}
								marginBottom={-190}
								color={'$primary300'}
							></Button>
						</YStack>

						{/* Illustration row */}
						<XStack
							alignItems="center"
							justifyContent="center"
							marginTop={16}
							position="relative"
							alignSelf="center"
							width={200}
							height={120}
						>
							<Button
								position="absolute"
								top={0}
								right="-10%"
								width="50%"
								aspectRatio={1}
								minWidth={28}
								maxWidth={42}
								zIndex={5}
								onPress={() => setHelpVisible(true)}
								circular
								size="$4"
								chromeless
								icon={<MessageCircleQuestion size={28} />}
							/>
						</XStack>

						{/* Balance card */}
						<YStack
							alignSelf="center"
							width="90%"
							maxWidth={480}
							borderRadius={16}
							alignItems="center"
							paddingVertical={16}
							gap={6}
							backgroundColor={'$white'}
							shadowColor={'$black'}
							shadowOffset={{ width: 0, height: 2 }}
							shadowOpacity={0.15}
							shadowRadius={8}
							elevation={6}
						>
							<SizableText
								size={'$title2'}
								fontWeight={'$5'}
								marginBottom={4}
								fontFamily="$heading"
							>
								04.10.2025
							</SizableText>
							<YStack>
								<SizableText
									size={'$title2'}
									fontFamily="$body"
								>
									Account balance:{' '}
									<SizableText
										size={'$title3'}
										fontWeight={'$4'}
										fontFamily="$body"
									>
										1234€
									</SizableText>
								</SizableText>
								<SizableText
									size={'$title2'}
									fontFamily="$body"
								>
									Discretionary:{' '}
									<SizableText
										size={'$title3'}
										fontWeight={'$4'}
										fontFamily="$body"
									>
										123€
									</SizableText>
								</SizableText>
							</YStack>
							<Button
								marginTop={10}
								alignSelf="center"
								backgroundColor={'$primary500'}
								size={'$4'}
								padding={22}
							>
								<SizableText
									fontFamily="$body"
									fontWeight="400"
									color="$white"
								>
									VIEW DETAILS
								</SizableText>
							</Button>
						</YStack>

						{/* Primary CTA */}
						<Button
							size="$4"
							marginTop={8}
							borderRadius={28}
							paddingVertical={20}
							backgroundColor="$primary300"
							onPress={() => router.push('/add_transaction')}
						>
							<SizableText
								fontFamily="$body"
								fontWeight="400"
								color="$white"
							>
								ADD INCOME/EXPENSE
							</SizableText>
						</Button>

						{/* Secondary CTAs */}
						<XStack gap={14} justifyContent="space-between">
							<Button
								flex={1}
								size={'$4'}
								borderRadius={18}
								padding={20}
								backgroundColor={'$primary300'}
								onPress={() => router.push('/budget')}
							>
								<SizableText
									fontFamily="$body"
									fontWeight="400"
									color="$white"
								>
									VIEW BUDGET
								</SizableText>
							</Button>
							<Button
								flex={1}
								size={'$4'}
								borderRadius={18}
								padding={20}
								backgroundColor={'$primary300'}
							>
								<SizableText
									fontFamily="$body"
									fontWeight="400"
									color="$white"
								>
									EDIT BUDGET
								</SizableText>
							</Button>
						</XStack>
						<YStack height={48} />
					</YStack>
				</ScrollView>
			</YStack>
		</>
	);
}
