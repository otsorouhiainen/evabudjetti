import * as eva from '@eva-design/eva';
import {
	FiraSans_400Regular,
	FiraSans_700Bold,
	useFonts,
} from '@expo-google-fonts/fira-sans';
import { ApplicationProvider } from '@ui-kitten/components';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		FiraSans_400Regular,
		FiraSans_700Bold,
	});
	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		return null;
	}
	return (
		<ApplicationProvider {...eva} theme={eva.dark}>
			<Stack />
		</ApplicationProvider>
	);
}
