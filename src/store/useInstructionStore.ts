import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface InstructionState {
	instructionShown: boolean;
	setInstructionShown: (val: boolean) => void;
}

// Async storage used to remember if the instruction pages have been shown
export const useInstructionStore = create<InstructionState>()(
	persist(
		(set) => ({
			instructionShown: false,

			// Ability to set the value back to false for testing purposes
			// Final product could just set the instructionShown to true when this function is called with no way to change it back
			setInstructionShown: (val: boolean) =>
				set({ instructionShown: val }),
		}),
		{
			name: 'instruction-shown-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
