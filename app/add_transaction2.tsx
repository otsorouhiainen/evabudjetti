import { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	AlertDialog,
	Button,
	Input,
	PortalProvider,
	ScrollView,
	SizableText,
	Stack,
	XStack,
	YStack,
} from 'tamagui';
import type {
	Category,
	Persisted,
	RealTransaction,
	TransactionOccurrence,
} from '@/src/dataModel';
import { useCategoryStore } from '@/src/store/categoryStore';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';
import useRealTransactionsStore from '@/src/store/useRealTransactionsStore';
import RealTransactionModal from '../src/components/RealTransactionModal';

export default function AddTransaction() {
	const [popupVisible, setPopupVisible] = useState(false);
	const addTransaction = useRealTransactionsStore((state) => state.add);
	const [transactionType, setTransactionType] = useState<
		'income' | 'expense'
	>('income');
	const [showSuccess, setShowSuccess] = useState(false);

	// Category state
	const [categories, setCategories] = useState<Persisted<Category>[]>([]);

	// Planned transaction state
	const [plannedModalVisible, setPlannedModalVisible] = useState(false);
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
		  }
		| undefined
	>(undefined);

	// Stores
	const addCategory = useCategoryStore((state) => state.addCategory);
	const storeCategories = useCategoryStore();
	const plannedTransactions = usePlannedTransactionsStore(
		(state) => state.transactionsForTwoYears,
	);

	// Sync categories from store
	useEffect(() => {
		setCategories(storeCategories.categories);
	}, [storeCategories.categories]);

	// Get upcoming planned transactions
	useEffect(() => {
		const upcomingTxns = (plannedTransactions || []).filter((t) => {
			const txnDate = new Date(t.date);
			const now = new Date();
			now.setHours(0, 0, 0, 0);
			return txnDate >= now;
		});
		const twentyUpComingTxns = upcomingTxns
			.sort((a, b) => {
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			})
			.slice(0, 20);
		setUpcomingPlannedTransactions(twentyUpComingTxns);
	}, [plannedTransactions]);

	// Dynamic categories for modal
	const dynamicCategories = (categories || []).map((c) => ({
		key: c.id,
		label: c.name,
		type: c.type,
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
		} catch (e) {
			console.error('Failed to add category:', e);
			throw e;
		}
	};

	const handleSelectPlanned = (txn: TransactionOccurrence) => {
		setSelectedPlannedTxn(txn);
		setAllocationAmount(txn.amount.toString());
	};

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

	const confirmPlannedAllocation = () => {
		if (selectedPlannedTxn) {
			// Pre-fill the popup with planned transaction data
			setPrefillData({
				name: selectedPlannedTxn.name,
				amount: Number(allocationAmount),
				date: new Date(selectedPlannedTxn.date),
				category: selectedPlannedTxn.categoryId,
			});
			setTransactionType(selectedPlannedTxn.type);

			setPlannedModalVisible(false);
			setSelectedPlannedTxn(null);
			setAllocationAmount('');

			// Open the add item popup with pre-filled data
			setPopupVisible(true);
		}
	};

	function addItem(newItem: RealTransaction) {
		addTransaction({
			...newItem,
			type: transactionType,
			categoryId: newItem.categoryId ?? 0,
		});
		setPopupVisible(false);
		setPrefillData(undefined); // Clear prefill data
		setShowSuccess(true);
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<PortalProvider>
				<Modal
					visible={popupVisible}
					onRequestClose={() => {
						setPopupVisible(false);
						setPrefillData(undefined);
					}}
					transparent={true}
				>
					<RealTransactionModal
						onAdd={(item) => addItem(item)}
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

				{/* Pick from Planned Modal */}
				{plannedModalVisible && (
					<Stack
						position="absolute"
						top={0}
						bottom={0}
						left={0}
						right={0}
						backgroundColor="rgba(0, 0, 0, 0.4)"
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
							width={'90%'}
							height={'80%'}
							gap={20}
						>
							<SizableText size={'$title1'} marginBottom={8}>
								{selectedPlannedTxn
									? 'Allocate Amount'
									: 'Select a planned transaction'}
							</SizableText>

							{!selectedPlannedTxn ? (
								<ScrollView>
									<YStack gap={10}>
										{upcomingPlannedTransactions.length ===
										0 ? (
											<SizableText>
												No upcoming planned transactions
												found.
											</SizableText>
										) : (
											upcomingPlannedTransactions.map(
												(txn) => (
													<Button
														style={{
															height: 'auto',
														}}
														key={`${txn.realTransaction?.id ?? txn.plannedTransaction?.id}-${txn.date}`}
														onPress={() =>
															handleSelectPlanned(
																txn,
															)
														}
														padding={5}
														borderWidth={1}
														borderColor="$black"
														backgroundColor="$gray100"
														pressStyle={{
															backgroundColor:
																'$gray200',
														}}
														justifyContent="space-between"
													>
														<YStack>
															<SizableText fontWeight="bold">
																{txn.name}
															</SizableText>
															<SizableText
																size="$body"
																color="$gray500"
															>
																{new Date(
																	txn.date,
																).toLocaleDateString()}
															</SizableText>
														</YStack>
														<SizableText>
															{txn.type ===
															'income'
																? 'Income'
																: 'Expense'}
														</SizableText>
														<SizableText>
															{txn.amount} €
														</SizableText>
													</Button>
												),
											)
										)}
									</YStack>
								</ScrollView>
							) : (
								<YStack gap={20}>
									<SizableText>
										Allocating for:{' '}
										<SizableText fontWeight="bold">
											{selectedPlannedTxn.name}
										</SizableText>
									</SizableText>
									<Input
										value={allocationAmount}
										onChangeText={
											handleAllocationAmountChange
										}
										keyboardType="decimal-pad"
										placeholder="Amount to allocate"
										height={40}
										borderRadius={6}
										px="10px"
										fontSize={'$title3'}
									/>
									<XStack
										justifyContent="space-between"
										marginTop={20}
									>
										<Button
											style={{ height: '100%' }}
											onPress={() =>
												setSelectedPlannedTxn(null)
											}
											borderColor={'$primary200'}
										>
											<SizableText color={'$primary200'}>
												Back
											</SizableText>
										</Button>
										<Button
											style={{ height: '100%' }}
											onPress={confirmPlannedAllocation}
											backgroundColor={'$primary200'}
										>
											<SizableText color={'$white'}>
												Confirm
											</SizableText>
										</Button>
									</XStack>
								</YStack>
							)}

							{!selectedPlannedTxn && (
								<Button
									onPress={() =>
										setPlannedModalVisible(false)
									}
									borderColor={'$primary200'}
									style={{ height: '10%' }}
								>
									<SizableText
										style={{ height: '50%' }}
										color={'$primary200'}
									>
										Close
									</SizableText>
								</Button>
							)}
						</YStack>
					</Stack>
				)}

				{/* Main Content */}
				<YStack
					flex={1}
					paddingTop={20}
					paddingHorizontal={20}
					gap={15}
				>
					{/* Select Planned Button */}
					<Button
						width={'100%'}
						size="$4"
						backgroundColor="$primary200"
						onPress={() => setPlannedModalVisible(true)}
						alignSelf="center"
					>
						<SizableText color="$white">Select planned</SizableText>
					</Button>

					{/* Income/Expense Buttons */}
					<XStack gap={10} justifyContent="center">
						<Button
							onPress={() => {
								setTransactionType('income');
								setPrefillData(undefined);
								setPopupVisible(true);
							}}
							backgroundColor="$primary200"
							borderRadius={40}
							flex={1}
						>
							Income
						</Button>
						<Button
							onPress={() => {
								setTransactionType('expense');
								setPrefillData(undefined);
								setPopupVisible(true);
							}}
							backgroundColor="$primary200"
							borderRadius={40}
							flex={1}
						>
							Expense
						</Button>
					</XStack>

					{/* Success alert */}
					<AlertDialog
						open={showSuccess}
						onOpenChange={setShowSuccess}
					>
						<AlertDialog.Portal>
							<AlertDialog.Overlay
								opacity={0.5}
								backgroundColor={'$black'}
							/>
							<AlertDialog.Content
								bordered
								elevate
								width={'55%'}
								padding={24}
								borderRadius={16}
							>
								<SizableText size={'$title1'}>
									{'Saved'}
								</SizableText>
								<SizableText size={'$title3'}>
									{`${transactionType} added`}
								</SizableText>
								<XStack
									justifyContent="flex-end"
									marginTop="15"
								>
									<Button
										backgroundColor={'$primary200'}
										style={{ height: '100%' }}
										color={'$white'}
										alignSelf="center"
										onPress={() => setShowSuccess(false)}
										fontSize={'$title3'}
									>
										<SizableText
											size={'$title3'}
											color={'$white'}
										>
											OK
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
