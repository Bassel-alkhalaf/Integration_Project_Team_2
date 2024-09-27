// spotifyService.api.ts
const CLIENT_ID = 'f5a6a6507826422f9a8ff248ebccac92'; 
const CLIENT_SECRET = '0587706a362d444a8e81deeb3560fe16'; 

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
