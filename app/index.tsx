import { Link } from 'expo-router';
import { View } from '@tamagui/core';

export default function Index() {
	return (
		<View
			style={{
				flex: 1,
				inset: 0,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Link href="/landing">Default</Link>
		</View>
	);
}
