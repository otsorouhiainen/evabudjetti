import { ButtonAccessoriesShowcase } from '@/src/components/ButtonExample';
import * as eva from '@eva-design/eva';
import {
	ApplicationProvider,
	IconRegistry,
	Layout,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Link } from 'expo-router';
import { View } from 'react-native';

export default function Index() {
	return (
		<>
			<IconRegistry icons={EvaIconsPack} />
			<ApplicationProvider {...eva} theme={eva.dark}>
				<View
					style={{
						flex: 1,
						inset: 0,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Layout
						style={{
							flex: 1,
							inset: 0,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Layout
							style={{
								flex: 1,
								flexDirection: 'column',
								width: '80%',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Link href="/src/components/BudgetWizard">
								Default
							</Link>
							<ButtonAccessoriesShowcase />
						</Layout>
					</Layout>
				</View>
			</ApplicationProvider>
		</>
	);
}
