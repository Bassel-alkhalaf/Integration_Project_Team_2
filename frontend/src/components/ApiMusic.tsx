import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

export function ApiMusic() {

  const playlistId = '6NIrf8ILqP2hLpgiOC6VzA'; // Spotify playlist ID

  return (
    <Box sx={{ p: 2, bgcolor: 'orange', boxShadow: 2 }}>
      <Typography variant='h6' align='center'>Top Songs List</Typography>
      

      {/* insert Spotify list */}
      <Box sx={{ mt: 3 }}>
        <iframe
          title="Spotify Embed: Recommendation Playlist"
          src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
          width="100%"
          height="100%"
          style={{ minHeight: '360px' }}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </Box>
    </Box>
  );
}
