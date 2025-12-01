import useBalanceStore from '@/src/store/useBalanceStore';
import useLanguageStore from '@/src/store/useLanguageStore';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';
import { Globe, MessageCircleQuestion, PiggyBank } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, SizableText, Stack, XStack, YStack } from 'tamagui';

export default function Landing() {
	const storeBalance = useBalanceStore((state) => state.balance);
	const storeDisposable = useBalanceStore((state) => state.disposable);
	const setStoreBalance = useBalanceStore((state) => state.change);
	const [balance, setBalance] = useState(0);
	const [disposable, setDisposable] = useState(0);
	const budgetCreated = usePlannedTransactionsStore(
		(state) => state.transactions.length > 0,
	);
	const router = useRouter();
	const [initialBalance, setInitialBalance] = useState('');
	const [helpVisible, setHelpVisible] = useState(false);
	const language = useLanguageStore((state) => state.language);
	const change = useLanguageStore((state) => state.change);
	useEffect(() => {
		setBalance(storeBalance);
		setDisposable(storeDisposable);
	}, [storeBalance, storeDisposable]);
	return (
		<SafeAreaView style={{ flex: 1 }}>
			{/* Help Modal */}
			{helpVisible && (
				<Stack
					position="absolute"
					top={0}
					bottom={0}
					left={0}
					right={0}
					backgroundColor="rgba(0,0,0,0.5)"
					justifyContent="center"
					alignItems="center"
					zIndex={100}
				>
					<YStack
						backgroundColor="$white"
						borderColor="$black"
						borderWidth={2}
						borderRadius={16}
						padding={24}
						width="85%"
						maxWidth={400}
						shadowColor="$black"
						shadowOffset={{ width: 0, height: 4 }}
						shadowOpacity={0.3}
						shadowRadius={8}
						elevation={10}
						gap="$4"
					>
						<SizableText
							size="$8"
							marginBottom={8}
							fontFamily="$heading"
							textAlign="center"
						>
							{i18next.t('Help')}
						</SizableText>
						<SizableText
							size="$5"
							marginBottom={16}
							fontFamily="$body"
							textAlign="center"
						>
							{i18next.t('Help Disposable income')}
						</SizableText>
						<Button
							onPress={() => setHelpVisible(false)}
							backgroundColor="$primary300"
							size="$5"
							alignSelf="center"
						>
							<SizableText
								fontFamily="$body"
								fontWeight="400"
								color="$white"
							>
								{i18next.t('CLOSE')}
							</SizableText>
						</Button>
					</YStack>
				</Stack>
			)}
			<YStack flex={1} backgroundColor="$background">
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						alignItems: 'center',
						paddingBottom: 100, // Space for bottom nav
					}}
				>
					<YStack
						flex={1}
						paddingTop="$6"
						paddingHorizontal="$4"
						gap="$4"
						width="100%"
						maxWidth={600}
					>
						{/* Header */}
						<YStack alignItems="center" marginTop="$2" gap="$2">
							<SizableText
								fontWeight="700"
								size="$9"
								fontFamily="$heading"
								textAlign="center"
								lineHeight={34}
							>
								{i18next.t('EVA Personal Budget')}
							</SizableText>
							<SizableText
								size="$5"
								fontFamily="$body"
								textAlign="center"
								color="$gray11"
							>
								{i18next.t(
									'Supporting your financial well-being',
								)}
							</SizableText>

							<XStack marginTop="$2">
								<Button
									icon={Globe}
									size="$3"
									chromeless
									onPress={() =>
										change(language === 'en' ? 'fi' : 'en')
									}
								>
									{language === 'fi' ? 'Suomi' : 'English'}
								</Button>
							</XStack>

							<YStack
								alignItems="center"
								justifyContent="center"
								marginTop="$4"
								marginBottom="$4"
								position="relative"
							>
								{/* Piggy Bank Icon */}
								<PiggyBank size={120} color="$primary100" />

								{/* Help Icon positioned relative to the piggy bank */}
								<Button
									position="absolute"
									top={-10}
									right={-40}
									size="$3"
									circular
									chromeless
									onPress={() => setHelpVisible(true)}
									icon={
										<MessageCircleQuestion
											size={28}
											color="$black"
										/>
									}
								/>
							</YStack>
						</YStack>

						{budgetCreated && (
							<YStack gap="$4" width="100%">
								<YStack
									width="100%"
									borderRadius={16}
									alignItems="center"
									paddingVertical="$5"
									paddingHorizontal="$4"
									gap="$2"
									backgroundColor="$white"
									shadowColor="$black"
									shadowOffset={{ width: 0, height: 2 }}
									shadowOpacity={0.1}
									shadowRadius={8}
									elevation={4}
									borderColor="$gray5"
									borderWidth={1}
								>
									<SizableText
										size="$5"
										fontWeight="600"
										marginBottom="$2"
										fontFamily="$heading"
										color="$gray11"
									>
										{new Date().toLocaleDateString('fi-FI')}
									</SizableText>

									<YStack alignItems="center" gap="$1">
										<SizableText
											size="$5"
											fontFamily="$body"
										>
											{i18next.t('Money in account')}
										</SizableText>
										<SizableText
											size="$8"
											fontWeight="700"
											fontFamily="$body"
											color="$primary100"
										>
											{balance}€
										</SizableText>
									</YStack>

									<YStack
										alignItems="center"
										gap="$1"
										marginTop="$2"
									>
										<SizableText
											size="$5"
											fontFamily="$body"
										>
											{i18next.t('Disposable income')}
										</SizableText>
										<SizableText
											size="$8"
											fontWeight="700"
											fontFamily="$body"
											color="$primary200"
										>
											{disposable}€
										</SizableText>
									</YStack>

									<Button
										marginTop="$4"
										backgroundColor="$primary200"
										size="$5"
										width="100%"
										maxWidth={200}
									>
										<SizableText
											fontFamily="$body"
											fontWeight="600"
											color="$white"
										>
											{i18next.t('VIEW DETAILS')}
										</SizableText>
									</Button>
								</YStack>

								<Button
									size="$6"
									backgroundColor="$primary200"
									onPress={() =>
										router.push('/add_transaction')
									}
								>
									<SizableText
										fontFamily="$body"
										color="$white"
										fontWeight="600"
										size="$5"
									>
										{i18next.t('ADD INCOME/EXPENSE')}
									</SizableText>
								</Button>

								<XStack gap="$3" justifyContent="space-between">
									<Button
										flex={1}
										size="$6"
										backgroundColor="$primary200"
										onPress={() => router.push('/budget')}
									>
										<SizableText
											fontFamily="$body"
											fontWeight="600"
											color="$white"
											size="$4"
											textAlign="center"
										>
											{i18next.t('SHOW BUDGET')}
										</SizableText>
									</Button>
									<Button
										flex={1}
										size="$6"
										backgroundColor="$primary200"
										onPress={() =>
											router.push('/budget_wizard')
										}
									>
										<SizableText
											fontFamily="$body"
											fontWeight="600"
											color="$white"
											size="$4"
											textAlign="center"
										>
											{i18next.t('EDIT BUDGET')}
										</SizableText>
									</Button>
								</XStack>
							</YStack>
						)}

						{!budgetCreated && (
							<YStack alignItems="center" gap="$4" marginTop="$4">
								<SizableText
									textAlign="center"
									size="$5"
									fontFamily="$body"
								>
									{i18next.t(
										'No budget created yet. Enter your balance in € without commas and press the "Create budget" button below to get started!',
									)}
								</SizableText>
								<Input
									size="$5"
									width="100%"
									value={initialBalance}
									onChangeText={setInitialBalance}
									borderColor="$black"
									borderWidth={1}
									backgroundColor="$white"
									keyboardType="numeric"
									placeholder="0"
								/>
								<Button
									marginTop="$2"
									size="$6"
									backgroundColor="$primary100"
									width="100%"
									onPress={() => {
										setStoreBalance(Number(initialBalance));
										router.push('/budget_wizard');
									}}
									disabled={initialBalance === ''}
								>
									<SizableText
										fontFamily="$body"
										color="$white"
										fontWeight="600"
										size="$5"
									>
										{i18next.t('CREATE BUDGET')}
									</SizableText>
								</Button>
							</YStack>
						)}
					</YStack>
				</ScrollView>
			</YStack>
		</SafeAreaView>
	);
}
