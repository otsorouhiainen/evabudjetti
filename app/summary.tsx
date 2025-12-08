<<<<<<< HEAD
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
	FadeInLeft,
	FadeInRight,
	FadeOutLeft,
	FadeOutRight,
} from 'react-native-reanimated';
import { Button, Separator, SizableText, XStack, YStack } from 'tamagui';

import { Scene1 } from '../src/components/summary/scene1';
import { Scene2 } from '../src/components/summary/scene2';
import { Scene3 } from '../src/components/summary/scene3';
import { Scene4 } from '../src/components/summary/scene4';
import { Scene5 } from '../src/components/summary/scene5';

export type Expense = {
	name: string;
	date: string;
	amount: number;
};

export default function Summary() {
	const router = useRouter();

	//hardcoded values
	//dynamic ones should just replace these and the page SHOULD work
	const budget_total = 4200;
	const budget_month = 1200;
	const spent_total = 1200;
	const spent_month = 1051;

	const current_month = 10;

	//modifying the Expense type might be neccessary before adding these dynamically
	const expense1: Expense = {
		name: 'Bus card',
		date: '01.08.2025',
		amount: -50,
	};
	const expense2: Expense = {
		name: 'Netflix',
		date: '03.08.2025',
		amount: -15.99,
	};
	const expense3: Expense = {
		name: 'Electricity bill',
		date: '03.08.2025',
		amount: -30,
	};
	const expenses: Expense[] = [expense1, expense2, expense3];
	const expense_categories = [
		'Living',
		'Groceries',
		'Hobbies',
		'Transportation',
		'Savings',
	];

	//variables used to change the 'scene' dynamically,
	const [currentScene, setCurrentScene] = useState<number>(0);
	const [direction, setDirection] = useState<boolean>(true);

	//each argument for each scene is given here
	//the purpose is to make switching to dynamic values easier
	const Arguments = [
		{ budget: budget_total, expected: budget_month, spent: spent_month },
		{ balance: budget_total - spent_total },
		{
			months:
				(current_month + Math.round(budget_total / budget_month)) % 12,
		},
		{
			categories: expense_categories,
			upcoming: expenses,
		},
		{},
	];

	//each scene is a predefined react node
	//scenes are changed dynamically to avoid re-loading anything unneccessary
	const Scenes = [Scene1, Scene2, Scene3, Scene4, Scene5];
	const CurrentScene = Scenes[currentScene];
	const CurrentArguments = Arguments[currentScene];

	//the rest of the consts here define ways to navigate through scenes
	//the only current ways are to swipe either left or right or to use the arrow keys
	const handlePrevScene = () => {
		if (currentScene > 0) {
			setDirection(false);

			setCurrentScene((prev) => Math.max(prev - 1, 0));
		}
	};

	const handleNextScene = () => {
		if (currentScene < Scenes.length - 1) {
			setDirection(true);
			setCurrentScene((prev) => Math.min(prev + 1, Scenes.length - 1));
		}
	};

	const swipeLeft = Gesture.Fling()
		.direction(1)
		.onEnd(() => handleNextScene());

	const swipeRight = Gesture.Fling()
		.direction(2)
		.onEnd(() => handlePrevScene());

	const composed = Gesture.Simultaneous(swipeLeft, swipeRight);
	useEffect(() => {
		const handleKeyPress = (event) => {
			if (event.key === 'ArrowRight') {
				handleNextScene();
			} else if (event.key === 'ArrowLeft') {
				handlePrevScene();
			}
		};
		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	});

	return (
		<GestureDetector gesture={composed}>
			<YStack
				flex={1}
				overflow="scroll"
				paddingTop={24}
				paddingHorizontal={20}
				gap={18}
			>
				{/* Header */}
				<XStack
					flexDirection="row"
					alignItems="center"
					marginTop={6}
					justifyContent="space-between"
					gap={'$2'}
				>
					<Button
						size="$4"
						marginTop={8}
						borderRadius={8}
						paddingVertical={20}
						backgroundColor="$primary300"
						color="$white"
						onPress={() => router.push('/landing')}
					>
						{'< Back'}
					</Button>
					<SizableText
						size={'$title2'}
						position="absolute"
						left={0}
						right={0}
						textAlign="center"
						fontWeight="400"
					>
						Summary
					</SizableText>
				</XStack>

				{/*seperator*/}
				<Separator
					borderColor="#ccc"
					borderWidth={1}
					borderRadius={10}
				/>
				{/*body*/}
				<YStack
					flex={1}
					justifyContent="center"
					alignItems="center"
					width="100%"
				>
					<Animated.View
						key={currentScene}
						entering={
							direction
								? FadeInRight.delay(200)
								: FadeInLeft.delay(200)
						}
						exiting={direction ? FadeOutLeft : FadeOutRight}
					>
						<CurrentScene {...CurrentArguments} />
					</Animated.View>
				</YStack>
				<YStack height={48} />
			</YStack>
		</GestureDetector>
	);
}
=======
import { StyleSheet, Text, View } from 'react-native';

export default function Summary() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>TODO: Summary page</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
	},
	text: {
		fontSize: 16,
		fontWeight: '700',
	},
});
>>>>>>> main
