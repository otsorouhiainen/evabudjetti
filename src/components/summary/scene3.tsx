import { View, Text} from 'react-native';

export const Scene3 = ({months}: {months:number}) => {

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

	return( 

	       <View>
			<View>


				<Text> Your money will last until... </Text> 
				<Text> {kuukaudet[months]} </Text> 

			</View>

	       </View>


	);
};

