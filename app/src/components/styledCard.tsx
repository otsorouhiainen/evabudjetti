import { Card, styled } from 'tamagui';

const StyledCard = Object.assign(
	styled(Card, {
		name: 'StyledCard',
		backgroundColor: '$primary200',
		borderRadius: "$2",
		shadowColor: '$color.black',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.25,
		shadowRadius: 3,
		elevation: 3,
		marginBottom: '$3',

		variants: {
			size: {
				small: { borderRadius: 10 },
			},
		},
	}),
	{
		Header: Card.Header,
		Footer: Card.Footer,
	},
);

export default StyledCard;
