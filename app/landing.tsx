import { Globe, MessageCircleQuestion, PiggyBank } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, SizableText, Text, XStack, YStack } from 'tamagui';
import useBalanceStore from '@/src/store/useBalanceStore';
import useLanguageStore from '@/src/store/useLanguageStore';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';

export default function Landing() {
	const transactions = usePlannedTransactionsStore(
		(state) => state.transactions,
	);
	const storeBalance = useBalanceStore((state) => state.balance);
	const storeDisposable = useBalanceStore((state) => state.disposable);
	const setStoreBalance = useBalanceStore((state) => state.change);
	const recalcDisposable = useBalanceStore((state) => state.recalcDisposable);
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
		recalcDisposable(transactions);
	}, [storeBalance, storeDisposable, transactions, recalcDisposable]);
	return (
		<SafeAreaView style={{ flex: 1}} edges={['left','right','bottom']}>
			<YStack
				f={1}
				backgroundColor="$background"
			>
				<YStack
					paddingHorizontal={10}
					backgroundColor={"$caution"}
					f={1}
					// keep overall maxWidth behavior but prefer percent-based outer padding above
				>
					{/* Header */}
					<YStack
						style={{
							gap: 5,
							marginTop: 10,
							alignItems: 'center',
						}}
					>
						<Text
							fontSize={"$7"}
							fontWeight={"500"}
						>EVA Personal Budget</Text>
						<Text>Supporting your financial well-being</Text>

						<XStack style={{ height: '10%', gap: 20 }}
							mt="$1"
							>
							<Button
								backgroundColor="$primary200"
								borderRadius={40}
								size="$5"
								color="white"
								icon={Globe}
								chromeless
								onPress={() =>
									change(language === 'en' ? 'fi' : 'en')
								}
							>
								{language === 'fi' ? 'Suomi' : 'English'}
							</Button>
						</XStack>
						<XStack
							ac="unset"
							ai="flex-start"
							jc="space-between"
							>
							{/* Piggy Bank Icon inside responsive container */}
							<PiggyBank
								size={110}
								style={{ height: '100%' }}
								color={"$primary100"}
								/>

							{/* Help Icon positioned relative to the piggy bank */}
							<Button
								size={50}
								style={{ height: '100%' }}
								circular
								chromeless
								onPress={() => setHelpVisible(true)}
								icon={<MessageCircleQuestion color="$black" />}
							/>
						</XStack>
					</YStack>

					{budgetCreated && (
						<YStack
						f={1}
						ai={"center"}
						>
							<YStack
								backgroundColor="$white"
								borderColor="$primary200"
								borderRadius={20}
								borderWidth={2}
								padding={10}
							>
								<YStack
									alignItems="center"
									gap={5}
									width="100%"
								>
									<Text>
										{new Date().toLocaleDateString('fi-FI')}
									</Text>
									<Text>Money in account</Text>
									<Text>{balance}€</Text>
									<Text>Disposable income</Text>
									<Text>{disposable}€</Text>
									<Button
										backgroundColor="$primary200"
										width="50%"
										size={"$buttons.lg"}
									>
										<Text color={'$white'}>
											VIEW DETAILS
										</Text>
									</Button>
								</YStack>
							</YStack>
							<YStack
								ai="center"
								paddingHorizontal={10}
								>
								<Button
									backgroundColor="$primary200"
									onPress={() =>
										router.push('/add_transaction')
									}
									size={"$buttons.lg"}
								>
									<Text color={'$white'}>
										ADD INCOME/EXPENSE
									</Text>
								</Button>

								<XStack
									justifyContent="space-between"
								>
									<Button
										backgroundColor="$primary200"
										onPress={() => router.push('/budget')}
										size={"$buttons.lg"}
									>
										<Text color={'$white'}>
											SHOW BUDGET
										</Text>
									</Button>
									<Button
										backgroundColor="$primary200"
										onPress={() =>
											router.push('/budget_wizard')
										}
										size={"$buttons.lg"}
									>
										<Text color={'$white'}>
											EDIT BUDGET
										</Text>
									</Button>
								</XStack>
							</YStack>
						</YStack>
					)}

					{!budgetCreated && (
						<YStack
							gap={5}
							paddingHorizontal={25}
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
								borderRadius={40}
								backgroundColor="$primary200"
								width="100%"
								color={"white"}
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
		</SafeAreaView>
	);
}
