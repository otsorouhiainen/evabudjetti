import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
