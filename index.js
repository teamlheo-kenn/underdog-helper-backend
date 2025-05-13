import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/player-stats', async (req, res) => {
  try {
    const response = await fetch('https://api-nba-v1.p.rapidapi.com/players/statistics?game=8133', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
