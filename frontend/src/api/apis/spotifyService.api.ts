// spotifyService.api.ts

const CLIENT_ID = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID; 
const CLIENT_SECRET = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET;


export async function getAccessToken(): Promise<string> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`), 
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Error fetching access token: ${data.error}`);
  }
  
  return data.access_token; 
}

// spotifyService.api.ts

// const CLIENT_ID = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID; 
// const CLIENT_SECRET = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET;

// const scope = 'playlist-read-private playlist-modify-public user-read-email';
// const redirectUri = 'http://localhost:5173/callback';

// export function getAuthUrl(): string {
//   return `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
// }

// export async function getAccessToken(code: string): Promise<string> {
//   const response = await fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`), 
//     },
//     body: new URLSearchParams({
//       grant_type: 'authorization_code',
//       code,
//       redirect_uri: redirectUri,
//     }),
//   });

//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(`Error fetching access token: ${data.error}`);
//   }

//   return data.access_token; 
// }
