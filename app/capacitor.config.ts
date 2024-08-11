import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.app.myappd',
  appName: "Paulera's AC",
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
