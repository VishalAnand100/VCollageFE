import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'course',
  exposes: {
    './Module': 'apps/course/src/app/remote-entry/entry.module.ts',
  },
};

export default config;
