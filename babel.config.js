module.exports = (api) => {
	api.cache(true);
	return {
		presets: [
			[
				'babel-preset-expo',
				{
					unstable_transformImportMeta: true,
				},
			],
		],
		plugins: [
			'react-native-reanimated/plugin', // fixed bug on android
			[
				'@tamagui/babel-plugin',
				{
					components: ['tamagui'],
					config: './tamagui.config.ts',
					logTimings: true,
				},
			],
		],
	};
};
