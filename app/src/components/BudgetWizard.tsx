import {
	Button,
	Icon,
	type IconElement,
	type IconProps,
	Input,
	ProgressBar,
	Text,
} from '@ui-kitten/components';
import React from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import {
	BUDGET_WIZARD_STEPS,
	type BudgetWizardStep,
	type Item,
} from '../constants/wizardConfig';
import AddItemPopup from './AddItemPopup';

const CalendarIcon = (props: IconProps): IconElement => (
	<Icon {...props} name="calendar-outline" />
);
const TrashIcon = (props: IconProps): IconElement => (
	<Icon {...props} name="trash-2-outline" />
);
const PlusIcon = (props: IconProps): IconElement => (
	<Icon {...props} name="plus-outline" />
);

export default function BudgetWizard() {
	const [stepIndex, setStepIndex] = React.useState(0);
	const [wizardData, setWizardData] = React.useState(BUDGET_WIZARD_STEPS);
	const [popupVisible, setPopupVisible] = React.useState(false);
	const currentStep = wizardData[stepIndex];
	const progressBarStep = (stepIndex + 1) / wizardData.length;

	function addItem(newItem: Item) {
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

	function amountInputChange(item: Item, text: string): BudgetWizardStep[] {
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
				<ProgressBar progress={progressBarStep} />
				<Text style={styles.pageHeader} category="h3">
					Create budget
				</Text>
				<Text style={styles.stepHeader} category="h4">
					{currentStep.header}
				</Text>
			</View>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				style={styles.content}
			>
				{currentStep.items.map((item) => (
					<View style={styles.itemContainer} key={item.name}>
						<Text style={styles.itemName} category="s1">
							{item.name}
						</Text>
						<View style={styles.itemContent}>
							{/*Calendar button currently nonfunctional as the date picker is seriously limited*/}
							<Button
								size="small"
								accessoryLeft={CalendarIcon}
								style={styles.calendarIcon}
							/>
							<Input
								size="small"
								style={styles.amountInput}
								value={
									item.amount === 0
										? ''
										: `${item.amount.toString()}€`
								}
								onChangeText={(text) => {
									setWizardData(
										amountInputChange(item, text),
									);
								}}
								keyboardType="numeric"
							/>
							<Text style={styles.recurrenceText} category="s1">
								{item.reoccurence}
								{/* Need to make display enum for this later "/mo, /d, /a, etc" */}
							</Text>
							<Button
								size="small"
								style={styles.trashIcon}
								accessoryLeft={TrashIcon}
								onPress={() => deleteItem(item)}
							/>
						</View>
					</View>
				))}
			</ScrollView>
			<View style={styles.addIconContainer}>
				<Button
					size="medium"
					accessoryLeft={PlusIcon}
					onPress={() => setPopupVisible(true)}
					style={styles.addIcon}
				/>
			</View>
			<View style={styles.buttonContainer}>
				<Button
					disabled={stepIndex === 0}
					onPress={() => setStepIndex(stepIndex - 1)}
				>
					<Text>Previous</Text>
				</Button>
				{stepIndex === wizardData.length - 1 ? (
					<Button
						onPress={() =>
							console.log(
								'Placeholder for finishing budget creation',
							)
						}
					>
						<Text>Finish</Text>
					</Button>
				) : (
					<Button onPress={() => setStepIndex(stepIndex + 1)}>
						<Text>Next</Text>
					</Button>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	topContent: {
		height: '20%',
	},
	container: {
		flexDirection: 'column',
		padding: 20,
		height: '80%',
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
		backgroundColor: 'gray',
		padding: 5,
		marginTop: 5,
	},
	amountInput: {
		width: '38%',
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
	},
	addIcon: {
		marginTop: 10,
		width: '30%',
	},
	addIconContainer: {
		alignItems: 'flex-end',
	},
	itemName: {
		width: '30%',
	},
	trashIcon: {
		width: '5%',
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
