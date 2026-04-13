import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	AlertDialog,
	Button,
	Input,
	PortalProvider,
	ScrollView,
	SizableText,
	XStack,
	YStack,
} from 'tamagui';
import {
	type Category,
	DEFAULT_ACCOUNT_ID,
	type Persisted,
	type RealTransaction,
	type TransactionOccurrence,
} from '@/src/dataModel';
import { isDbReal } from '@/src/db/client';
import { useAddRealTransaction } from '@/src/finance/hook/useAddRealTransaction';
import { useCategoryStore } from '@/src/store/categoryStore';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';
import useRealTransactionsStore from '@/src/store/useRealTransactionsStore';
import RealTransactionModal from '../src/components/RealTransactionModal';

export default function AddTransaction() {
	const { t } = useTranslation();
	const [popupVisible, setPopupVisible] = useState(false);
	const [entryMode, setEntryMode] = useState<'addNew' | 'adjustBudgeted'>(
		'addNew',
	);
	const [transactionType, setTransactionType] = useState<
		'income' | 'expense'
	>('expense');
	const [showSuccess, setShowSuccess] = useState(false);

	const [categories, setCategories] = useState<Persisted<Category>[]>([]);
	const [selectedPlannedTxn, setSelectedPlannedTxn] =
		useState<TransactionOccurrence | null>(null);
	const [allocationAmount, setAllocationAmount] = useState('');
	const [upcomingPlannedTransactions, setUpcomingPlannedTransactions] =
		useState<TransactionOccurrence[]>([]);
	const [prefillData, setPrefillData] = useState<
		| {
				name?: string;
				amount?: number;
				date?: Date;
				category?: number;
				plannedTransactionId?: number | null;
		  }
		| undefined
	>(undefined);

	const addTransaction = useRealTransactionsStore((state) => state.add);
	const addRealTransactionToDb = useAddRealTransaction();
	const addCategory = useCategoryStore((state) => state.addCategory);
	const storeCategories = useCategoryStore();
	const plannedTransactions = usePlannedTransactionsStore(
		(state) => state.transactionsForTwoYears,
	);

	useEffect(() => {
		setCategories(storeCategories.categories);
	}, [storeCategories.categories]);

	useEffect(() => {
		const upcomingTxns = (plannedTransactions || []).filter((t) => {
			const txnDate = new Date(t.date);
			const now = new Date();
			now.setHours(0, 0, 0, 0);
			return txnDate >= now;
		});

		const twentyUpcomingTxns = upcomingTxns
			.sort(
				(a, b) =>
					new Date(a.date).getTime() - new Date(b.date).getTime(),
			)
			.slice(0, 20);

		setUpcomingPlannedTransactions(twentyUpcomingTxns);
	}, [plannedTransactions]);

	const dynamicCategories = (categories || []).map((category) => ({
		key: category.id,
		label: category.name,
		type: category.type,
	}));

	const handleAddCategory = async (categoryName: string) => {
		if (!categoryName.trim()) return;

		try {
			await addCategory({
				name: categoryName,
				type: transactionType,
				color: '#000000',
				icon: 'circle',
			});
		} catch (error) {
			console.error('Failed to add category:', error);
			throw error;
		}
	};

	const handleSelectPlanned = (txn: TransactionOccurrence) => {
		setSelectedPlannedTxn(txn);
		setAllocationAmount(
			(txn.realTransaction?.amount ?? txn.amount).toString(),
		);
	};

	const formatEuropeanDate = (date: Date): string =>
		new Intl.DateTimeFormat('fi-FI', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		}).format(new Date(date));

	const handleAllocationAmountChange = (newValue: string) => {
		const numeric = newValue.replace(/[^0-9.,]/g, '');
		const dotSeparators = numeric.replace(',', '.');
		const parts = dotSeparators.split('.');
		if (parts.length === 1) {
			setAllocationAmount(parts[0]);
		} else {
			const integer = parts[0];
			const decimal = parts.slice(1).join('').slice(0, 2);
			setAllocationAmount(`${integer}.${decimal}`);
		}
	};

	const handleOpenAddNewModal = () => {
		setPrefillData(undefined);
		setPopupVisible(true);
	};

	async function addItem(newItem: RealTransaction) {
		const transactionToInsert: RealTransaction = {
			...newItem,
			type: newItem.type,
			categoryId: newItem.categoryId ?? 0,
			plannedTransactionId:
				newItem.plannedTransactionId ??
				prefillData?.plannedTransactionId ??
				null,
		};

		try {
			if (isDbReal) {
				const insertedTransaction =
					await addRealTransactionToDb(transactionToInsert);
				addTransaction(insertedTransaction);
			} else {
				addTransaction(transactionToInsert);
			}

			setPopupVisible(false);
			setPrefillData(undefined);
			setShowSuccess(true);
		} catch (error) {
			console.error('Failed to save real transaction:', error);
		}
	}

	const handleSubmitAdjustment = async () => {
		if (!selectedPlannedTxn) return;
		const numericAmount = Number(allocationAmount);
		if (!Number.isFinite(numericAmount) || numericAmount <= 0) return;

		await addItem({
			accountId: DEFAULT_ACCOUNT_ID,
			name: selectedPlannedTxn.name,
			amount: numericAmount,
			date: new Date(selectedPlannedTxn.date),
			type: selectedPlannedTxn.type,
			categoryId: selectedPlannedTxn.categoryId,
			plannedTransactionId:
				selectedPlannedTxn.plannedTransaction?.id ?? null,
		});

		setTransactionType(selectedPlannedTxn.type);
		setSelectedPlannedTxn(null);
		setAllocationAmount('');
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<PortalProvider>
				<Modal
					visible={popupVisible}
					onRequestClose={() => {
						setPopupVisible(false);
						setPrefillData(undefined);
					}}
					transparent
				>
					<RealTransactionModal
						onAdd={(item) => {
							void addItem({ ...item, type: transactionType });
						}}
						onClose={() => {
							setPopupVisible(false);
							setPrefillData(undefined);
						}}
						transactionType={transactionType}
						categories={dynamicCategories}
						onAddCategory={handleAddCategory}
						prefillData={prefillData}
					/>
				</Modal>

				<YStack
					flex={1}
					paddingTop={20}
					paddingHorizontal={20}
					gap={15}
				>
					<XStack gap={10}>
						<Button
							onPress={() => setEntryMode('addNew')}
							backgroundColor={
								entryMode === 'addNew'
									? '$primary200'
									: '$white'
							}
							borderColor="$primary200"
							borderWidth={1}
							borderRadius={14}
							height={58}
							flex={1}
						>
							<SizableText
								fontSize="$7"
								fontWeight="700"
								color={
									entryMode === 'addNew'
										? '$white'
										: '$primary200'
								}
							>
								{t('Record new')}
							</SizableText>
						</Button>
						<Button
							onPress={() => setEntryMode('adjustBudgeted')}
							backgroundColor={
								entryMode === 'adjustBudgeted'
									? '$primary200'
									: '$white'
							}
							borderColor="$primary200"
							borderWidth={1}
							borderRadius={14}
							height={58}
							flex={1}
						>
							<SizableText
								fontSize="$7"
								fontWeight="700"
								color={
									entryMode === 'adjustBudgeted'
										? '$white'
										: '$primary200'
								}
							>
								{t('Adjust budgeted')}
							</SizableText>
						</Button>
					</XStack>

					<XStack gap={10}>
						<Button
							onPress={() => setTransactionType('income')}
							backgroundColor={
								transactionType === 'income'
									? '$primary200'
									: '$white'
							}
							borderColor="$primary200"
							borderWidth={1}
							borderRadius={14}
							height={54}
							flex={1}
						>
							<SizableText
								fontSize="$6"
								fontWeight="700"
								color={
									transactionType === 'income'
										? '$white'
										: '$primary200'
								}
							>
								{t('Income short')}
							</SizableText>
						</Button>
						<Button
							onPress={() => setTransactionType('expense')}
							backgroundColor={
								transactionType === 'expense'
									? '$primary200'
									: '$white'
							}
							borderColor="$primary200"
							borderWidth={1}
							borderRadius={14}
							height={54}
							flex={1}
						>
							<SizableText
								fontSize="$6"
								fontWeight="700"
								color={
									transactionType === 'expense'
										? '$white'
										: '$primary200'
								}
							>
								{t('Expense short')}
							</SizableText>
						</Button>
					</XStack>

					{entryMode === 'addNew' ? (
						<YStack gap={12}>
							<Button
								width="100%"
								size="$5"
								backgroundColor="$primary200"
								onPress={handleOpenAddNewModal}
								alignSelf="center"
							>
								<SizableText color="$white">
									{transactionType === 'income'
										? t('Record new income')
										: t('Record new expense')}
								</SizableText>
							</Button>
							<SizableText color="$gray700" textAlign="center">
								{t('Fill details in next view.')}
							</SizableText>
						</YStack>
					) : (
						<YStack flex={1} gap={12}>
							<SizableText size="$title3" fontWeight="700">
								{t('Select budgeted transaction to adjust')}
							</SizableText>
							<ScrollView flex={1}>
								<YStack gap={8} paddingBottom={6}>
									{upcomingPlannedTransactions
										.filter(
											(txn) =>
												txn.type === transactionType,
										)
										.map((txn) => {
											const key = `${txn.realTransaction?.id ?? txn.plannedTransaction?.id}-${txn.date}`;
											const isSelected =
												selectedPlannedTxn
													?.plannedTransaction?.id ===
													txn.plannedTransaction
														?.id &&
												selectedPlannedTxn?.date ===
													txn.date;
											const correctedAmount =
												txn.realTransaction?.amount;

											return (
												<Button
													key={key}
													onPress={() =>
														handleSelectPlanned(txn)
													}
													height="auto"
													padding={10}
													borderWidth={1}
													borderColor="$primary200"
													backgroundColor={
														isSelected
															? '$primary300'
															: '$gray100'
													}
													justifyContent="space-between"
												>
													<YStack
														alignItems="flex-start"
														gap={2}
													>
														<SizableText fontWeight="700">
															{txn.name}
														</SizableText>
														<SizableText
															size="$2"
															color="$gray700"
														>
															{formatEuropeanDate(
																txn.date,
															)}
														</SizableText>
														<SizableText
															size="$2"
															color="$gray700"
														>
															{t(
																'Budgeted amount line',
																{
																	amount: txn.amount,
																},
															)}
														</SizableText>
														{correctedAmount !=
															null && (
															<SizableText
																size="$2"
																color="$primary200"
															>
																{t(
																	'Corrected real amount line',
																	{
																		amount: correctedAmount,
																	},
																)}
															</SizableText>
														)}
													</YStack>
												</Button>
											);
										})}
									{upcomingPlannedTransactions.filter(
										(txn) => txn.type === transactionType,
									).length === 0 && (
										<SizableText>
											{t(
												'No upcoming budgeted transactions.',
											)}
										</SizableText>
									)}
								</YStack>
							</ScrollView>

							<YStack gap={8}>
								<SizableText size="$title3" fontWeight="700">
									{selectedPlannedTxn
										? t('Adjusting budgeted amount line', {
												amount: selectedPlannedTxn.amount,
											})
										: t(
												'Select budgeted transaction first',
											)}
								</SizableText>
								<Input
									value={allocationAmount}
									onChangeText={handleAllocationAmountChange}
									keyboardType="decimal-pad"
									placeholder={t(
										'Corrected actual amount (€)',
									)}
									height={48}
									borderRadius={10}
									px="10px"
									fontSize="$title3"
									disabled={!selectedPlannedTxn}
								/>
								<Button
									onPress={() => {
										void handleSubmitAdjustment();
									}}
									backgroundColor="$primary200"
									disabled={
										!selectedPlannedTxn ||
										!allocationAmount ||
										Number(allocationAmount) <= 0
									}
								>
									<SizableText color="$white">
										{t('Save adjustment')}
									</SizableText>
								</Button>
							</YStack>
						</YStack>
					)}

					<AlertDialog
						open={showSuccess}
						onOpenChange={setShowSuccess}
					>
						<AlertDialog.Portal>
							<AlertDialog.Overlay
								key="success"
								opacity={0.5}
								backgroundColor="$black"
							/>
							<AlertDialog.Content
								bordered
								elevate
								width="55%"
								padding={24}
								borderRadius={16}
							>
								<SizableText size="$title1">
									{t('Saved')}
								</SizableText>
								<SizableText size="$title3">
									{entryMode === 'adjustBudgeted'
										? t('Adjustment saved')
										: t('{{transactionType}} added', {
												transactionType: t(
													transactionType === 'income'
														? 'Income'
														: 'Expense',
												),
											})}
								</SizableText>
								<XStack
									justifyContent="flex-end"
									marginTop={15}
								>
									<Button
										backgroundColor="$primary200"
										height="100%"
										onPress={() => setShowSuccess(false)}
									>
										<SizableText
											size="$title3"
											color="$white"
										>
											{t('OK')}
										</SizableText>
									</Button>
								</XStack>
							</AlertDialog.Content>
						</AlertDialog.Portal>
					</AlertDialog>
				</YStack>
			</PortalProvider>
		</SafeAreaView>
	);
}
