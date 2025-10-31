import { create } from 'zustand';

interface CounterState {
	count: number;
	increment: () => void;
	decrement: () => void;
	reset: (newCount: number) => void;
}

const useCounterStore = create<CounterState>()((set) => ({
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
}));

export default useCounterStore;
