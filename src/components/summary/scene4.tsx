import { View, Text} from 'react-native';

export const Scene4 = ({categories, upcoming}: {categories: string[], upcoming: number[]}) => {

	return( 

		<View>
			
			<Text> Top 5 categories by spend </Text>
			<View> {categories.map((e) => <Text> {e} </Text>)} </View>

			<Text> Upcoming expenses </Text>
			<View> {upcoming.map((e) => <Text> {e} </Text>)} </View>

	       </View>


	);
}
