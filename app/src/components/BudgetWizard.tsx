import {
	Button,
	Icon,
	type IconElement,
	Input,
	ProgressBar,
	Text,
} from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { BudgetWizardStep } from '../constants/wizardConfig';

const CalendarIcon = (props): IconElement => (
	<Icon {...props} name="calendar-outline" />
);
const TrashIcon = (props): IconElement => (
	<Icon {...props} name="trash-2-outline" />
);
const PlusIcon = (props): IconElement => (
	<Icon {...props} name="plus-outline" />
);

const BudgetWizard = ({ steps }: { steps: BudgetWizardStep[] }) => {
	const [stepIndex, setStepIndex] = React.useState(0);
	const [wizardData, setWizardData] = React.useState(steps);
	const currentStep = wizardData[stepIndex];
	return (
		<View style={{ padding: 20 }}>
			<ProgressBar
				progress={(stepIndex + 1) / wizardData.length}
			></ProgressBar>
			<Text style={{ marginTop: 20 }} category="h3">
				Create a budget
			</Text>
			<View>
				<Text style={{ marginTop: 20 }} category="h3">
					{currentStep.header}
				</Text>
				{currentStep.items.map((item) => (
					<View key={item.name}>
					<View style={styles.itemContainer} key={item.name}>
						<Text style={{ width: '30%' }} category="s1">
							{item.name}
						</Text>
						<View
							style={{
								width: '70%',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 10,
							}}
						>
							<Button size='small'
								accessoryLeft={CalendarIcon}
								style={{
									width: '5%',
									justifyContent: 'center',
								}}
							/>
							<Input
								size="small"
								style={{ width: '38%' }}
								value={item.amount.toString()}
								onChangeText={(text) => {
									const updatedSteps = wizardData.map(
										(step, sIdx) =>
											sIdx === stepIndex
												? {
														...step,
														items: step.items.map(
															(it) =>
																it.name ===
																item.name
																	? {
																			...it,
																			amount: Number(
																				text,
																			),
																		}
																	: it,
														),
													}
												: step,
									);
									setWizardData(updatedSteps);
								}}
								keyboardType="numeric"
							/>
							<Text style={{ width: '15%' }} category="s1">
								/mo
							</Text>
							<Button size='small' style={{ width: '5%' }} accessoryLeft={TrashIcon} />
						</View>
					</View>
					</View>
				))}
				<View style={{alignItems: 'flex-end', marginTop: 10}}>
					<Button size='medium' accessoryLeft={PlusIcon}></Button>
				</View>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: 20,
					}}
				>
					<Button
						disabled={stepIndex === 0}
						onPress={() => setStepIndex(stepIndex - 1)}
					>
						<Text>Previous</Text>
					</Button>
					<Button
						disabled={stepIndex === wizardData.length - 1}
						onPress={() => setStepIndex(stepIndex + 1)}
					>
						<Text>Next</Text>
					</Button>
				</View>
			</View>
		</View>
	);
};

export default BudgetWizard;

const styles = StyleSheet.create({
	itemContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly',
		backgroundColor: 'red',
		padding: 5,
	},
});
