import { Check, ChevronRight } from '@tamagui/lucide-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	Button,
	Dialog,
	Separator,
	SizableText,
	XStack,
	YStack,
} from 'tamagui';

interface Language {
	code: 'fi' | 'en';
	label: string;
}

export default function Settings() {
	const { t, i18n } = useTranslation();
	const [languageDialogOpen, setLanguageDialogOpen] = useState(false);

	const possibleLanguages: Language[] = [
		{ code: 'fi', label: 'Suomi' },
		{ code: 'en', label: 'English' },
	];

	const currentLanguage = useMemo(() => {
		return i18n.language?.startsWith('fi') ? 'fi' : 'en';
	}, [i18n.language]);

	const changeLanguage = async (code: 'fi' | 'en') => {
		await i18n.changeLanguage(code);
		setLanguageDialogOpen(false);
	};

	return (
		<SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
			<YStack
				backgroundColor={'$white'}
				paddingTop={'$paddingmd'}
				paddingHorizontal={10}
				flex={1}
			>
				<Dialog
					open={languageDialogOpen}
					onOpenChange={setLanguageDialogOpen}
					modal
				>
					<Dialog.Trigger asChild>
						<Button
							unstyled
							width="100%"
							justifyContent="space-between"
							alignItems="center"
							paddingVertical={14}
							paddingHorizontal={0}
							color="$black"
						>
							<XStack
								width="100%"
								justifyContent="space-between"
								alignItems="center"
							>
								<SizableText color="$black" size="$title2">
									{t('Language')}
								</SizableText>
								<ChevronRight size="$icons.sm" color="$black" />
							</XStack>
						</Button>
					</Dialog.Trigger>

					<Separator />

					<Dialog.Portal>
						<Dialog.Overlay key="overlay" opacity={0.5} />
						<Dialog.Content
							key="content"
							bordered
							elevate
							width="90%"
							padding={24}
							gap={10}
						>
							<Dialog.Title padding={8}>
								{t('Language')}
							</Dialog.Title>

							<YStack>
								{possibleLanguages.map((lang) => (
									<Button
										unstyled
										key={lang.code}
										justifyContent="space-between"
										alignItems="center"
										onPress={() =>
											changeLanguage(lang.code)
										}
										paddingVertical={12}
										color="$black"
									>
										<XStack
											width="100%"
											justifyContent="space-between"
											alignItems="center"
										>
											<SizableText
												size="$title2"
												color="$black"
											>
												{lang.label}
											</SizableText>
											{currentLanguage === lang.code ? (
												<Check size={20} />
											) : null}
										</XStack>
									</Button>
								))}
							</YStack>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog>
			</YStack>
		</SafeAreaView>
	);
}
