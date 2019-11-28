import { google } from 'googleapis';

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
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirect: process.env.GOOGLE_REDIRECT_URL,
};

const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
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
  console.log('auth/google:: ', auth, url);
  return url;
}

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
export async function getGoogleAccountFromCode(code: any) {
  const auth = createConnection();
  const data = await auth.getToken(code);
  const tokens = data.tokens;
  auth.setCredentials(tokens);
  const plus = getGooglePlusApi(auth);
  const me = await plus.people.get({ userId: 'me' });
  const userGoogleId = me.data.id;
  const userGoogleEmail =
    me.data.emails && me.data.emails.length && me.data.emails[0].value;
  console.log('auth/callback :: ', code, auth, tokens, me);
  return {
    id: userGoogleId,
    email: userGoogleEmail,
    tokens: tokens,
  };
}
