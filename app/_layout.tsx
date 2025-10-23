import {
	FiraSans_300Light,
	FiraSans_400Regular,
	FiraSans_500Medium,
	FiraSans_600SemiBold,
	FiraSans_700Bold,
	FiraSans_800ExtraBold,
} from '@expo-google-fonts/fira-sans';
import { TamaguiProvider, Theme } from '@tamagui/core';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import config from '../tamagui.config';
import { BottomNav } from '@/src/components/BottomNav';

export default function RootLayout() {
	const [fontsLoaded, fontError] = useFonts({
		// These must match the names in your tamagui.config.ts 'face'
		FiraSans_300Light,
		FiraSans_400Regular,
		FiraSans_500Medium,
		FiraSans_600SemiBold,
		FiraSans_700Bold,
		FiraSans_800ExtraBold,
	});
	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) {
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
				<BottomNav />
			</Theme>
		</TamaguiProvider>
	);
}
