// Yahoo Fantasy API endpoints
const CLIENT_ID = "dj0yJmk9Nmd4aExpNm1EWHVvJmQ9WVdrOVZsaHdRbGRRZG1NbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTUw";
const REDIRECT_URI = window.location.origin + "/callback/"; // Updated to use callback route

function getAccessToken() {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = fragment.get("access_token");
  if (accessToken) return accessToken;

  // Add error parameter handling
  const error = fragment.get("error");
  const errorDescription = fragment.get("error_description");
  
  if (error) {
    console.error("OAuth Error:", error, errorDescription);
    const container = document.getElementById("yahoo-ffb-teams");
    if (container) {
      container.innerHTML = `
        <div style="color: red; padding: 1em; border: 1px solid red; margin: 1em 0;">
          <h3>OAuth Error</h3>
          <p><strong>Error:</strong> ${error}</p>
          <p><strong>Description:</strong> ${errorDescription || 'No description provided'}</p>
          <p><strong>Redirect URI:</strong> ${REDIRECT_URI}</p>
          <p><strong>Client ID:</strong> ${CLIENT_ID}</p>
        </div>
      `;
    }
    return null;
  }

  // Only redirect if we're not already on the callback page
  if (!window.location.pathname.includes('/callback/')) {
    const authUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=fantasy`;
    console.log("Redirecting to:", authUrl);
    window.location = authUrl;
  }
  
  return null;
}

async function fetchAndShowTeams() {
  const accessToken = getAccessToken();
  if (!accessToken) return;

  const LEAGUE_KEY = "399.l.175815";

  const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${LEAGUE_KEY}/teams?format=json`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const container = document.getElementById("yahoo-ffb-teams");
  if (!container) return;

  if (!res.ok) {
    container.innerHTML = `<div>Error fetching teams: ${res.statusText}</div>`;
    return;
  }

  const data = await res.json();
  try {
    const teams = data.fantasy_content.league[1].teams;
    const teamNames = [];

    for (const teamId in teams) {
      if (!isNaN(teamId)) {
        const team = teams[teamId].team;
        teamNames.push(team[0][2].name);
      }
    }

    container.innerHTML = "<h2>Yahoo FFB Teams</h2>";
    teamNames.forEach((name) => {
      const div = document.createElement("div");
      div.textContent = name;
      container.appendChild(div);
    });
  } catch (e) {
    container.innerHTML = `<div>Could not parse teams: ${e}</div>`;
  }
}

window.addEventListener("DOMContentLoaded", fetchAndShowTeams);