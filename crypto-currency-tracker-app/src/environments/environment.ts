// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  cryptoCompareBaseUrl: 'https://min-api.cryptocompare.com/data',
  cryptoCompareApiKey: '4ba051406115f868c4799ba7475c6fe06a1ee2c476836de8745c74207c13d7a8',
  cryptoCompareWebSocketUrl: 'wss://streamer.cryptocompare.com/v2'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
