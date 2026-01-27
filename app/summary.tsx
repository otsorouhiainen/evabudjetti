import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
	FadeInLeft,
	FadeInRight,
	FadeOutLeft,
	FadeOutRight,
} from 'react-native-reanimated';
import { Button, Separator, SizableText, XStack, YStack } from 'tamagui';
import type { Item } from '@/src/constants/wizardConfig';
import useBalanceStore from '@/src/store/useBalanceStore';
import { test_transactions } from '@/src/utils/fakeTransactions';

import { Scene1 } from '../src/components/summary/scene1';
import { Scene2 } from '../src/components/summary/scene2';
import { Scene3 } from '../src/components/summary/scene3';
import { Scene4 } from '../src/components/summary/scene4';
import { Scene5 } from '../src/components/summary/scene5';

function sortDecreaseFreq(): string[] {
	const transactions: Item[] = test_transactions;

	//array of categories
	const cat_arr: string[] = transactions
		.filter((t) => t.type === 'expense')
		.map((t) => t.category);

	//	map where key is the name of the category
	// 	and payload is the number of occurrences
	const cat_map: Record<string, number> = {};
	cat_arr.forEach((c) => {
		cat_map[c] = (cat_map[c] || 0) + 1;
	});

	//returns the categories sorted based on occurrences
	return Object.keys(cat_map).sort((a, b) => cat_map[b] - cat_map[a]);
}

export default function Summary() {
	const router = useRouter();

	// HARDCODED VALUES for testing

	//hardcoded values
	//dynamic ones should just replace these and the page SHOULD work
	const budget_total = useBalanceStore((state) => state.balance);
	const balance_total = useBalanceStore((state) => state.disposable);
	const test_categories = sortDecreaseFreq();
	//variables used to change the 'scene' dynamically,
	const [currentScene, setCurrentScene] = useState<number>(0);
	const [direction, setDirection] = useState<boolean>(true);

	//each argument for each scene is given here
	//the purpose is to make switching to dynamic values easier
	const Arguments = {
		budget: budget_total,
		spent: budget_total - balance_total,
		balance: balance_total,
		months: 2,
		upcoming: test_transactions,
		categories: test_categories,
	};

	//each scene is a predefined react node
	//scenes are changed dynamically to avoid re-loading anything unneccessary
	const Scenes = [Scene1, Scene2, Scene3, Scene4, Scene5];
	const CurrentScene = Scenes[currentScene];
	const CurrentArguments = Arguments;

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
	/* Is causing error on mobile
		useEffect(() => {
			const handleKeyPress = (event: KeyboardEvent) => {
				if (event.key === 'ArrowRight') {
					handleNextScene();
				} else if (event.key === 'ArrowLeft') {
					handlePrevScene();
				}
			};
			window.addEventListener('keydown', handleKeyPress);
			return () => window.removeEventListener('keydown', handleKeyPress);
		});
	*/

	return (
		<GestureHandlerRootView>
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
							backgroundColor="$primary200"
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
		</GestureHandlerRootView>
	);
}
