import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 🔑 Load .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/picks', async (req, res) => {
  try {
    const response = await fetch(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds?regions=us&markets=player_points&apiKey=${process.env.ODDS_API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching picks:', err);
    res.status(500).json({ error: 'Failed to fetch picks' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
