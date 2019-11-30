import { google } from 'googleapis';
const googleClient = require('../../google.json');
const { OAuth2Client } = require('google-auth-library');
// interface OAuthConfig {
//   baseUrl: string;
//   clientId: string;
//   clientSecret?: string;
//   redirect?: string;
//   grantPath?: string;
//   revokePath?: string;
// }

// interface OAuthProvider {
//     configure(params: OAuthConfig): OAuthConfig;
// }

/*******************/
/** CONFIGURATION **/
/*******************/

const googleConfig = {
  clientId: googleClient.web.client_id,
  clientSecret: googleClient.web.client_secret,
  redirect: googleClient.web.redirect_uris[0],
};

const defaultScope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/plus.me',
];

/*************/
/** HELPERS **/
/*************/

function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect,
  );
}

function getConnectionUrl(auth: any) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope,
  });
}

function getGooglePlusApi(auth: any) {
  return google.plus({ version: 'v1', auth });
}

/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */
export function urlGoogle() {
  const auth = createConnection();
  const url = getConnectionUrl(auth);
  // console.log('google url:: ', auth, url);
  return url;
}

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
export async function getGoogleAccountFromCode(code: any) {
  const auth = await createConnection();
  const { tokens } = await auth.getToken(code);

  auth.setCredentials(tokens);

  /** Using a Google API Client Library **/
  const id_Token = tokens.id_token;
  const client = new OAuth2Client(googleConfig.clientId);
  const ticket = await client.verifyIdToken({
    idToken: id_Token,
    audience: googleConfig.clientId, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const id = payload['sub'];
  const email = payload['email'];

  return {
    tokens: tokens,
    id: id,
    email: email,
  };
}
