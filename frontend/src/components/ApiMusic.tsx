import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { getAccessToken } from "./../api/apis/spotifyService.api";

interface PlaylistData {
  id: string;
  name: string;
  description: string;
  tracks: {
    items: Array<{
      track: {
        id: string;
        name: string;
        artists: Array<{ name: string }>;
      };
    }>;
  };
}

export function PlaylistComponent() {
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // get token
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessToken();
        setToken(accessToken); // set token
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const cachedPlaylist = localStorage.getItem("playlistData");

    if (cachedPlaylist) {
      setPlaylistData(JSON.parse(cachedPlaylist));
    } else if (token) {
      fetchWithRetry(
        "https://api.spotify.com/v1/playlists/6NIrf8ILqP2hLpgiOC6VzA",
        token
      )
        .then((data) => {
          setPlaylistData(data);
          localStorage.setItem("playlistData", JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Error fetching playlist data:", error);
        });
    }
  }, [token]);

  return (
    <Box sx={{ p: 2 }}>
      {playlistData ? (
        <iframe
          title="Spotify Embed: Recommendation Playlist"
          src={`https://open.spotify.com/embed/playlist/6NIrf8ILqP2hLpgiOC6VzA?utm_source=generator&theme=0`}
          width="100%"
          height="100%"
          style={{ minHeight: "360px" }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      ) : (
        <p>loading...</p>
      )}
    </Box>
  );
}

async function fetchWithRetry(url: string, token: string, retries: number = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
}

// import React, { useState, useEffect } from 'react';
// import { Box } from '@mui/material';
// import { getAccessToken, getAuthUrl } from './../api/apis/spotifyService.api';

// interface PlaylistData {
//   id: string;
//   name: string;
//   description: string;
//   tracks: {
//     items: Array<{
//       track: {
//         id: string;
//         name: string;
//         artists: Array<{ name: string }> ;
//       };
//     }>;
//   };
// }

// export function PlaylistComponent() {
//   const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const cachedToken = localStorage.getItem('spotifyToken');
//     if (cachedToken) {
//       setToken(cachedToken);
//     } else {
//       // Redirect the user to Spotify's authorization URL
//       window.location.href = getAuthUrl();
//     }
//   }, []);

//   // Retrieve token after redirecting back with the authorization code
//   useEffect(() => {
//     const fetchToken = async (code: string) => {
//       try {
//         const accessToken = await getAccessToken(code);
//         setToken(accessToken); // set token
//         localStorage.setItem('spotifyToken', accessToken);
//       } catch (error) {
//         console.error('Error fetching access token:', error);
//       }
//     };

//     const params = new URLSearchParams(window.location.search);
//     const code = params.get('code');
//     if (code) {
//       fetchToken(code);
//       // Optionally clear the code from the URL
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }
//   }, []);

//   useEffect(() => {
//     if (token) {
//       fetchWithRetry('https://api.spotify.com/v1/playlists/6NIrf8ILqP2hLpgiOC6VzA', token)
//         .then(data => {
//           setPlaylistData(data);
//           localStorage.setItem('playlistData', JSON.stringify(data));
//         })
//         .catch(error => {
//           console.error('Error fetching playlist data:', error);
//         });
//     }
//   }, [token]);

//   return (
//     <Box sx={{ p: 2 }}>
//       {playlistData ? (
//         <iframe
//           title="Spotify Embed: Recommendation Playlist"
//           src={`https://open.spotify.com/embed/playlist/6NIrf8ILqP2hLpgiOC6VzA?utm_source=generator&theme=0`}
//           width="100%"
//           height="100%"
//           style={{ minHeight: '360px' }}
//           allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
//           loading="lazy"
//         />
//       ) : (
//         <p>loading...</p>
//       )}
//     </Box>
//   );
// }

// async function fetchWithRetry(url: string, token: string, retries: number = 3) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return await response.json();
//     } catch (error) {
//       if (i === retries - 1) throw error;
//     }
//   }
// }
