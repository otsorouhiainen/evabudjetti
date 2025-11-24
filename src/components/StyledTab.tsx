import { styled, Tabs } from 'tamagui';

export const StyledTab = styled(Tabs.Tab, {
	height: 40,
	borderWidth: 1,
	borderColor: '$color.primary200',
	shadowColor: '$color.black',
	shadowOffset: { width: 0, height: 3 },
	shadowOpacity: 0.25,
	shadowRadius: 3,
	elevation: 2,
	pressStyle: { backgroundColor: '$primary300' },
	focusStyle: { backgroundColor: '$primary200' },
	'$platform-native': {
		backgroundColor: '$color.white',
		pressStyle: {
			backgroundColor: '$primary300',
		},
		focusStyle: {
			backgroundColor: '$primary200',
		},
	},
});