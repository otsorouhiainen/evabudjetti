import { createFont, createTamagui, createTokens } from '@tamagui/core';

const firaFont = createFont({
	family: 'FiraSans',
	size: {
		true: 10,
		subtitle: 12,
		title3: 14,
		title2: 17,
		title1: 22,
	},
	lineHeight: {
		2: 22,
	},
	weight: {
		1: '300', // Corresponds to Light
		true: '400', // Corresponds to Regular
		3: '500', // Corresponds to Medium
		4: '600', // Corresponds to SemiBold
		5: '700', // Corresponds to Bold
		6: '800', // Corresponds to ExtraBold
	},
	letterSpacing: {
		1: 0,
		2: -1,
	},

	// This is the magic that links your weight tokens to the loaded font files
	// It works for both web and native
	face: {
		300: { normal: 'FiraSans_300Light' },
		400: { normal: 'FiraSans_400Regular' },
		500: { normal: 'FiraSans_500Medium' },
		600: { normal: 'FiraSans_600SemiBold' },
		700: { normal: 'FiraSans_700Bold' },
		800: { normal: 'FiraSans_800ExtraBold' },
	},
});

// Set up tokens
const size = {
	0: 0,
	1: 1,
	2: 2,
	true: 3,
	5: 5,
	6: 6,
	// ....
};

const color = {
	primary100: '#0A5B55',
	primary200: '#0E776E',
	primary300: '#14968A',
	primary400: '#74A57F',
	primary500: '#9ECE9A',
	primary600: '#C3EAC0',

	secondary100: '#E4C5AF',
	secondary200: '#F4E3D3',

	success500: '#4CAF50',
	warning500: '#FFC107',
	danger500: '#F44336',
	info500: '#2196F3',

	black: '#2F2F2F',
	white: '#fdfdfd',

	buttonBg: '#F1F5F4',
	buttonPrimary: '#14968A',
	segmentWrap: '#dff1eb',
};

export const tokens = createTokens({
	size,
	color,
	space: { ...size, '-1': -5, '-2': -10 },
	radius: { 0: 0, 1: 3 },
	zIndex: { 0: 0, 1: 100, 2: 200 },
});

const light = {
	background: tokens.color.white,
	backgroundStrong: tokens.color.primary100,
	color: tokens.color.black,
	colorStrong: tokens.color.black,

	bordercolor: tokens.color.black,
	buttonColor: tokens.color.segmentWrap,
	buttonBg: tokens.color.buttonBg,

	warning: tokens.color.warning500,
	danger: tokens.color.danger500,
	info: tokens.color.info500,
	success: tokens.color.success500,
};

const configDefinition = {
	fonts: {
		heading: firaFont,
		body: firaFont,
	},
	tokens,

	themes: {
		light,
		dark: {
			bg: '#111',
			color: tokens.color.white,
		},
	},

	media: {
		sm: { maxWidth: 860 },
		gtSm: { minWidth: 860 + 1 },
		short: { maxHeight: 820 },
		hoverNone: { hover: 'none' },
		pointerCoarse: { pointer: 'coarse' },
	},

	// Shorthands
	// Adds <View m={10} /> to <View margin={10} />
	// See Settings section on this page to only allow shorthands
	// Be sure to have `as const` at the end
	shorthands: {
		px: 'paddingHorizontal',
		f: 'flex',
		m: 'margin',
		w: 'width',
	} as const,
} as const;

type AppConfig = typeof configDefinition;

// this will give you types for your components
// note - if using your own design system, put the package name here instead of tamagui
declare module 'tamagui' {
	interface TamaguiCustomConfig extends AppConfig {}

	// if you want types for group styling props, define them like so:
	interface TypeOverride {
		groupNames(): 'card';
	}
}

const config = createTamagui(configDefinition);

export default config;
