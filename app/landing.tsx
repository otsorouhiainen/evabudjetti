import useBalanceStore from '@/src/store/useBalanceStore';
import useLanguageStore from '@/src/store/useLanguageStore';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';
import { Globe, MessageCircleQuestion, PiggyBank } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, SizableText, Text, XStack, YStack } from 'tamagui';

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
							textAlign="center"
							style={{ height: '100%' }}
						>
							Help
						</SizableText>
						<SizableText
							marginBottom={'2%'}
							textAlign="center"
							style={{ height: '100%' }}
						>
							Help Disposable income
						</SizableText>
						<Button
							onPress={() => setHelpVisible(false)}
							backgroundColor="$primary300"
							alignSelf="center"
							style={{ width: '50%' }}
						>
							<SizableText color="$white">CLOSE</SizableText>
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
					paddingTop={20}
					paddingHorizontal={10}
					gap={5}
					style={{ height: '30%', width: '100%' }}
					// keep overall maxWidth behavior but prefer percent-based outer padding above
				>
					{/* Header */}
					<YStack
						style={{
							height: '100%',
							gap: 5,
							marginTop: 10,
							alignItems: 'center',
						}}
					>
						<Text>EVA Personal Budget</Text>
						<Text>Supporting your financial well-being</Text>

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
						<PiggyBank size={70} style={{ height: '100%' }} />

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
						<YStack
							gap={30}
							width="100%"
							style={{ height: '100%' }}
						>
							<YStack
								style={{ height: '100%', width: '100%' }}
								alignItems="center"
								gap={5}
								backgroundColor="$white"
								borderColor="$gray5"
								borderWidth={1}
							>
								<YStack
									alignItems="center"
									gap={5}
									width="100%"
									style={{ height: '13%' }}
								>
									<Text>
										{new Date().toLocaleDateString('fi-FI')}
									</Text>
									<Text>Money in account</Text>
									<Text>{balance}€ Disposable income</Text>
									<Text>{disposable}€</Text>
									<Button
										backgroundColor="$primary200"
										width="50%"
										style={{ height: '100%' }}
									>
										VIEW DETAILS
									</Button>
								</YStack>
							</YStack>
							<YStack style={{ height: '40%', gap: 10 }}>
								<Button
									style={{ height: '100%' }}
									backgroundColor="$primary200"
									onPress={() =>
										router.push('/add_transaction')
									}
									width="100%"
								>
									ADD INCOME/EXPENSE
								</Button>

								<XStack
									gap={20}
									justifyContent="space-between"
									width="100%"
									style={{ height: '100%' }}
								>
									<Button
										style={{ height: '100%' }}
										backgroundColor="$primary200"
										onPress={() => router.push('/budget')}
									>
										SHOW BUDGET
									</Button>
									<Button
										style={{ height: '100%' }}
										backgroundColor="$primary200"
										onPress={() =>
											router.push('/budget_wizard')
										}
									>
										EDIT BUDGET
									</Button>
								</XStack>
							</YStack>
						</YStack>
					)}

					{!budgetCreated && (
						<YStack
							gap={5}
							style={{
								height: '70%',
								width: '100%',
								alignItems: 'center',
								alignSelf: 'flex-start',
							}}
						>
							<Text>
								No budget created yet. Enter your balance in €
								without commas and press the "Create budget"
								button below to get started!
							</Text>
							<Input
								style={{ height: '30%' }}
								width="100%"
								value={initialBalance}
								onChangeText={setInitialBalance}
								borderColor="$black"
								backgroundColor="$white"
								keyboardType="numeric"
								fontSize={15}
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
								CREATE BUDGET
							</Button>
						</YStack>
					)}
				</YStack>
			</YStack>
		</SafeAreaView>
	);
}
