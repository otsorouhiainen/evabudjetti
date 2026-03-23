import { TamaguiProvider, Theme } from '@tamagui/core';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalProvider, Spinner, Text, YStack } from 'tamagui';
import migrations from '@/drizzle/migrations';
import { db, isDbReal } from '@/src/db/client';
import config from '../tamagui.config';
import '@/src/utils/i18n';

import i18next from 'i18next';
import { useEffect } from 'react';
import { useLanguageStore } from '@/src/store/useLanguageStore';

export default function RootLayout() {
	const { success, error } = useMigrations(db, migrations);

	const language = useLanguageStore((state) => state.language);

	useEffect(() => {
		if (language && i18next.language !== language) {
			i18next.changeLanguage(language);
		}
	}, [language]);

	if (isDbReal) {
		if (error) {
			return (
				<TamaguiProvider config={config} defaultTheme="light">
					<Theme name="light">
						<SafeAreaProvider>
							<YStack f={1} jc="center" ai="center" padding="$4">
								<YStack gap="$3" ai="center">
									<Text
										color="$danger500"
										fontSize="$6"
										fontWeight="bold"
									>
										Migration Error
									</Text>
									<Text color="$danger500" ta="center">
										{error.message}
									</Text>
									<Text
										color="$info500"
										ta="center"
										fontSize="$3"
									>
										Please reset your app data and try
										again.
									</Text>
								</YStack>
							</YStack>
						</SafeAreaProvider>
					</Theme>
				</TamaguiProvider>
			);
		}

		if (!success) {
			return (
				<TamaguiProvider config={config} defaultTheme="light">
					<Theme name="light">
						<SafeAreaProvider>
							<YStack f={1} jc="center" ai="center">
								<Spinner size="large" color="$info500" />
							</YStack>
						</SafeAreaProvider>
					</Theme>
				</TamaguiProvider>
			);
		}
	}

	return (
		<TamaguiProvider config={config} defaultTheme={'light'}>
			{/* PortalProvider is neseccary for Tamagui Dialog components */}
			<PortalProvider>
				<Theme name={'light'}>
					<SafeAreaProvider>
						<StatusBar style="dark" translucent={false} />
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
					</SafeAreaProvider>
				</Theme>
			</PortalProvider>
		</TamaguiProvider>
	);
}
