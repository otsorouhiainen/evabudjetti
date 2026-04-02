import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface InstructionState {
	instructionShown: boolean;
	setInstructionShown: () => void;
}

// Async storage used to remember if the instruction pages have been shown
export const useInstructionStore = create<InstructionState>()(
	persist(
		(set) => ({
			instructionShown: false,
			// Only used to mark that the instructions have been shown
			// No need for ability to change back
			setInstructionShown: () => set({ instructionShown: true }),
		}),
		{
			name: 'instruction-shown-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
