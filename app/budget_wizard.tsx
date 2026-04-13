import { Plus } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Progress, SizableText, YStack } from 'tamagui';
import BudgetWizardItem from '@/src/components/BudgetWizardItem';
import type { PlannedTransaction } from '@/src/dataModel';
import { DEFAULT_ACCOUNT_ID } from '@/src/dataModel';
import { isDbReal } from '@/src/db/client';
import {
	useFetchAllPlannedTransactions,
	useReplaceAllPlannedTransactions,
} from '@/src/finance/hook/usePlannedTransactionMutations';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';
import AddItemPopup from '../src/components/AddItemPopup';
import {
	BUDGET_WIZARD_STEPS,
	type BudgetWizardStep,
} from '../src/constants/wizardConfig';

export default function BudgetWizard() {
	const { t } = useTranslation();
	const router = useRouter();
	const transactions = usePlannedTransactionsStore(
		(state) => state.transactions,
	);
	const replaceAll = usePlannedTransactionsStore((state) => state.replaceAll);
	const fetchAllPlannedTransactions = useFetchAllPlannedTransactions();
	const replaceAllPlannedTransactions = useReplaceAllPlannedTransactions();
	const [stepIndex, setStepIndex] = useState(0);
	const [wizardData, setWizardData] =
		useState<BudgetWizardStep[]>(BUDGET_WIZARD_STEPS);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadTransactions = async () => {
			if (isDbReal) {
				try {
					const dbTransactions = await fetchAllPlannedTransactions();
					replaceAll(dbTransactions);
				} catch (error) {
					console.error(
						'Failed to load planned transactions:',
						error,
					);
				}
			}
			setIsLoading(false);
		};
		loadTransactions();
	}, [fetchAllPlannedTransactions, replaceAll]);

	useEffect(() => {
		setWizardData((prev) =>
			prev.map((step) => ({
				...step,
				items:
					step.header === 'Incomes'
						? transactions.filter((t) => t.type === 'income')
						: transactions.filter((t) => t.type === 'expense'),
			})),
		);
	}, [transactions]);
	const [popupVisible, setPopupVisible] = useState(false);
	const currentStep = wizardData[stepIndex];
	const progressBarValue = ((stepIndex + 1) * 100) / wizardData.length;

	const [selectedItem, setSelectedItem] = useState<PlannedTransaction | null>(
		null,
	);

	function addItem(newItem: PlannedTransaction) {
		newItem.type = currentStep.header === 'Incomes' ? 'income' : 'expense';
		newItem.accountId = DEFAULT_ACCOUNT_ID;
		newItem.categoryId = 0;
		setWizardData((prev) => {
			return prev.map((step, sIdx) =>
				sIdx === stepIndex
					? {
							...step,
							items: [...step.items, newItem],
						}
					: step,
			);
		});
	}

	function editItem(edited: PlannedTransaction) {
		setWizardData((prev) =>
			prev.map((step, sIdx) =>
				sIdx === stepIndex
					? {
							...step,
							items: step.items.map((item) =>
								item.name === selectedItem?.name
									? {
											...item,
											name: edited.name,
											amount: edited.amount,
											categoryId: edited.categoryId,
											startDate: edited.startDate,
											endDate: edited.endDate,
											recurrenceBase:
												edited.recurrenceBase,
											recurrenceInterval:
												edited.recurrenceInterval,
										}
									: item,
							),
						}
					: step,
			),
		);
	}

	function deleteItem(item: PlannedTransaction) {
		setWizardData((prev) =>
			prev.map((step, sIdx) =>
				sIdx === stepIndex
					? {
							...step,
							items: step.items.filter(
								(it) => it.name !== item.name,
							),
						}
					: step,
			),
		);
	}

	const closePopUp = () => {
		setSelectedItem(null);
		setPopupVisible(false);
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			{isLoading ? (
				<View style={styles.container}>
					<SizableText>Loading...</SizableText>
				</View>
			) : (
				<View style={styles.container}>
					{/* -- Add Item PopUp -- */}
					<Modal
						visible={popupVisible}
						onRequestClose={() => closePopUp()}
						transparent={true}
					>
						<AddItemPopup
							item={selectedItem}
							onSave={
								selectedItem === null
									? (item) => addItem(item)
									: (item) => editItem(item)
							}
							onDelete={(item) => deleteItem(item)}
							onClose={() => closePopUp()}
						/>
					</Modal>

					<View style={styles.topContent}>
						<Progress
							backgroundColor="$white"
							style={styles.progressBar}
							value={progressBarValue}
						>
							<Progress.Indicator
								backgroundColor="$primary200"
								animation="bouncy"
							/>
						</Progress>
						<SizableText
							color="$primary100"
							style={styles.pageHeader}
							size="$title1"
						>
							{t('Create budget')}
						</SizableText>
						<SizableText
							color="$primary100"
							style={styles.stepHeader}
							size="$title2"
						>
							{t(currentStep.header)}
						</SizableText>
					</View>
					<ScrollView
						contentContainerStyle={{ flexGrow: 1 }}
						style={styles.content}
					>
						{currentStep.items.map((item) => (
							<BudgetWizardItem
								item={item}
								onEdit={(it) => {
									setSelectedItem(it);
									setPopupVisible(true);
								}}
								key={item.name}
							/>
						))}
						{/* Empty Y-stack to get margin after last budget item*/}
						<YStack marginTop="10" />
					</ScrollView>
					<View style={styles.addIconContainer}>
						<Button
							borderRadius={28}
							backgroundColor="$primary200"
							icon={Plus}
							color="$white"
							onPress={() => setPopupVisible(true)}
							style={styles.addIcon}
						/>
					</View>
					<View style={styles.buttonContainer}>
						<Button
							borderRadius={28}
							style={styles.footerButton}
							backgroundColor={
								stepIndex === 0 ? '$primary300' : '$primary200'
							}
							disabled={stepIndex === 0}
							onPress={() => setStepIndex(stepIndex - 1)}
						>
							<SizableText
								adjustsFontSizeToFit
								color="$white"
								size="$title1"
							>
								{t('Previous')}
							</SizableText>
						</Button>
						{stepIndex === wizardData.length - 1 ? (
							<Button
								borderRadius={28}
								style={styles.footerButton}
								backgroundColor="$primary200"
								onPress={async () => {
									const allItems: PlannedTransaction[] =
										wizardData.flatMap(
											(step) => step.items,
										);
									try {
										if (isDbReal) {
											const savedTransactions =
												await replaceAllPlannedTransactions(
													allItems,
												);
											replaceAll(savedTransactions);
										} else {
											replaceAll(allItems);
										}
										router.push('/');
									} catch (error) {
										console.error(
											'Failed to save planned transactions:',
											error,
										);
									}
								}}
							>
								<SizableText color="$white" size="$title1">
									{t('Finish')}
								</SizableText>
							</Button>
						) : (
							<Button
								borderRadius={28}
								backgroundColor="$primary200"
								style={styles.footerButton}
								onPress={() => setStepIndex(stepIndex + 1)}
							>
								<SizableText
									adjustsFontSizeToFit
									color="$white"
									size="$title1"
								>
									{t('Next')}
								</SizableText>
							</Button>
						)}
					</View>
				</View>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	topContent: {
		height: '20%',
	},
	progressBar: {
		height: '20%',
	},
	container: {
		flexDirection: 'column',
		padding: 20,
		height: '100%',
	},
	dateContainer: {
		flexDirection: 'row',
		height: '20%',
		alignItems: 'center',
		gap: 20,
	},
	content: {
		flexDirection: 'column',
		marginTop: 5,
		height: '60%',
		borderTopWidth: 2,
		borderBottomWidth: 2,
	},
	itemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 5,
		marginTop: 5,
	},
	amountInput: {
		width: '28%',
		height: '100%',
	},
	dateInput: {
		height: '100%',
	},
	footerButton: {
		height: '100%',
		width: '42%',
	},
	buttonContainer: {
		height: '10%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 40,
	},
	itemContent: {
		width: '80%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		gap: 5,
	},
	calendarIcon: {
		width: '5%',
		height: '100%',
	},
	addIcon: {
		marginTop: 10,
		width: '23%',
		height: '100%',
	},
	addIconContainer: {
		alignItems: 'flex-end',
		height: '9%',
	},
	itemName: {
		width: '20%',
	},
	pencilIcon: {
		width: '1%',
		height: '100%',
	},
	pageHeader: {
		marginTop: 20,
	},
	stepHeader: {
		marginTop: 20,
	},
});
