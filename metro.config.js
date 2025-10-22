const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
	// [Web-only]: Enables CSS support in Metro.
	isCSSEnabled: true,
});

const { withTamagui } = require('@tamagui/metro-plugin');

config.resolver.unstable_enablePackageExports = true;

module.exports = withTamagui(config, {
	components: ['tamagui'],
	config: './tamagui.config.ts',
	outputCSS: './tamagui-web.css',
});
