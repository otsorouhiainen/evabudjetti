import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomNav } from '../src/components/BottomNav';
import { Scene1 } from '../src/components/summary/scene1';
import { Scene2 } from '../src/components/summary/scene2';
import { Scene3 } from '../src/components/summary/scene3';
import { Scene4 } from '../src/components/summary/scene4';
import { Scene5 } from '../src/components/summary/scene5';

import * as eva from '@eva-design/eva';
import {
	ApplicationProvider,
	Button,
	IconRegistry,
	Layout,
	Text
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { customTheme } from '../src/theme/eva-theme';

export default function Summary() {
	const router = useRouter();
	//currentScene is an integer used to attach needed arguments
	//to their corresponding scenes 
	const [currentScene, setCurrentScene] = useState<number>(0);

	//hardcoded values for the 'scenes'
	//functions to fetch values dynamically should be added here later
	const Arguments = [
		{balance: 1},
		{balance: 2},
		{balance: 3},
		{balance: 4},
		{balance: 5},
	];

  	const Scenes = [Scene1, Scene2, Scene3, Scene4, Scene5];
  	const CurrentScene = Scenes[currentScene];
	const CurrentArguments = Arguments[currentScene];

	return (
		<>
			<IconRegistry icons={EvaIconsPack} />
			<ApplicationProvider
				{...eva}
				theme={{ ...eva.light, ...customTheme }}
			>
				<View
					style={{
						flex: 1,
						inset: 0,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Layout style={styles.screen} level="1">
						
						{/* Header */}
						<Layout style={styles.header} level="1">
							<Button
								size="small"
								style={[
									styles.headerBtn,
									{
										backgroundColor:
											customTheme['color-primary-300'],
									},
								]}
								onPress={() => router.push('/landing')}
							>
								{"< Back"}
							</Button>
							<Text category="h4" style={styles.headerTxt}> Summary </Text>
						</Layout>

						{/*seperator, forces the screen width*/}
      					<View style={{height: 1, backgroundColor: '#ccc', marginHorizontal: 16, width: 360,}}></View>
						
						{/*content thats loaded from src/summary and buttons to change content*/}
						<View style={styles.contentArea}>
							<CurrentScene {...CurrentArguments} />

							<View style={styles.sideButtons}>
								<Button
									style={styles.leftBtn}
									onPress={() =>
										setCurrentScene(prev => Math.max(prev - 1, 0))
									}
								>
									-1
								</Button>
								<Button
									style={styles.rightBtn}
									onPress={() =>
										setCurrentScene(prev => Math.min(prev + 1, Scenes.length - 1))
									}
								>
									+1
								</Button>
							</View>
						</View>

						{/* Bottom nav */}
						<BottomNav />
					</Layout>
				</View>
			</ApplicationProvider>
		</>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		paddingTop: 24,
		paddingHorizontal: 20,
		gap: 18,
	},
	//vibecoded css
	header: {
	    flexDirection: 'row',
	    alignItems: 'center',      // vertically center
	    justifyContent: 'space-between', // space between button and text placeholder
	    marginTop: 6,
	    paddingHorizontal: 10,     // optional spacing from edges
	},

	headerBtn: {
	    borderRadius: 18,
	    paddingVertical: 14,
	    paddingHorizontal: 20,
	},

	headerTxt: {
	    position: 'absolute',      // position text absolutely in the center
	    left: 0,
	    right: 0,
	    textAlign: 'center',       // centers text across the entire header
	    fontWeight: '400',
	},

	contentArea: {
		flex: 1,
		position: 'relative',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10, // below header
		marginBottom: 70, // above bottom nav (adjust to BottomNav height)
	},

	sideButtons: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		pointerEvents: 'box-none',
		paddingHorizontal: 0,  // remove container padding
	},

	leftBtn: {
		height: '100%',
		width: 70,
		borderRadius: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.1)',
		borderWidth: 0,
		elevation: 0,
		padding: 0,          // remove all padding
		paddingHorizontal: 0,
		paddingVertical: 0,
	},
	rightBtn: {
		height: '100%',
		width: 70,
		borderRadius: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.1)',
		borderWidth: 0,
		elevation: 0,
		padding: 0,
		paddingHorizontal: 0,
		paddingVertical: 0,
	},
});

