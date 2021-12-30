// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    appVersion: "v723demo3",
    USERDATA_KEY: "authf649fc9a5f55",
    isMockEnabled: true,
    apiUrl: "https://accountant.viewclass.com/api/v1/",
    auth_apiUrl: "https://ca1-dev.viewclass.com/api/v1/",
    accountant_apiUrl: "https://ca2-dev.viewclass.com/api/v1/",
    system_login_code: "099432a2-8e58-11eb-9353-4ae452c5b6ee",
    redirect_url: "http://localhost:4200/auth/social-login",
    site_key: "6Lc0wYIbAAAAABhaf7DgA267gIxFxu_hbQiRylTP",
    GoogleDriveRedirectUrl: 'http://localhost:4200/processing/active-google-drive-email'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.
