import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Underdog Helper Backend is running!');
});

app.get('/api/picks', async (req, res) => {
  try {
    const response = await fetch(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds?regions=us&markets=spreads&apiKey=${process.env.ODDS_API_KEY}`);
    
    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ message: error.message, code: error.code });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching picks:', error);
    res.status(500).json({ error: 'Failed to fetch picks' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
