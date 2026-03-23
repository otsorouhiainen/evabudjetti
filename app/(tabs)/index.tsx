import { Globe, MessageCircleQuestion, PiggyBank } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Button,
	Input,
	ScrollView,
	SizableText,
	Spacer,
	Text,
	XStack,
	YStack,
} from 'tamagui';
import useBalanceStore from '@/src/store/useBalanceStore';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';
import '@/src/utils/i18n';

export default function Landing() {
	const { t, i18n } = useTranslation();

	const transactions = usePlannedTransactionsStore(
		(state) => state.transactions,
	);
	const storeBalance = useBalanceStore((state) => state.balance);
	const storeDisposable = useBalanceStore((state) => state.disposable);
	const setStoreBalance = useBalanceStore((state) => state.change);
	const recalcDisposable = useBalanceStore((state) => state.recalcDisposable);
	const [balance, setBalance] = useState(0);
	const [_disposable, setDisposable] = useState(0);
	const budgetCreated = usePlannedTransactionsStore(
		(state) => state.transactions.length > 0,
	);
	const router = useRouter();
	const [initialBalance, setInitialBalance] = useState('');
	const [helpVisible, setHelpVisible] = useState(false);
	useEffect(() => {
		setBalance(storeBalance);
		setDisposable(storeDisposable);
		recalcDisposable(transactions);
	}, [storeBalance, storeDisposable, transactions, recalcDisposable]);

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
			keyboardShouldPersistTaps="handled"
		>
			<YStack f={1} backgroundColor="$background">
				<YStack
					f={1}
					paddingHorizontal={10}
					// keep overall maxWidth behavior but prefer percent-based outer padding above
				>
					{/* Header */}
					<YStack gap="5" marginTop={10} alignItems="center">
						<Text
							fontSize={'$7'}
							fontWeight={'500'}
							numberOfLines={1}
							adjustsFontSizeToFit
						>
							{t('EVA MyBudget')}
						</Text>

						<Text numberOfLines={1} adjustsFontSizeToFit>
							{t('Supporting your financial well-being')}
						</Text>

						<XStack mt="$1">
							<Button
								backgroundColor="$primary200"
								borderRadius={40}
								size="$5"
								color="white"
								icon={Globe}
								chromeless
								onPress={() => {
									// Check that i18n exists before call
									if (i18n) {
										const currentLang =
											i18n.language || 'fi';
										const nextLang = currentLang.startsWith(
											'fi',
										)
											? 'en'
											: 'fi';
										i18n.changeLanguage(nextLang);
									}
								}}
							>
								{i18n?.language?.startsWith('fi')
									? 'Suomi'
									: 'English'}
							</Button>
						</XStack>

						<XStack mt={'$5'}>
							<Spacer size={'10%'} />
							{/* Piggy Bank Icon */}
							<PiggyBank
								size={110}
								style={{ height: '100%' }}
								color={'$primary100'}
							/>

							{/* Help Icon positioned relative to the piggy bank */}
							<Button
								size={50}
								style={{ height: '100%' }}
								circular
								chromeless
								onPress={() => setHelpVisible(true)}
								icon={
									<MessageCircleQuestion color="$primary100" />
								}
							/>
						</XStack>
					</YStack>

					{budgetCreated && (
						<YStack f={1} ai={'center'}>
							{/* balance snapshot */}
							<YStack
								width={'70%'}
								backgroundColor="$white"
								borderColor="$primary200"
								borderRadius={20}
								borderWidth={2}
								padding={10}
								mt={'$2'}
								mb={'$8'}
							>
								<YStack
									alignItems="center"
									gap={10}
									width="100%"
								>
									<Text fontWeight={'700'} fontSize={'$3'}>
										{new Date().toLocaleDateString('fi-FI')}
									</Text>
									<Text>
										{t('Money in account')} {balance}€
									</Text>
									<Button
										borderRadius={40}
										backgroundColor="$primary200"
										size={'$buttons.lg'}
									>
										<Text
											color={'$white'}
											numberOfLines={1}
											adjustsFontSizeToFit
										>
											{t('VIEW DETAILS')}
										</Text>
									</Button>
								</YStack>
							</YStack>
							{/* Buttons */}
							<YStack f={1} ai="center">
								<Button
									backgroundColor="$primary200"
									onPress={() =>
										router.push('/add_transaction2')
									}
									minWidth={'85%'}
									height={70}
									borderRadius={40}
								>
									<Text
										color={'$white'}
										fontWeight={'700'}
										fontSize={'$4'}
										numberOfLines={1}
										adjustsFontSizeToFit
									>
										{t('ADD INCOME/EXPENSE')}
									</Text>
								</Button>

								<XStack mt={'$3'} gap={'$3'} minWidth={'85%'}>
									<Button
										backgroundColor="$primary200"
										onPress={() => router.push('/budget')}
										height={80}
										f={1}
										borderRadius={40}
									>
										<Text
											color={'$white'}
											fontWeight={'700'}
											fontSize={'$3'}
											ta={'center'}
											numberOfLines={2}
											adjustsFontSizeToFit
										>
											SHOW{'\n'}BUDGET
										</Text>
									</Button>
									<Button
										backgroundColor="$primary200"
										onPress={() =>
											router.push('/budget_wizard')
										}
										height={80}
										f={1}
										borderRadius={40}
									>
										<Text
											color={'$white'}
											fontWeight={'700'}
											fontSize={'$3'}
											ta={'center'}
											numberOfLines={2}
											adjustsFontSizeToFit
										>
											EDIT{'\n'} BUDGET
										</Text>
									</Button>
								</XStack>
							</YStack>
						</YStack>
					)}

					{!budgetCreated && (
						<YStack gap={5} paddingHorizontal={25}>
							<Text numberOfLines={4} adjustsFontSizeToFit>
								{t('No budget created')}
							</Text>
							<Input
								style={{ height: '25%' }}
								width="100%"
								value={initialBalance}
								onChangeText={setInitialBalance}
								borderColor="$primary100"
								backgroundColor="$white"
								keyboardType="numeric"
								fontSize={15}
							/>
							<Button
								style={{ height: '20%' }}
								marginTop={10}
								borderRadius={40}
								backgroundColor="$primary200"
								width="100%"
								color={'white'}
								onPress={() => {
									setStoreBalance(Number(initialBalance));
									router.push('/budget_wizard');
								}}
								disabled={initialBalance === ''}
								numberOfLines={1}
								adjustsFontSizeToFit
							>
								{t('Create budget')}
							</Button>
						</YStack>
					)}
				</YStack>
			</YStack>

			{/* Help Modal */}
			{helpVisible && (
				<YStack
					position="absolute"
					top={0}
					left={0}
					right={0}
					bottom={0}
					backgroundColor="rgba(0,0,0,0.5)"
					justifyContent="center"
					alignItems="center"
				>
					<YStack
						backgroundColor="$white"
						borderColor="$black"
						borderWidth={2}
						borderRadius={10}
						width={'70%'}
						shadowColor="$black"
						gap={'3%'}
						padding={20}
					>
						<SizableText
							textAlign="center"
							maxFontSizeMultiplier={1.3}
						>
							{t('Help')}
						</SizableText>
						<SizableText
							textAlign="center"
							maxFontSizeMultiplier={1.3}
						>
							{t('Help Disposable income')}
						</SizableText>
						<Button
							onPress={() => setHelpVisible(false)}
							backgroundColor="$primary200"
							borderRadius={40}
							alignSelf="center"
						>
							<SizableText
								color="$white"
								maxFontSizeMultiplier={1}
							>
								{t('CLOSE')}
							</SizableText>
						</Button>
					</YStack>
				</YStack>
			)}
		</ScrollView>
	);
}
