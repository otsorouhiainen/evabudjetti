import { useRouter } from 'expo-router';
import { Button, View } from 'tamagui';

export const Scene5 = () => {
	const router = useRouter();

	return (
		<View>
			<Button
				size="$4"
				marginTop={8}
				borderRadius={8}
				paddingVertical={20}
				backgroundColor="$primary300"
				color="$white"
				onPress={() => router.push('/budget')}
			>
				{'Open budget'}
			</Button>
			<Button
				size="$4"
				marginTop={8}
				borderRadius={8}
				paddingVertical={20}
				backgroundColor="$primary300"
				color="$white"
				onPress={() => router.push('/add_transaction')}
			>
				{'Add transaction'}
			</Button>

			<Button
				size="$4"
				marginTop={8}
				borderRadius={8}
				paddingVertical={20}
				backgroundColor="$primary300"
				color="$white"
				onPress={() => router.push('/summary')}
			>
				{'Replay summary'}
			</Button>
		</View>
	);
};
