import { Calendar } from '@tamagui/lucide-icons';
import { Stack, Text, View } from 'tamagui';

export const Scene3 = ({
	budget,
	spent,
}: {
	budget: number;
	spent: number;
}) => {
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

	const is_good = 0.5 < spent / budget;
	const today = new Date();
	return (
		<View>
			<Text textAlign="center" marginBottom={60} fontSize={24}>
				{' '}
				Forecast{' '}
			</Text>

			<Text fontSize={18} marginBottom={20}>
				{' '}
				{is_good
					? 'You have over half your budget left! You will last until...'
					: 'You have under half your budget left! You will last until...'}{' '}
			</Text>

			<Stack
				alignItems="center"
				justifyContent="center"
				position="relative"
			>
				<Calendar size={200} color="$primary200" />
				<Text position="absolute" fontSize={16} marginTop={48}>
					{is_good
						? kuukaudet[(today.getMonth() + 3) % 12]
						: kuukaudet[(today.getMonth() + 2) % 12]}
				</Text>
			</Stack>
		</View>
	);
};
