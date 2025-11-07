import type React from 'react';
import type { ReactNode } from 'react';
import Animated, {
	FadeInLeft,
	FadeInRight,
	FadeOutLeft,
	FadeOutRight,
} from 'react-native-reanimated';

interface SlideWrapperProps {
	children: ReactNode;
	fromRight?: boolean;
	duration?: number;
	delay?: number;
}

const SlideWrapper: React.FC<SlideWrapperProps> = ({
	children,
	fromRight = true,
	delay = 100,
}) => {
	return (
		<Animated.View
			entering={
				fromRight ? FadeInRight.delay(delay) : FadeInLeft.delay(delay)
			}
			exiting={fromRight ? FadeOutLeft : FadeOutRight}
		>
			{children}
		</Animated.View>
	);
};

export default SlideWrapper;
