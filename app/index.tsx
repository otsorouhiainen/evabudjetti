import { View } from '@tamagui/core';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View
				style={{
					flex: 1,
					inset: 0,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Link href="/budget_wizard">Default</Link>
			</View>
		</SafeAreaView>
	);
}
