// do not remove
// --biome-ignore lint/correctness/noUnusedImports: these are here for compiler, actual font import handled in tamagui config
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
import { BottomNav } from '@/src/components/BottomNav';
import config from '../tamagui.config';

export default function RootLayout() {
	// Below fixed fonts not showing issue
	// Actually load the fonts
	const [fontsLoaded, fontError] = useFonts({
		FiraSans_300Light,
		FiraSans_400Regular,
		FiraSans_500Medium,
		FiraSans_600SemiBold,
		FiraSans_700Bold,
		FiraSans_800ExtraBold,
	});

	// Don't render until fonts are loaded
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
