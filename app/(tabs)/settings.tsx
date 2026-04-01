import { Check, ChevronRight } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import {
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useMemo,
	useState,
} from 'react';
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
import { MultiPlatformDatePicker } from '@/src/components/MultiPlatformDatePicker';
import { useTimeframeStore } from '@/src/store/useTimeframeStore';
import { useLanguageStore } from '../../src/store/useLanguageStore';

interface Language {
	code: 'fi' | 'en';
	label: string;
}

export default function Settings() {
	const { t, i18n } = useTranslation();
	const router = useRouter();
	const { language, setLanguage } = useLanguageStore();
	const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
	const [timeframeDialogOpen, setTimeframeDialogOpen] = useState(false);
	const { timeframeEndYear, timeframeEndMonth, timeframeEndDay, setEndDate } =
		useTimeframeStore();
	// temp date used to enable the user to cancel
	const [tempEndDate, setTempEndDate] = useState(
		new Date(timeframeEndYear, timeframeEndMonth, timeframeEndDay),
	);

	const possibleLanguages: Language[] = [
		{ code: 'fi', label: 'Suomi' },
		{ code: 'en', label: 'English' },
	];

	const currentLanguage = useMemo(() => {
		const activeLang = i18n.language || language;
		return activeLang.startsWith('fi') ? 'fi' : 'en';
	}, [i18n.language, language]);

	const changeLanguage = async (code: 'fi' | 'en') => {
		await i18n.changeLanguage(code);
		setLanguage(code);
		setLanguageDialogOpen(false);
	};

	const changeTimeframe = () => {
		setEndDate(tempEndDate);

		setTimeframeDialogOpen(false);
	};

	const handleCancelButtonPressed = () => {
		// reset to saved date
		setTempEndDate(
			new Date(timeframeEndYear, timeframeEndMonth, timeframeEndDay),
		);

		setTimeframeDialogOpen(false);
	};

	return (
		<SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
			<YStack
				backgroundColor={'$white'}
				paddingTop={'$paddingmd'}
				paddingHorizontal={10}
				flex={1}
			>
				<SettingsPopup
					title={t('Language')}
					open={languageDialogOpen}
					onOpenChange={setLanguageDialogOpen}
				>
					<YStack paddingHorizontal={10}>
						{possibleLanguages.map((lang) => (
							<Button
								unstyled
								key={lang.code}
								justifyContent="space-between"
								alignItems="center"
								onPress={() => changeLanguage(lang.code)}
								paddingVertical={12}
								color="$black"
							>
								<XStack
									width="100%"
									justifyContent="space-between"
									alignItems="center"
								>
									<SizableText size="$title2" color="$black">
										{lang.label}
									</SizableText>
									{currentLanguage === lang.code ? (
										<Check size={20} />
									) : null}
								</XStack>
							</Button>
						))}
					</YStack>
				</SettingsPopup>

				<SettingsPopup
					title={t('Timeframe')}
					open={timeframeDialogOpen}
					onOpenChange={setTimeframeDialogOpen}
				>
					<YStack gap={10} paddingHorizontal={10}>
						<XStack gap={5}>
							<SizableText size="$title3" color="$black">
								{t('End date')} *
							</SizableText>

							<MultiPlatformDatePicker
								value={tempEndDate}
								onChange={setTempEndDate}
							/>
						</XStack>

						<XStack alignSelf="flex-end" gap={10}>
							<Button
								onPress={handleCancelButtonPressed}
								borderColor="$primary200"
								backgroundColor="transparent"
								size="$buttons.lg"
								alignItems="center"
							>
								<SizableText size="$title3" color="$primary200">
									{t('Cancel')}
								</SizableText>
							</Button>

							<Button
								onPress={changeTimeframe}
								backgroundColor="$primary200"
								size="$buttons.lg"
								alignItems="center"
							>
								<SizableText size="$title3" color="$white">
									{t('Save')}
								</SizableText>
							</Button>
						</XStack>
					</YStack>
				</SettingsPopup>

				<Button
					unstyled
					width="100%"
					justifyContent="space-between"
					alignItems="center"
					paddingVertical={14}
					paddingHorizontal={0}
					color="$black"
					onPress={() => router.push('/finance_debug')}
				>
					<XStack
						width="100%"
						justifyContent="space-between"
						alignItems="center"
					>
						<YStack>
							<SizableText color="$black" size="$title2">
								Financial debug / test view
							</SizableText>
							<SizableText size="$2" color="$black">
								Temporary
							</SizableText>
						</YStack>
						<ChevronRight size="$icons.sm" color="$black" />
					</XStack>
				</Button>

				<Separator />
			</YStack>
		</SafeAreaView>
	);
}

interface PopupProps extends PropsWithChildren {
	title: string;
	open: boolean;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
}

function SettingsPopup({ title, open, onOpenChange, children }: PopupProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange} modal>
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
							{title}
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
					<Dialog.Title padding={8}>{title}</Dialog.Title>

					{children}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog>
	);
}
