import {View, StyleSheet} from 'react-native';

import { Link, useRouter } from 'expo-router';

import * as eva from '@eva-design/eva';
import {
	ApplicationProvider,
	Button,
	IconRegistry,
	Layout,
	Text,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { customTheme } from '../../../src/theme/eva-theme';

export const Scene5 = ({balance}: {balance: number}) => {

	const router = useRouter();
	
	return( 
		<>
		<IconRegistry icons={EvaIconsPack} />
		<ApplicationProvider {...eva} theme={{ ...eva.light, ...customTheme }}>
			<View>

				<Button
					size="small"
					style={[
						styles.headerBtn,
						{
							backgroundColor:
								customTheme['color-primary-300'],
						},
					]}
					onPress={() => router.push('/budget')}
				>
					{"Open budget"}
				</Button>

				<Button
					size="small"
					style={[
						styles.headerBtn,
						{
							backgroundColor:
								customTheme['color-primary-300'],
						},
					]}
					onPress={() => router.push('/add_transaction')}
				>
					{"Add transaction"}
				</Button>
			
				<Button
					size="small"
					style={[
						styles.headerBtn,
						{
							backgroundColor:
								customTheme['color-primary-300'],
						},
					]}
					onPress={() => router.push('/summary')}
				>
					{"Replay summary"}
				</Button>
		       </View>


		</ApplicationProvider>
	</>
	);
};


const styles = StyleSheet.create({
	headerBtn: {
	    borderRadius: 18,
	    paddingVertical: 14,
	    paddingHorizontal: 20,
	},
});
