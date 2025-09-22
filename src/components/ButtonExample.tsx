import {
	Button,
	Icon,
	type IconElement,
	type IconProps,
	Layout,
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

const StarIcon = (props: IconProps): IconElement => (
	<Icon {...props} name="star" />
);

export const ButtonAccessoriesShowcase = (): React.ReactElement => (
	<Layout style={styles.container} level="1">
		<Button style={styles.button} status="primary" accessoryLeft={StarIcon}>
			PRIMARY
		</Button>

		<Button
			style={styles.button}
			status="success"
			accessoryRight={StarIcon}
		>
			SUCCESS
		</Button>

		<Button
			style={styles.button}
			status="danger"
			accessoryLeft={StarIcon}
		/>

		<Button
			style={styles.button}
			appearance="ghost"
			status="danger"
			accessoryLeft={StarIcon}
		/>
	</Layout>
);

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	button: {
		margin: 2,
	},
	indicator: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});
