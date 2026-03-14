import { SafeAreaView } from "react-native-safe-area-context"
import { 
    YStack, 
    Text, 
    Button, 
    Dialog, 
    Separator, 
    SizableText, 
    XStack } from "tamagui"
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight, Check } from "@tamagui/lucide-icons";

interface Language {
    code: 'fi' | 'en';
    label: string;
}

export default function Settings() {
    const { t, i18n } = useTranslation();
    const [languageDialogOpen, setLanguageDialogOpen] = useState(false);

    const possibleLanguages: Language[] = [
        { code: 'fi', label: 'Suomi' },
        { code: 'en', label: 'English' }
    ]

    const currentLanguage = useMemo(() => {
        return i18n.language?.startsWith('fi') ? 'fi' : 'en';
    }, [i18n.language]);

    const changeLanguage = async (code: 'fi' | 'en') => {
        await i18n.changeLanguage(code);
        setLanguageDialogOpen(false);
    };

    return (
        <SafeAreaView style={{ flex: 1}} edges={['left', 'right', 'bottom']}>
            <YStack
                backgroundColor={'$white'}
                paddingTop={'$paddingmd'}
                paddingHorizontal={10}
                flex={1}
            >
                <Dialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen} modal>
                    <Dialog.Trigger asChild>
                        <Button
                            chromeless
                            width='100%'
                            justifyContent="space-between"
                            alignItems="center"
                            paddingVertical={14}
                            paddingHorizontal={0}
                            backgroundColor="transparent"
                            pressStyle={{ backgroundColor: 'transparent', opacity: 0.7 }}
                        >
                            <Text color='$black'>{t('Language')}</Text>
                            <ChevronRight size='$icons.sm' color='$black' />
                        </Button>
                    </Dialog.Trigger>

                    <Separator />

                    <Dialog.Portal>
                        <Dialog.Overlay
                            key='overlay'
                            opacity={0.5}
                        />
                        <Dialog.Content
                            key='content'
                            bordered
                            elevate
                            width='90%'
                            maxWidth={420}
                            padding={24}
                            gap={10}
                        >
                            <Dialog.Title>{t('Language')}</Dialog.Title>

                            <YStack gap='$size.2'>
                                {possibleLanguages.map((lang) => (
                                    <Button
                                        key={lang.code}
                                        chromeless
                                        justifyContent="space-between"
                                        alignItems="center"
                                        onPress={() => changeLanguage(lang.code)}
                                        paddingVertical={12}
                                    >
                                        <XStack 
                                            width='100%' 
                                            justifyContent="space-between" 
                                            alignItems="center"
                                        >
                                            <SizableText size='$title3' color='$black'>{lang.label}</SizableText>
                                            {currentLanguage === lang.code ? <Check size={20} /> : null}
                                        </XStack>
                                    </Button>
                                ))}
                            </YStack>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog>
            </YStack>
        </SafeAreaView>
    )
}