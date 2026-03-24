import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function SummaryStackLayout() {
	const { t } = useTranslation();

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
					title: `${t('Year')} ${(route.params as { year?: string })?.year}`,
					headerLargeTitle: false,
				})}
			/>
		</Stack>
	);
}
