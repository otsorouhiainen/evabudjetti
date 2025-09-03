import {
	FiraSans_400Regular,
	FiraSans_700Bold,
	useFonts,
} from '@expo-google-fonts/fira-sans';
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
	return <Stack />;
}
