import React from 'react';
import { TextInput } from 'react-native';
import type { BudgetWizardStep } from '../constants/wizardConfig';

const BudgetWizard = ({ steps }: { steps: BudgetWizardStep[] }) => {
	const [stepIndex, setStepIndex] = React.useState(0);
	const [wizardData, setWizardData] = React.useState(steps);
	return (
		<div className="flex flex-col">
			<h1>Budget Wizard</h1>
			{(() => {
				const currentStep = wizardData[stepIndex];

				return (
					<div>
						<div>{currentStep.header}</div>
						{currentStep.items.map((item) => (
							<div key={item.name}>
								<span>{item.name}</span>
                                <div>
                                    <TextInput
                                        value={item.amount.toString()}
                                        onChangeText={(text) => {
                                            const updatedSteps = wizardData.map((step, sIdx) =>
                                                sIdx === stepIndex
                                                    ? {
                                                            ...step,
                                                            items: step.items.map((it) =>
                                                                it.name === item.name
                                                                    ? { ...it, amount: Number(text) }
                                                                    : it
                                                            ),
                                                      }
                                                    : step
                                            );
                                            setWizardData(updatedSteps);
                                        }}
                                        keyboardType="numeric"
                                    />
                                    <span>{item.reoccurence}</span>
                                </div>
							</div>
						))}
						<div>
							<button
								type="button"
								hidden={stepIndex === 0}
								onClick={() => setStepIndex(stepIndex - 1)}
							>
								Previous
							</button>
							<button
								type="button"
								disabled={stepIndex === wizardData.length - 1}
								onClick={() => setStepIndex(stepIndex + 1)}
							>
								Next
							</button>
						</div>
					</div>
				);
			})()}
		</div>
	);
};

export default BudgetWizard;
