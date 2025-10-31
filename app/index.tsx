import { View } from '@tamagui/core';
import { Link } from 'expo-router';

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
