var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
	for (var name in all)
		__defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
	if ((from && typeof from === 'object') || typeof from === 'function') {
		for (const key of __getOwnPropNames(from))
			if (!__hasOwnProp.call(to, key) && key !== except)
				__defProp(to, key, {
					get: () => from[key],
					enumerable:
						!(desc = __getOwnPropDesc(from, key)) ||
						desc.enumerable,
				});
	}
	return to;
};
var __toCommonJS = (mod) =>
	__copyProps(__defProp({}, '__esModule', { value: true }), mod);

// tamagui.config.ts
var tamagui_config_exports = {};
__export(tamagui_config_exports, {
	default: () => tamagui_config_default,
	tokens: () => tokens,
});
module.exports = __toCommonJS(tamagui_config_exports);
var import_core = require('@tamagui/core');
var firaFont = (0, import_core.createFont)({
	family: 'FiraSans',
	// Base name for the font family
	size: {
		// Your existing sizes are great
		body: 5,
		subtitle: 8,
		title3: 10,
		title2: 12,
		title1: 15,
	},
	lineHeight: {
		2: 22,
	},
	weight: {
		1: '300',
		// Corresponds to Light
		2: '400',
		// Corresponds to Regular
		3: '500',
		// Corresponds to Medium
		4: '600',
		// Corresponds to SemiBold
		5: '700',
		// Corresponds to Bold
		6: '800',
		// Corresponds to ExtraBold
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
var size = {
	0: 0,
	1: 1,
	2: 2,
	true: 3,
	5: 5,
	6: 6,
	// ....
};
var color = {
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
var tokens = (0, import_core.createTokens)({
	size,
	color,
	space: { ...size, '-1': -5, '-2': -10 },
	radius: { 0: 0, 1: 3 },
	zIndex: { 0: 0, 1: 100, 2: 200 },
});
var light = {
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
var configDefinition = {
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
	},
};
var config = (0, import_core.createTamagui)(configDefinition);
var tamagui_config_default = config;
// Annotate the CommonJS export names for ESM import in node:
0 &&
	(module.exports = {
		tokens,
	});
