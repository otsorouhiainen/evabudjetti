import { View, Text} from 'react-native';

export const Scene2 = ({balance}: {balance: number}) => {
	return( 

	       <View>
			<View>
				<Text> Remaining </Text>

				<Text> {balance} </Text> 
			</View>

	       </View>


	);
};
