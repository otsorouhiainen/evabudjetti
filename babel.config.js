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
			['babel-plugin-inline-import', { extensions: ['.sql'] }],
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
