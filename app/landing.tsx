import { MessageCircleQuestion, PiggyBank } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, SizableText, Stack, XStack, YStack } from 'tamagui';

export default function Landing() {
	const router = useRouter();
	const [helpVisible, setHelpVisible] = useState(false);

	return (
		<>
			{/* Help Modal */}
			{helpVisible && (
				<Stack
					position="absolute"
					top={0}
					bottom={0}
					left={0}
					right={0}
					backgroundColor="rgba(0,0,0,0.4)"
					justifyContent="center"
					alignItems="center"
					zIndex={10}
				>
					<YStack
						backgroundColor="$white"
						borderColor={'$black'}
						borderWidth={2}
						opacity={1}
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
						gap={'$3'}
					>
						<SizableText size={'$title1'} marginBottom={8}>
							Ohjeet
						</SizableText>
						<SizableText size={'$title2'} marginBottom={16}>
							Tervetuloa budjettisovellukseen! ...
						</SizableText>
						<Button
							onPress={() => setHelpVisible(false)}
							backgroundColor={'$primary300'}
							size={42}
							color={'$white'}
							padding={22}
							alignSelf="center"
						>
							SULJE
						</Button>
					</YStack>
				</Stack>
			)}
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				overflow="scroll"
			>
				<YStack
					flex={1}
					paddingTop={24}
					paddingHorizontal={20}
					gap={18}
					maxWidth={600}
				>
					{/* Header */}
					<YStack
						alignItems="center"
						marginTop={6}
						justifyContent="space-between"
						gap={'$2'}
					>
						<SizableText fontWeight={'$7'} size={'$title1'}>
							EVA OmaBudjetti
						</SizableText>
						<SizableText
							size={'$title2'}
							hoverStyle={{ cursor: 'help' }}
						>
							Taloudenhallintasi tueksi
						</SizableText>
						<Button
							disabled
							transparent
							icon={<PiggyBank />}
							size={200}
							marginBottom={-190}
							color={'$primary300'}
						></Button>
					</YStack>

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
							position="absolute"
							top={0}
							right={-80}
							width="50%"
							aspectRatio={1}
							minWidth={28}
							maxWidth={42}
							zIndex={5}
							onPress={() => setHelpVisible(true)}
							chromeless
							icon={<MessageCircleQuestion size={28} />}
						/>
						<Button disabled transparent />
					</XStack>

					{/* Balance card */}
					<YStack
						alignSelf="center"
						width="88%"
						borderRadius={16}
						alignItems="center"
						paddingVertical={16}
						gap={6}
						backgroundColor={'$white'}
						shadowColor={'$black'}
						shadowOffset={{ width: 0, height: 2 }}
						shadowOpacity={0.15}
						shadowRadius={8}
						elevation={6}
					>
						<SizableText
							size={'$title2'}
							fontWeight={'$5'}
							marginBottom={4}
						>
							04.10.2025
						</SizableText>
						<YStack>
							<SizableText size={'$title2'}>
								Tilillä rahaa:{' '}
								<SizableText size={'$title3'} fontWeight={'$4'}>
									1234€
								</SizableText>
							</SizableText>
							<SizableText size={'$title2'}>
								Käyttövara:{' '}
								<SizableText size={'$title3'} fontWeight={'$4'}>
									123€
								</SizableText>
							</SizableText>
						</YStack>
						<Button
							marginTop={10}
							alignSelf="center"
							backgroundColor={'$primary500'}
							color={'$white'}
							padding={22}
							size={32}
						>
							TARKASTELE
						</Button>
					</YStack>

					{/* Primary CTA */}
					<Button
						size="$4"
						marginTop={8}
						borderRadius={28}
						paddingVertical={20}
						backgroundColor="$primary300"
						color="$white"
						onPress={() => router.push('/add_transaction')}
					>
						LISÄÄ TULO/MENO
					</Button>

					{/* Secondary CTAs */}
					<XStack gap={14} justifyContent="space-between">
						<Button
							flex={1}
							size={'$4'}
							borderRadius={18}
							padding={20}
							backgroundColor={'$primary300'}
							color={'$white'}
							onPress={() => router.push('/budget')}
						>
							NÄYTÄ BUDJETTI
						</Button>
						<Button
							flex={1}
							size={'$4'}
							borderRadius={18}
							padding={20}
							color={'$white'}
							backgroundColor={'$primary300'}
						>
							MUOKKAA BUDJETTIA
						</Button>
					</XStack>
					<YStack height={48} />
				</YStack>
			</YStack>
		</>
	);
}
