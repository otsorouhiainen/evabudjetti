import { Stack } from 'expo-router';

export default function SummaryStackLayout() {
	return (
		<Stack
			screenOptions={{
				headerShadowVisible: false,
				headerStyle: { backgroundColor: '#f2f2f2' },
			}}
		>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen
				name="[year]"
				options={({ route }) => ({
					title: `Vuosi ${(route.params as { year?: string })?.year}`,
				})}
			/>
			<Stack.Screen name="detail/[id]" options={{ title: '' }} />
		</Stack>
	);
}
