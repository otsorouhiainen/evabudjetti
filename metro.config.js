// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
	// [Web-only]: Enables CSS support in Metro.
	isCSSEnabled: true,
});

// Add wasm asset support
config.resolver.assetExts.push('wasm');

// Add SQL migration support
config.resolver.sourceExts.push('sql');

// add nice web support with optimizing compiler + CSS extraction
const { withTamagui } = require('@tamagui/metro-plugin');
const tamaguiConfig = withTamagui(config, {
	components: ['tamagui'],
	config: './tamagui.config.ts',
	outputCSS: './tamagui-web.css',
});

// Add COEP and COOP headers to support SharedArrayBuffer
// We apply this to the final config to ensure it's not overwritten
tamaguiConfig.server.enhanceMiddleware = (middleware) => {
	return (req, res, next) => {
		// Was this
		// res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
		res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
		res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
		middleware(req, res, next);
	};
};

module.exports = tamaguiConfig;
