import { Calendar } from '@tamagui/lucide-icons';
import { Button, Stack, Text, View } from 'tamagui';

export const Scene3 = ({ months }: { months: number }) => {
	const kuukaudet = [
		'Joulukuu',
		'Tammikuu',
		'Helmikuu',
		'Maaliskuu',
		'Huhtikuu',
		'Toukokuu',
		'Kesäkuu',
		'Heinäkuu',
		'Elokuu',
		'Syyskuu',
		'Lokakuu',
		'Marraskuu',
	];

	return (
		<View>
			<Text textAlign="center" marginBottom={60} fontSize={24}>
				{' '}
				Forecast{' '}
			</Text>

			<Text fontSize={18} marginBottom={20}>
				{' '}
				Your money will last until...{' '}
			</Text>

			<Stack
				alignItems="center"
				justifyContent="center"
				position="relative"
			>
				<Calendar size={200} color="$primary300" />
				<Text
					position="absolute"
					fontSize={16}
					marginTop={48}
				>
					{kuukaudet[months]}
				</Text>
			</Stack>
		</View>
	);
};
