import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, SizableText, Stack, View, XStack, YStack } from 'tamagui';
import SlideWrapper from '../src/components/SlideWrapper';
import { Scene1 } from '../src/components/summary/scene1';
import { Scene2 } from '../src/components/summary/scene2';
import { Scene3 } from '../src/components/summary/scene3';
import { Scene4 } from '../src/components/summary/scene4';
import { Scene5 } from '../src/components/summary/scene5';

export default function Summary() {
	const router = useRouter();

	const budget_total = 4200;
	const budget_month = 1200;
	const spent_total = 1200;
	const spent_month = 1051;

	const current_month = 10;

	//currentScene is an integer used to attach needed arguments
	//to their correspon:widthding scenes
	const [currentScene, setCurrentScene] = useState<number>(0);
	const [direction, setDirection] = useState<boolean>(true);

	//hardcoded values for the 'scenes'
	//functions to fetch values dynamically should be added here later
	const Arguments = [
		{ budget: budget_total, expected: budget_month, spent: spent_month },
		{ balance: budget_total - spent_total },
		{
			months:
				(current_month + Math.round(budget_total / budget_month)) % 12,
		},
		{ categories: [1, 2, 3, 4], upcoming: [5, 6, 7, 8] },
		{},
	];

	const Scenes = [Scene1, Scene2, Scene3, Scene4, Scene5];
	const CurrentScene = Scenes[currentScene];
	const CurrentArguments = Arguments[currentScene];

	return (
		<>
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				overflow="scroll"
			>
				<YStack
					flex={1}
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
							position="absolute" // position text absolutely in the center
							left={0}
							right={0}
							textAlign="center" // centers text across the entire header
							fontWeight="400"
						>
							Summary
						</SizableText>
					</XStack>
					{/*seperator, forces the screen width*/}
					<View
						style={{
							height: 1,
							backgroundColor: '#ccc',
							marginHorizontal: 16,
							width: 360,
						}}
					/>

					{/*body*/}
					<YStack
						flex={1}
						justifyContent="center"
						alignItems="center"
						width="100%"
					>
						<SlideWrapper key={currentScene} fromRight={direction}>
							<CurrentScene {...CurrentArguments} />
						</SlideWrapper>
					</YStack>
					<XStack
						flex={1}
						paddingTop={24}
						paddingHorizontal={20}
						gap={18}
					>
						<Button
							size="$4"
							marginTop={8}
							position="absolute" // position text absolutely in the center
							left={1}
							bottom={1}
							borderRadius={8}
							paddingVertical={20}
							backgroundColor="$primary300"
							color="$white"
							onPress={() => {
								setDirection(false);
								setCurrentScene((prev) =>
									Math.max(prev - 1, 0),
								);
							}}
						>
							-1
						</Button>

						<Button
							size="$4"
							position="absolute" // position text absolutely in the center
							right={1}
							bottom={1}
							marginTop={8}
							borderRadius={8}
							paddingVertical={20}
							backgroundColor="$primary300"
							color="$white"
							onPress={() => {
								setDirection(true);
								setCurrentScene((prev) =>
									Math.min(prev + 1, Scenes.length - 1),
								);
							}}
						>
							+1
						</Button>
					</XStack>
					<YStack height={48} />
				</YStack>
			</YStack>
		</>
	);
}
