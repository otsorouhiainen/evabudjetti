import i18next from 'i18next';
import { create } from 'zustand';

interface LanguageState {
	language: string;
	change: (language: string) => void;
}
const useLanguageStore = create<LanguageState>()((set) => ({
	language: 'fi',
	change: (language: string) => {
		set((state) => ({ ...state, language: language }));
		i18next.changeLanguage(language);
	},
}));
export default useLanguageStore;
