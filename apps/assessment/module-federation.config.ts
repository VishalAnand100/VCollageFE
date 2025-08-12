import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'assessment',
  exposes: {
    './Module': 'apps/assessment/src/app/remote-entry/entry.module.ts',
  },
};

export default config;
