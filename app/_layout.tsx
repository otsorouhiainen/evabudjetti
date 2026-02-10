import { TamaguiProvider, Theme } from '@tamagui/core';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalProvider } from 'tamagui';
import config from '../tamagui.config';

export default function RootLayout() {
  return (
    <TamaguiProvider config={config} defaultTheme={'light'}>
      {/* PortalProvider is neseccary for Tamagui Dialog components */}
      <PortalProvider>
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
          </SafeAreaProvider>
        </Theme>
      </PortalProvider>
    </TamaguiProvider>
  );
}
