// do not remove
// biome-ignore lint/correctness/noUnusedImports: these are here for compiler, actual font import handled in tamagui config
import { BottomNav } from '@/src/components/BottomNav';
import {
	FiraSans_300Light,
	FiraSans_400Regular,
	FiraSans_500Medium,
	FiraSans_600SemiBold,
	FiraSans_700Bold,
	FiraSans_800ExtraBold,
	useFonts,
} from '@expo-google-fonts/fira-sans';
import { TamaguiProvider, Theme } from '@tamagui/core';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import config from '../tamagui.config';

export default function RootLayout() {
	const [fontsLoaded, fontError] = useFonts({
		// These keys MUST match the 'face' definition in tamagui.config.ts
		FiraSans_300Light: FiraSans_300Light,
		FiraSans_400Regular: FiraSans_400Regular,
		FiraSans_500Medium: FiraSans_500Medium,
		FiraSans_600SemiBold: FiraSans_600SemiBold,
		FiraSans_700Bold: FiraSans_700Bold,
		FiraSans_800ExtraBold: FiraSans_800ExtraBold,
	});

	// 5. Hide the splash screen once fonts are loaded
	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	// 6. Do not render the app until fonts are loaded
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
