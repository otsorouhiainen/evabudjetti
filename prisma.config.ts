//copied from https://www.prisma.io/docs/orm/reference/prisma-config-reference

import { defineConfig } from 'prisma/config';

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations',
		seed: 'ts-node prisma/seed.ts',
	},
});
