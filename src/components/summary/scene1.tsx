import { View, Text } from 'react-native';

export const Scene1 = ({budget, expected, spent}: {budget: number, expected: number, spent: number}) => {
	return( 

	       <View>
			<View>
				<Text> </Text>

				<Text> Total budget </Text>

				<Text> <div> {budget} </div> </Text>
			</View>

			<View>
	       
				<Text> Actual spend </Text>

				<Text> {spent} </Text> 
				
				<Text> Vs expected {expected} </Text>
			</View> 



	
			<View>
	       
				<Text> {Math.round(expected/spent*100)-100}% </Text>

			</View> 


       
	       </View>


	);
};
