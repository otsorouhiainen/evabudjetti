import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, Button, SizableText, XStack, YStack, Stack } from 'tamagui';
import { BottomNav } from '@/src/components/BottomNav';

export default function Landing() {
	const router = useRouter();
	const [helpVisible, setHelpVisible] = useState(false);

	return (
		// Use Tamagui's Stack components instead of <View> and StyleSheet
		<YStack flex={1} justifyContent="center" alignItems="center">
			<YStack
				flex={1}
				paddingTop={24}
				paddingHorizontal={20}
				gap={18}
				maxWidth={600}
			>
				{/* Header */}
				<XStack
					alignItems="center"
					marginTop={6}
					justifyContent="center"
					gap="$2"
				>
					<SizableText fontWeight="800" size="$3">
						EVA OmaBudjetti
					</SizableText>
					<SizableText hoverStyle={{ cursor: 'help' }}>
						Taloudenhallintasi tueksi
					</SizableText>
				</XStack>

				{/* Illustration row */}
				<XStack
					alignItems="center"
					justifyContent="center"
					marginTop={4}
					position="relative"
					width="40%"
					aspectRatio={1.1}
					minWidth={80}
					maxWidth={180}
					alignSelf="center"
				>
					<Button
						icon={<AntDesign name="question-circle" />}
						// Use Tamagui props directly
						position="absolute"
						top={0}
						right={-80} // This is likely web-only, consider media queries
						width="22%"
						aspectRatio={1}
						minWidth={18}
						maxWidth={36}
						zIndex={5}
						color="$primary300" // Use your theme color
						onPress={() => setHelpVisible(true)}
						chromeless // Makes it just an icon
					/>
					<MaterialCommunityIcons
						name="piggy-bank"
						size={96}
						color="$primary300" // You can't use a token here. You need to use useTheme()
						// See note below
					/>
				</XStack>

				{/* Help Modal */}
				{helpVisible && (
					<Stack
						position="absolute"
						top={0}
						left={0}
						right={0}
						bottom={0}
						backgroundColor="$black" // Use theme token
						justifyContent="center"
						alignItems="center"
						zIndex={10}
						// Add opacity for a modal overlay
						opacity={0.5}
					>
						<YStack
							backgroundColor="$white" // Use theme token
							borderRadius={16}
							padding={24}
							width="80%"
							minWidth={220}
							maxWidth={400}
							shadowColor="$black"
							shadowOffset={{ width: 0, height: 2 }}
							shadowOpacity={0.18}
							shadowRadius={8}
							elevation={8}
							gap="$3"
						>
							<Text style={{ marginBottom: 8 }}>Ohjeet</Text>
							<Text style={{ marginBottom: 16 }}>
								Tervetuloa budjettisovellukseen! ...
							</Text>
							<Button
								onPress={() => setHelpVisible(false)}
								alignSelf="center"
							>
								SULJE
							</Button>
						</YStack>
					</Stack>
				)}

				{/* Balance card */}
				<YStack
					alignSelf="center"
					width="88%"
					borderRadius={16}
					alignItems="center"
					paddingVertical={16}
					gap={6}
					backgroundColor="$white"
					shadowColor="$black"
					shadowOffset={{ width: 0, height: 2 }}
					shadowOpacity={0.15}
					shadowRadius={8}
					elevation={6}
				>
					<Text
						fontWeight="700"
						marginBottom={4} /* Use font token if you defined one */
					>
						04.10.2025
					</Text>
					<XStack>
						<Text fontSize={16}>
							Tilillä rahaa:{' '}
							<SizableText size="$2">1234€</SizableText>
						</Text>
						<Text fontSize={16}>
							Käyttövara:{' '}
							<SizableText size="$2">123€</SizableText>
						</Text>
					</XStack>
					<Button
						size="$2" // Use size token
						marginTop={10}
						alignSelf="center"
						borderRadius={24}
						paddingHorizontal={16}
					>
						TARKASTELE
					</Button>
				</YStack>

				{/* Primary CTA */}
				<Button
					size="$4" // Use size token
					marginTop={8}
					borderRadius={28}
					paddingVertical={14}
					backgroundColor="$primary300" // Use theme token
					onPress={() => router.push('/add_transaction')}
				>
					LISÄÄ TULO/MENO
				</Button>

				{/* Secondary CTAs */}
				<XStack gap={14} justifyContent="space-between">
					<Button
						flex={1}
						size="$4" // Use size token
						borderRadius={18}
						paddingVertical={14}
						backgroundColor="$primary300" // Use theme token
						onPress={() => router.push('/budget')}
					>
						NÄYTÄ BUDJETTI
					</Button>
					<Button
						flex={1}
						size="$4" // Use size token
						borderRadius={18}
						paddingVertical={14}
						backgroundColor="$primary300" // Use theme token
					>
						MUOKKAA BUDJETTIA
					</Button>
				</XStack>

				<BottomNav />
			</YStack>
		</YStack>
	);
}
