import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Root route – avoids "Cannot GET /"
app.get('/', (req, res) => {
  res.send('🏀 Underdog Helper Backend is live!');
});

// Player stats route – uses RapidAPI
app.get('/api/player-stats', async (req, res) => {
  try {
    const url = 'https://api-nba-v1.p.rapidapi.com/players/statistics?game=8133';

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    // Optional: Check data format before sending
    if (!data || !data.response) {
      return res.status(500).json({ error: 'Invalid response from NBA API' });
    }

    res.json({ players: data.response });
  } catch (error) {
    console.error('Fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
