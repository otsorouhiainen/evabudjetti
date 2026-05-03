import { TamaguiProvider, Text, Theme } from '@tamagui/core';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalProvider, Spinner, YStack } from 'tamagui';
import { initializeDb } from '@/src/db/client';
import config from '../tamagui.config';
import '@/src/utils/i18n';

import { Redirect } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { seedCategories, seedDefaultBudgetAndAccount } from '@/src/db/seed';
import { useInstructionStore } from '@/src/store/useInstructionStore';
import { useLanguageStore } from '@/src/store/useLanguageStore';

export default function RootLayout() {
	const language = useLanguageStore((state) => state.language);
	const { instructionShown } = useInstructionStore();
	const [isDbReady, setIsDbReady] = useState(false);
	const [dbError, setDbError] = useState<string | null>(null);

	useEffect(() => {
		if (language && i18next.language !== language) {
			i18next.changeLanguage(language);
		}
	}, [language]);

	return (
		<SQLiteProvider
			databaseName="db.db"
			useSuspense={false}
			options={{
				enableChangeListener: true,
			}}
			onInit={async (db) => {
				try {
					await initializeDb(db);
				} catch (error) {
					setDbError(`${error}`);
					return;
				}

				await seedDefaultBudgetAndAccount();
				await seedCategories();

				setIsDbReady(true);
			}}
		>
			<TamaguiProvider config={config} defaultTheme={'light'}>
				{/* PortalProvider is neseccary for Tamagui Dialog components */}
				<PortalProvider>
					<Theme name={'light'}>
						<SafeAreaProvider>
							{dbError != null ? (
								<YStack
									f={1}
									jc="center"
									ai="center"
									padding="$4"
								>
									<YStack gap="$3" ai="center">
										<Text
											color="$danger500"
											fontSize="$6"
											fontWeight="bold"
										>
											Migration Error
										</Text>
										<Text color="$danger500" ta="center">
											{dbError}
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
							) : !isDbReady ? (
								<YStack f={1} jc="center" ai="center">
									<Spinner size="large" color="$info500" />
								</YStack>
							) : !instructionShown ? (
								<>
									<StatusBar
										style="dark"
										translucent={false}
									/>
									<Stack
										screenOptions={{
											headerBackButtonDisplayMode:
												'minimal',
											headerTitle: '',
										}}
									>
										<Stack.Screen name="landing" />
										<Stack.Screen name="introduction" />
										<Stack.Screen name="budget_wizard" />
									</Stack>
									<Redirect href="/landing" />{' '}
								</>
							) : (
								<>
									<StatusBar
										style="dark"
										translucent={false}
									/>
									<Stack
										screenOptions={{
											headerBackButtonDisplayMode:
												'minimal',
											headerTitle: '',
										}}
									>
										<Stack.Screen
											name="(tabs)"
											options={{
												headerShown: false,
												headerBackButtonDisplayMode:
													'minimal',
												headerTitle: '',
											}}
										/>
									</Stack>
								</>
							)}
						</SafeAreaProvider>
					</Theme>
				</PortalProvider>
			</TamaguiProvider>
		</SQLiteProvider>
	);
}
