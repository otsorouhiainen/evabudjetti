import useBalanceStore from '@/src/store/useBalanceStore';
import useLanguageStore from '@/src/store/useLanguageStore';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';
import { Globe, MessageCircleQuestion, PiggyBank } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, SizableText, XStack, YStack } from 'tamagui';

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
		<SafeAreaView style={{ flex: 1, height: '100%', width: '100%' }}>
			{/* Help Modal */}
			{helpVisible && (
				<YStack
					backgroundColor="rgba(0,0,0,0.5)"
					justifyContent="center"
					alignItems="center"
					style={{ height: '100%', width: '100%' }}
				>
					<YStack
						backgroundColor="$white"
						borderColor="$black"
						borderWidth={2}
						borderRadius={'4%'}
						padding={'5%'}
						width={'85%'}
						shadowColor="$black"
						gap={'3%'}
					>
						<SizableText
							marginBottom={'1%'}
							fontFamily="$heading"
							textAlign="center"
							style={{ height: '100%' }}
						>
							{i18next.t('Help')}
						</SizableText>
						<SizableText
							marginBottom={'2%'}
							fontFamily="$body"
							textAlign="center"
							style={{ height: '100%' }}
						>
							{i18next.t('Help Disposable income')}
						</SizableText>
						<Button
							onPress={() => setHelpVisible(false)}
							backgroundColor="$primary300"
							alignSelf="center"
							style={{ width: '50%' }}
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
				</YStack>
			)}
			<YStack
				backgroundColor="$background"
				height="100%"
				alignItems="center"
			>
				<YStack
					paddingTop={10}
					paddingHorizontal={10}
					gap={10}
					style={{ height: '55%', width: '100%' }}
					// keep overall maxWidth behavior but prefer percent-based outer padding above
				>
					{/* Header */}
					<YStack
						style={{
							height: '100%',
							gap: 10,
							marginTop: 20,
							alignItems: 'center',
						}}
					>
						<SizableText
							fontWeight="700"
							fontFamily="$heading"
							textAlign="center"
						>
							{i18next.t('EVA Personal Budget')}
						</SizableText>
						<SizableText
							fontFamily="$body"
							textAlign="center"
							color="$gray11"
						>
							{i18next.t('Supporting your financial well-being')}
						</SizableText>

						<XStack style={{ height: '10%', gap: 20 }}>
							<Button
								style={{ height: '100%' }}
								icon={Globe}
								chromeless
								onPress={() =>
									change(language === 'en' ? 'fi' : 'en')
								}
							>
								{language === 'fi' ? 'Suomi' : 'English'}
							</Button>
						</XStack>

						{/* Piggy Bank Icon inside responsive container */}
						<PiggyBank size={150} style={{ height: '100%' }} />

						{/* Help Icon positioned relative to the piggy bank */}
						<Button
							size={50}
							style={{ height: '100%' }}
							circular
							chromeless
							onPress={() => setHelpVisible(true)}
							icon={<MessageCircleQuestion color="$black" />}
						/>
					</YStack>

					{budgetCreated && (
						<YStack gap={'4%'} width="100%">
							<YStack
								width="100%"
								borderRadius={'4%'}
								alignItems="center"
								paddingVertical={'4%'}
								paddingHorizontal={'4%'}
								gap={'2%'}
								backgroundColor="$white"
								borderColor="$gray5"
								borderWidth={1}
							>
								<SizableText
									fontWeight="600"
									marginBottom={'1%'}
									fontFamily="$heading"
									color="$gray11"
								>
									{new Date().toLocaleDateString('fi-FI')}
								</SizableText>

								<YStack
									alignItems="center"
									gap={'1%'}
									width="100%"
								>
									<SizableText fontFamily="$body">
										{i18next.t('Money in account')}
									</SizableText>
									<SizableText
										fontWeight="700"
										fontFamily="$body"
										color="$primary100"
									>
										{balance}€
									</SizableText>
								</YStack>

								<YStack
									alignItems="center"
									gap={'1%'}
									marginTop={'2%'}
								>
									<SizableText fontFamily="$body">
										{i18next.t('Disposable income')}
									</SizableText>
									<SizableText
										fontWeight="700"
										fontFamily="$body"
										color="$primary200"
									>
										{disposable}€
									</SizableText>
								</YStack>

								<Button
									marginTop={'3%'}
									backgroundColor="$primary200"
									width="50%"
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
								backgroundColor="$primary200"
								onPress={() => router.push('/add_transaction')}
								width="100%"
							>
								<SizableText
									fontFamily="$body"
									color="$white"
									fontWeight="600"
								>
									{i18next.t('ADD INCOME/EXPENSE')}
								</SizableText>
							</Button>

							<XStack
								gap={'3%'}
								justifyContent="space-between"
								width="100%"
							>
								<Button
									backgroundColor="$primary200"
									onPress={() => router.push('/budget')}
								>
									<SizableText
										fontFamily="$body"
										fontWeight="600"
										color="$white"
										textAlign="center"
									>
										{i18next.t('SHOW BUDGET')}
									</SizableText>
								</Button>
								<Button
									backgroundColor="$primary200"
									onPress={() =>
										router.push('/budget_wizard')
									}
								>
									<SizableText
										fontFamily="$body"
										fontWeight="600"
										color="$white"
										textAlign="center"
									>
										{i18next.t('EDIT BUDGET')}
									</SizableText>
								</Button>
							</XStack>
						</YStack>
					)}

					{!budgetCreated && (
						<YStack
							gap={10}
							style={{
								height: '45%',
								width: '100%',
								alignItems: 'center',
								alignSelf: 'flex-end',
							}}
						>
							<SizableText
								style={{ height: '30%' }}
								textAlign="center"
								fontFamily="$body"
							>
								{i18next.t(
									'No budget created yet. Enter your balance in € without commas and press the "Create budget" button below to get started!',
								)}
							</SizableText>
							<Input
								style={{ height: '30%' }}
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
								style={{ height: '30%' }}
								marginTop={10}
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
								>
									{i18next.t('CREATE BUDGET')}
								</SizableText>
							</Button>
						</YStack>
					)}
				</YStack>
			</YStack>
		</SafeAreaView>
	);
}
