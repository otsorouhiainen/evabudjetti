import { Pencil, Plus } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Progress, SizableText, XStack } from 'tamagui';
import type { PlannedTransaction, RecurrenceBase } from '@/src/dataModel';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';
import AddItemPopup from '../src/components/AddItemPopup';
import { MultiPlatformDatePicker } from '../src/components/MultiPlatformDatePicker';
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
	const [stepIndex, setStepIndex] = useState(0);
	const [wizardData, setWizardData] =
		useState<BudgetWizardStep[]>(BUDGET_WIZARD_STEPS);
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

	function addItem(newItem: PlannedTransaction) {
		newItem.type = currentStep.header === 'Incomes' ? 'income' : 'expense';
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

	function editItem(editedItem: PlannedTransaction) {
		return wizardData.map((step, sIdx) =>
			sIdx === stepIndex
				? {
						...step,
						items: step.items.map((item) => {
							if (item.key === selectedItem?.key) {
								[
									item.name,
									item.amount,
									item.categoryId,
									item.type,
									item.startDate,
									item.endDate,
									item.recurrenceBase,
									item.recurrenceInterval,
								] = [
									editedItem.name,
									editedItem.amount,
									editedItem.categoryId,
									editedItem.type,
									editedItem.startDate,
									editedItem.endDate,
									editedItem.recurrenceBase,
									editedItem.recurrenceInterval,
								];
							}
							console.log(`Edited item "${item.name}".`);
							return item;
						}),
					}
				: step,
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

	function amountInputChange(
		item: PlannedTransaction,
		text: number,
	): BudgetWizardStep[] {
		return wizardData.map((step, sIdx) =>
			sIdx === stepIndex
				? {
						...step,
						items: step.items.map((it) =>
							it.name === item.name
								? {
										...it,
										amount: Number(text),
									}
								: it,
						),
					}
				: step,
		);
	}

	function shortenRecVisual(rec: RecurrenceBase): string {
		switch (rec) {
			case 'day':
				return 'd';
			case 'month':
				return 'm';
			case 'year':
				return 'y';
			case 'week':
				return 'w';
			// case custom for default
			default:
				return 'c';
		}
	}

	function nextOccurence(rec: RecurrenceBase) {
		switch (rec) {
			case 'day':
				return 'week';
			case 'week':
				return 'month';
			case 'month':
				return 'year';
			case 'year':
				return 'day';
			default:
				return 'month';
		}
	}

	function reoccurenceChange(item: PlannedTransaction): BudgetWizardStep[] {
		return wizardData.map((step, sIdx) =>
			sIdx === stepIndex
				? {
						...step,
						items: step.items.map((it) => {
							if (it.name === item.name) {
								const newRec = nextOccurence(
									it.recurrenceBase ?? 'month',
								);
								it.recurrenceBase = newRec;
							}
							return it;
						}),
					}
				: step,
		);
	}

	const [selectedItem, setSelectedItem] = useState<PlannedTransaction | null>(
		null,
	);

	const closePopUp = () => {
		setSelectedItem(null);
		setPopupVisible(false);
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
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
						<XStack
							backgroundColor="$primary300"
							style={styles.itemContainer}
							key={item.name}
						>
							<SizableText
								color="$primary100"
								size="$body"
								style={styles.itemName}
							>
								{item.name}
							</SizableText>
							<View style={styles.itemContent}>
								<MultiPlatformDatePicker
									value={item.startDate}
									color="primary100"
									onChange={(date: Date) => {
										setWizardData((prev) =>
											prev.map((step, sIdx) =>
												sIdx === stepIndex
													? {
															...step,
															items: step.items.map(
																(it) =>
																	it.name ===
																	item.name
																		? {
																				...it,
																				date,
																			}
																		: it,
															),
														}
													: step,
											),
										);
									}}
								/>
								<Input
									size="$title3"
									keyboardType="numeric"
									style={styles.amountInput}
									backgroundColor="$white"
									borderColor="$primary100"
									color="$primary100"
									value={
										item.amount === 0
											? ''
											: item.amount.toString()
									}
									onChangeText={(text: string) => {
										console.log(text);
										setWizardData(
											amountInputChange(
												item,
												Number(text),
											),
										);
									}}
								/>
								<Button
									backgroundColor={'$primary200'}
									size={'$5'}
									onPress={() => {
										setWizardData(reoccurenceChange(item));
									}}
								>
									<SizableText color="$white" size={'$body'}>
										{shortenRecVisual(
											item.recurrenceBase ?? 'month',
										)}
										{/* Need to make display enum for this later "/mo, /d, /a, etc" */}
									</SizableText>
								</Button>

								<Button
									color="$black"
									transparent
									style={styles.trashIcon}
									icon={Pencil}
									onPress={() => {
										setSelectedItem(item);
										setPopupVisible(true);
									}}
								/>
							</View>
						</XStack>
					))}
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
						<SizableText color="$white" size="$title1">
							{t('Previous')}
						</SizableText>
					</Button>
					{stepIndex === wizardData.length - 1 ? (
						<Button
							borderRadius={28}
							style={styles.footerButton}
							backgroundColor="$primary200"
							onPress={() => {
								const allItems: PlannedTransaction[] =
									wizardData.flatMap((step) => step.items);
								replaceAll(allItems);
								router.push('/');
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
							<SizableText color="$white" size="$title1">
								{t('Next')}
							</SizableText>
						</Button>
					)}
				</View>
			</View>
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
		height: '80%',
	},
	dateContainer: {
		flexDirection: 'row',
		height: '20%',
		alignItems: 'center',
		gap: 20,
	},
	content: {
		flexDirection: 'column',
		marginTop: 40,
		height: '60%',
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
		width: '40%',
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
	trashIcon: {
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
