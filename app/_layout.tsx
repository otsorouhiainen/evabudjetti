import config from '../tamagui.config';
import {
	FiraSans_400Regular,
	FiraSans_700Bold,
	useFonts,
} from '@expo-google-fonts/fira-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { TamaguiProvider, Theme } from '@tamagui/core';

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
		<TamaguiProvider config={config} defaultTheme={'light'}>
			<Theme name={'light'}>
				<Stack>
					<Stack.Screen
						name="(tabs)"
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="modal"
						options={{ presentation: 'modal' }}
					/>
				</Stack>
			</Theme>
		</TamaguiProvider>
	);
}
