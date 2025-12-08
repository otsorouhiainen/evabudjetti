import type { Item } from '../../constants/wizardConfig';
import useRealTransactionsStore from '../useRealTransactionsStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
	setItem: jest.fn(() => Promise.resolve()),
	getItem: jest.fn(() => Promise.resolve(null)),
	removeItem: jest.fn(() => Promise.resolve()),
}));

describe('useRealTransactionsStore', () => {
	const initialItem: Item = {
		id: '1',
		name: 'Test Item',
		category: 'Test',
		type: 'expense',
		amount: 100,
		recurrence: 'none',
		date: new Date(),
	};

	beforeEach(() => {
		// Reset store before each test
		useRealTransactionsStore.setState({ transactions: [] });
	});

	it('should add a transaction', () => {
		const { add } = useRealTransactionsStore.getState();
		add(initialItem);

		const { transactions } = useRealTransactionsStore.getState();
		expect(transactions).toHaveLength(1);
		expect(transactions[0]).toEqual(initialItem);
	});

	it('should remove a transaction', () => {
		const { add, remove } = useRealTransactionsStore.getState();
		add(initialItem);

		let state = useRealTransactionsStore.getState();
		expect(state.transactions).toHaveLength(1);

		remove(initialItem);

		state = useRealTransactionsStore.getState();
		expect(state.transactions).toHaveLength(0);
	});

	it('should replace all transactions', () => {
		const { replaceAll } = useRealTransactionsStore.getState();
		const newItems: Item[] = [
			initialItem,
			{ ...initialItem, id: '2', name: 'Second Item' },
		];

		replaceAll(newItems);

		const { transactions } = useRealTransactionsStore.getState();
		expect(transactions).toHaveLength(2);
		expect(transactions[1].name).toBe('Second Item');
	});
});
