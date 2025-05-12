import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Helper function to generate some AI-like insights (for simplicity, using random data for now)
const generateInsight = (confidence) => {
  if (confidence > 85) {
    return "High confidence: Likely to perform well based on odds.";
  } else if (confidence > 70) {
    return "Moderate confidence: Could go either way, but still a strong chance.";
  } else {
    return "Low confidence: Uncertain, watch for any last-minute updates.";
  }
};

// Endpoint to fetch both player points and player props
app.get('/api/player-data', async (req, res) => {
  try {
    // Fetch player points data
    const pointsResponse = await fetch(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds?regions=us&markets=player_points&apiKey=${process.env.ODDS_API_KEY}`);
    const pointsData = await pointsResponse.json();

    // Fetch player props data
    const propsResponse = await fetch(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds?regions=us&markets=player_props&apiKey=${process.env.ODDS_API_KEY}`);
    const propsData = await propsResponse.json();

    // Check if both responses are valid
    if (!Array.isArray(pointsData) || !Array.isArray(propsData)) {
      console.error("Bad API response:", pointsData, propsData);
      return res.status(500).json({ error: "Odds API returned invalid data" });
    }

    // Parse player points data
    const parsedPoints = pointsData
      .flatMap(game => game.bookmakers || [])
      .flatMap(book => book.markets || [])
      .filter(market => market.key === 'player_points')
      .flatMap(market => market.outcomes || [])
      .slice(0, 10)  // Limiting to 10 items for simplicity
      .map(outcome => ({
        player: outcome.name,
        stat: 'Points',
        line: outcome.point,
        confidence: Math.floor(Math.random() * 30) + 70,
        insight: generateInsight(Math.floor(Math.random() * 30) + 70)  // Simple AI Insight
      }));

    // Parse player props data
    const parsedProps = propsData
      .flatMap(game => game.bookmakers || [])
      .flatMap(book => book.markets || [])
      .filter(market => market.key === 'player_props')
      .flatMap(market => market.outcomes || [])
      .slice(0, 10)
      .map(outcome => ({
        player: outcome.name,
        stat: outcome.type,  // Type of prop (e.g., points, assists, rebounds)
        line: outcome.point,
        confidence: Math.floor(Math.random() * 30) + 70,
        insight: generateInsight(Math.floor(Math.random() * 30) + 70)
      }));

    // Combine both player points and props into one response
    const combinedData = {
      points: parsedPoints,
      props: parsedProps
    };

    // Send the combined response
    res.json(combinedData);
  } catch (err) {
    console.error("Fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch player data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
