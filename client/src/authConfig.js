export const msalConfig = {
    auth: {
      clientId: "fa02116e-94e9-4eda-9850-11e35e9d5f4c",
      authority: "https://login.microsoft.com/lambentprods.onmicrosoft.com",
      redirectUri: process.env.REACT_APP_URL,
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };
  
  // Add scopes here for ID token to be used at Microsoft identity platform endpoints.
  export const loginRequest = {
   scopes: ["User.Read"]
  };
  
  // Add the endpoints here for Microsoft Graph API services you'd like to use.
  export const graphConfig = {
      graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
  };