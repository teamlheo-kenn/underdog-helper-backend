import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Root route to prevent "Cannot GET /"
app.get('/', (req, res) => {
  res.send('🏀 Underdog Helper Backend is running!');
});

// NBA Player Stats Route
app.get('/api/player-stats', async (req, res) => {
  const url = 'https://api-nba-v1.p.rapidapi.com/players/statistics?game=8133';

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!data || !data.response) {
      console.error('Invalid response:', data);
      return res.status(500).json({ error: 'Failed to fetch player stats' });
    }

    res.json({ stats: data.response });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
