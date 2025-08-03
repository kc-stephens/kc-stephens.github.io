// Vercel serverless function to fetch teams from Yahoo Fantasy API
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { access_token, league_key } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    // Fetch teams from Yahoo Fantasy API
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${league_key || '399.l.175815'}/teams?format=json`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      console.error('Yahoo API error:', response.status, response.statusText);
      return res.status(response.status).json({ 
        error: 'Failed to fetch teams from Yahoo API',
        status: response.status,
        statusText: response.statusText
      });
    }

    const data = await response.json();
    
    // Parse teams from the response
    const teams = data.fantasy_content.league[1].teams;
    const teamNames = [];

    for (const teamId in teams) {
      if (!isNaN(teamId)) {
        const team = teams[teamId].team;
        teamNames.push(team[0][2].name);
      }
    }

    return res.status(200).json({
      teams: teamNames,
      raw_data: data // Include raw data for debugging
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 