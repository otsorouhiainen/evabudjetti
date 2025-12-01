import { TamaguiProvider, Theme } from '@tamagui/core';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomNav } from '@/src/components/BottomNav';
import { seedCategories } from '@/src/db/seed';
import config from '../tamagui.config';

export default function RootLayout() {
	useEffect(() => {
		seedCategories();
	}, []);

	return (
		<TamaguiProvider config={config} defaultTheme={'light'}>
			<Theme name={'light'}>
				<SafeAreaProvider>
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
				</SafeAreaProvider>
			</Theme>
		</TamaguiProvider>
	);
}
