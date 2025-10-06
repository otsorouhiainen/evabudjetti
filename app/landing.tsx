
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import BudgetWizard from './src/components/BudgetWizard';
import { BUDGET_WIZARD_STEPS } from './src/constants';
export default function Landing() {
	const router = useRouter();
	return (
		<View>
			<BudgetWizard steps={BUDGET_WIZARD_STEPS}/>
		</View>
	);
}
