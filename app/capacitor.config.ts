import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.app.myappd',
  appName: 'app',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
