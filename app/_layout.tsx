import { TamaguiProvider, Theme } from '@tamagui/core';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalProvider, Spinner, Text, YStack } from 'tamagui';
import { initializeWebDb, isDbReal, isWebFallbackMode } from '@/src/db/client';
import config from '../tamagui.config';
import '@/src/utils/i18n';

import { Redirect } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { useInstructionStore } from '@/src/store/useInstructionStore';
import { useLanguageStore } from '@/src/store/useLanguageStore';

function MigrationHandler({ children }: { children: React.ReactNode }) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (isWebFallbackMode) {
			setReady(true);
			return;
		}

		if (isDbReal) {
			setReady(true);
		} else {
			const interval = setInterval(() => {
				if (isDbReal) {
					setReady(true);
					clearInterval(interval);
				}
			}, 100);
			return () => clearInterval(interval);
		}
	}, []);

	if (!ready) {
		return (
			<YStack f={1} jc="center" ai="center" bg="$background">
				<Spinner size="large" color="$info500" />
				<Text mt="$2">Käynnistetään tietokantaa...</Text>
			</YStack>
		);
	}

	return <>{children}</>;
}

export default function RootLayout() {
	const language = useLanguageStore((state) => state.language);
	const { instructionShown } = useInstructionStore();

	useEffect(() => {
		if (language && i18next.language !== language) {
			i18next.changeLanguage(language);
		}
	}, [language]);

	if (!instructionShown) {
		return (
			<TamaguiProvider config={config} defaultTheme="light">
				<PortalProvider>
					<Theme name="light">
						<SafeAreaProvider>
							<StatusBar style="dark" translucent={false} />
							<Stack
								screenOptions={{
									headerBackButtonDisplayMode: 'minimal',
									headerTitle: '',
								}}
							>
								<Stack.Screen name="landing" />
								<Stack.Screen name="introduction" />
								<Stack.Screen name="budget_wizard" />
							</Stack>
							<Redirect href="/landing" />
						</SafeAreaProvider>
					</Theme>
				</PortalProvider>
			</TamaguiProvider>
		);
	}

	return (
		<TamaguiProvider config={config} defaultTheme={'light'}>
			{/* PortalProvider is neseccary for Tamagui Dialog components */}
			<PortalProvider>
				<Theme name={'light'}>
					<SafeAreaProvider>
						<StatusBar style="dark" translucent={false} />

						<SQLiteProvider
							databaseName="db.db"
							useSuspense={false}
							onInit={async (expoDb) => {
								if (typeof initializeWebDb === 'function') {
									console.log('Initializing web database...');
									initializeWebDb(expoDb);
								}
								await expoDb.execAsync(
									`PRAGMA journal_mode = WAL;`,
								);
							}}
						>
							<MigrationHandler>
								<Stack screenOptions={{ headerTitle: '' }}>
									<Stack.Screen
										name="(tabs)"
										options={{
									headerShown: false,
									headerTitle: '',
								}}
									/>
								</Stack>
							</MigrationHandler>
						</SQLiteProvider>
					</SafeAreaProvider>
				</Theme>
			</PortalProvider>
		</TamaguiProvider>
	);
}
