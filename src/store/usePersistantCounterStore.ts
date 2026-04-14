import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CounterState {
	count: number;
	increment: () => void;
	decrement: () => void;
	reset: (newCount: number) => void;
}

const usePersistantCounterStore = create<CounterState>()(
	persist(
		(set) => ({
			count: 0,
			increment: () => {
				set((state) => ({ count: state.count + 1 }));
			},
			decrement: () => {
				set((state) => ({ count: state.count - 1 }));
			},
			reset: (newCount) => {
				set({ count: newCount });
			},
		}),
		{
			name: 'counter-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);

export default usePersistantCounterStore;
