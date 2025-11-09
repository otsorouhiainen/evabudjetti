import { PiggyBank } from '@tamagui/lucide-icons';
import { Button, Text, View } from 'tamagui';

export const Scene2 = ({ balance }: { balance: number }) => {
	return (
		<View alignItems="center" alignContent="center">
			<Text fontSize={24} textAlign="center">
				{' '}
				Remaining{' '}
			</Text>
			<Text fontSize={36} textAlign="center">
				{' '}
				{balance}€{' '}
			</Text>
			<Button
				disabled
				transparent
				marginTop={-84}
				icon={<PiggyBank />}
				size={400}
				color={'$primary300'}
			/>
		</View>
	);
};
