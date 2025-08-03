// Vercel serverless function to help find the correct league key
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    // Try to get user's leagues first
    const leaguesUrl = 'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nfl/leagues?format=json';
    
    const response = await fetch(leaguesUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      console.error('Yahoo API error:', response.status, response.statusText);
      return res.status(response.status).json({ 
        error: 'Failed to fetch leagues from Yahoo API',
        status: response.status,
        statusText: response.statusText
      });
    }

    const data = await response.json();
    
    // Parse leagues from the response
    const leagues = [];
    
    try {
      const user = data.fantasy_content.users['0'].user;
      const games = user[1].games;
      
      for (const gameKey in games) {
        if (!isNaN(gameKey)) {
          const game = games[gameKey].game;
          const gameLeagues = game[1].leagues;
          
          for (const leagueKey in gameLeagues) {
            if (!isNaN(leagueKey)) {
              const league = gameLeagues[leagueKey].league;
              leagues.push({
                league_key: league[0][0].league_key,
                name: league[0][2].name,
                season: league[0][1].season,
                game_key: game[0][0].game_key,
                game_name: game[0][2].name
              });
            }
          }
        }
      }
    } catch (parseError) {
      console.error('Error parsing leagues:', parseError);
      return res.status(500).json({
        error: 'Failed to parse leagues',
        raw_data: data
      });
    }

    return res.status(200).json({
      leagues: leagues,
      raw_data: data
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 