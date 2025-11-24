import { styled, XStack } from 'tamagui';

export const StyledListItem = styled(XStack, {
	backgroundColor: '$color.primary300',
	padding: '$2',
	borderRadius: '$2',
	shadowColor: '$color.black',
	shadowOffset: { width: 0, height: 3 },
	shadowOpacity: 0.25,
	shadowRadius: 3,
	elevation: 3,
	alignItems: 'center',
});