import * as Localization from 'expo-localization';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { persistStorage } from './persistStorage';

interface LanguageState {
	language: string;
	setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
	persist(
		(set) => ({
			// 1. Oletusarvo: haetaan puhelimen kieli (esim. 'fi' tai 'en')
			// Jos laitteen kieltä ei löydy, käytetään suomea ('fi')
			language: Localization.getLocales()[0]?.languageCode ?? 'fi',

			// 2. Funktio kielen muuttamiseen
			setLanguage: (lang: string) => set({ language: lang }),
		}),
		{
			// 3. Tallennusasetukset
			name: 'language-storage', // Avain, jolla tieto löytyy AsyncStoragesta
			storage: createJSONStorage(() => persistStorage),
		},
	),
);
