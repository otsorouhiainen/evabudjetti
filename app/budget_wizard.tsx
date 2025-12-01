import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';
import { Plus, Trash2 } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Progress, SizableText, XStack } from 'tamagui';
import AddItemPopup from '../src/components/AddItemPopup';
import { MultiPlatformDatePicker } from '../src/components/MultiPlatformDatePicker';
import {
	BUDGET_WIZARD_STEPS,
	type BudgetWizardStep,
	type Item,
} from '../src/constants/wizardConfig';

export default function BudgetWizard() {
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
					step.header === 'Income'
						? transactions.filter((t) => t.type === 'income')
						: transactions.filter((t) => t.type === 'expense'),
			})),
		);
	}, [transactions]);
	const [popupVisible, setPopupVisible] = useState(false);
	const currentStep = wizardData[stepIndex];
	const progressBarValue = ((stepIndex + 1) * 100) / wizardData.length;

	function addItem(newItem: Item) {
		newItem.type = currentStep.header === 'Income' ? 'income' : 'expense';
		newItem.category = 'uncategorized';
		newItem.id = Math.random().toString(36).substring(2, 15);
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

	function deleteItem(item: Item) {
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

	function amountInputChange(item: Item, text: number): BudgetWizardStep[] {
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

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				<Modal
					visible={popupVisible}
					onRequestClose={() => setPopupVisible(false)}
					transparent={true}
				>
					<AddItemPopup
						onAdd={(item) => addItem(item)}
						onClose={() => setPopupVisible(false)}
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
						Create budget
					</SizableText>
					<SizableText
						color="$primary100"
						style={styles.stepHeader}
						size="$title2"
					>
						{currentStep.header}
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
								color="$black"
								size="$title3"
								style={styles.itemName}
							>
								{item.name}
							</SizableText>
							<View style={styles.itemContent}>
								<MultiPlatformDatePicker
									value={item.date}
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
									borderColor="$black"
									value={
										item.amount === 0
											? ''
											: item.amount.toString()
									}
									onChangeText={(text) => {
										console.log(text);
										setWizardData(
											amountInputChange(
												item,
												Number(text),
											),
										);
									}}
								/>
								<SizableText
									color="$black"
									style={styles.recurrenceText}
									size="$title3"
								>
									{item.recurrence}
									{/* Need to make display enum for this later "/mo, /d, /a, etc" */}
								</SizableText>
								<Button
									color="$black"
									transparent
									style={styles.trashIcon}
									icon={Trash2}
									onPress={() => deleteItem(item)}
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
						backgroundColor="$primary200"
						disabled={stepIndex === 0}
						onPress={() => setStepIndex(stepIndex - 1)}
					>
						<SizableText color="$white" size="$title1">
							Previous
						</SizableText>
					</Button>
					{stepIndex === wizardData.length - 1 ? (
						<Button
							borderRadius={28}
							style={styles.footerButton}
							backgroundColor="$primary200"
							onPress={() => {
								const allItems: Item[] = wizardData.flatMap(
									(step) => step.items,
								);
								replaceAll(allItems);
								router.push('/landing');
							}}
						>
							<SizableText color="$white" size="$title1">
								Finish
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
								Next
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
		justifyContent: 'space-evenly',
		padding: 5,
		marginTop: 5,
	},
	amountInput: {
		width: '38%',
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
		width: '70%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		gap: 10,
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
		width: '30%',
	},
	trashIcon: {
		width: '15%',
		height: '100%',
	},
	recurrenceText: {
		width: '15%',
	},
	pageHeader: {
		marginTop: 20,
	},
	stepHeader: {
		marginTop: 20,
	},
});
