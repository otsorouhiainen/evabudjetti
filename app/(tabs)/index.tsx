import { MessageCircleQuestion, PiggyBank } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { FixBalanceModal } from '@/app/fixBalanceModal';
import { useAddBalanceReconciliation } from '@/src/finance/hook/useAddBalanceReconciliation';
import { useBalances } from '@/src/finance/hook/useBalances';
//import { useTransactionSummaries } from '@/src/finance/hook/useTransactionSummaries';

export default function Landing() {
	const { t } = useTranslation();
	const router = useRouter();
	const [initialBalance, setInitialBalance] = useState('');
	const saveBalanceToDb = useAddBalanceReconciliation();
	const [helpVisible, setHelpVisible] = useState(false);

	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth();
	const dayOfMonth = today.getDate();

	const currentMonthBalances = useBalances(year, month, year, month);
	const currentMonthData = currentMonthBalances[0];

	const budgetCreated = currentMonthData?.endBalance !== undefined;
	const displayBalance =
		currentMonthData?.dailyBalances[dayOfMonth - 1]?.balance ?? 0;

	/* Placeholder values for current situation card */
	const DISPOSABLE = displayBalance >= 1000 ? 100 : -20;
	const RUNOUT_DATE = '31.3.2026';

	/*	Intended implementation for disposable income
	const transactionSummary = useTransactionSummaries(year, month, year, month)
	const monthDiff = transactionSummary[0].cashFlow

	const disposableIncome = displayBalance + monthDiff 
	*/

	return (
		<SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
				keyboardShouldPersistTaps="handled"
			>
				<YStack f={1} backgroundColor="$background">
					<YStack f={1} paddingHorizontal={10}>
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
							{/* Current situation card */}
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
									<Text
										textAlign="center"
										fontWeight={'500'}
										fontSize={'$3'}
									>
										{t('Current situation')}{' '}
										{today.toLocaleDateString('fi-FI')}
									</Text>
									<Text
										textAlign="center"
										fontWeight={'800'}
										fontSize={'$3'}
										marginBottom={'-5%'}
									>
										{t('Disposable income this month') +
											':'}
									</Text>
									<Text
										textAlign="center"
										fontWeight={'700'}
										fontSize={'$5'}
										color={
											DISPOSABLE > 0
												? '$primary100'
												: '$color.danger500'
										}
									>
										{DISPOSABLE}€
									</Text>
									{DISPOSABLE <= 0 && (
										<Text
											marginTop={'-5%'}
											color={'$color.danger500'}
										>
											{t('Balance runs out')}{' '}
											{RUNOUT_DATE}
										</Text>
									)}
									<Text>
										{t('Current balance')} {displayBalance}€
									</Text>

									<FixBalanceModal />
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

									<XStack
										mt={'$3'}
										gap={'$3'}
										minWidth={'85%'}
									>
										<Button
											backgroundColor="$primary200"
											onPress={() =>
												router.push('/budget')
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
									style={{ height: '25%' }}
									marginTop={10}
									borderRadius={40}
									backgroundColor="$primary200"
									width="100%"
									color={'white'}
									disabled={initialBalance === ''}
									onPress={async () => {
										const numericBalance =
											Number(initialBalance);
										await saveBalanceToDb(numericBalance);
										router.push('/budget_wizard');
									}}
								>
									{t('Create budget')}
								</Button>
							</YStack>
						)}
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
				</YStack>
			</ScrollView>
		</SafeAreaView>
	);
}
