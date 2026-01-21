import { styled, XStack } from 'tamagui';

const StyledListItem = styled(XStack, {
	backgroundColor: '$color.primary300',
	padding: 10,
	borderRadius: 10,
	shadowColor: '$color.black',
	shadowOffset: { width: 0, height: 3 },
	shadowOpacity: 0.25,
	shadowRadius: 3,
	elevation: 3,
	alignItems: 'center',
});

export default StyledListItem;
