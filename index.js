import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

dotenv.config();
const app = express();
app.use(cors());

app.get('/api/picks', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/basketball_nba/odds?regions=us&markets=player_points&apiKey=${process.env.ODDS_API_KEY}`
    );
    const data = await response.json();

    const parsedPicks = data
      .flatMap(game => game.bookmakers || [])
      .flatMap(book => book.markets || [])
      .filter(market => market.key === 'player_points')
      .flatMap(market => market.outcomes || [])
      .slice(0, 10)
      .map(outcome => ({
        player: outcome.name,
        stat: 'Points',
        line: outcome.point,
        confidence: Math.floor(Math.random() * 30) + 70
      }));

    res.json(parsedPicks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch picks' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
