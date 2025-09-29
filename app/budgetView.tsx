import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { View } from 'react-native';

export default function BudgetView() {
	return (
		<ApplicationProvider {...eva} theme={eva.dark}>
			<View 
				style={{
					flex: 1,
					inset: 0,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Layout
					style={{
						flex: 1,
						padding: 16,
					}}
				>
					<Text>Budjetti</Text>
				</Layout>
			</View>
		</ApplicationProvider>
	);
}
