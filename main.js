// Main page JavaScript - only handles button click, no automatic OAuth
function initiateOAuth() {
  const REDIRECT_URI = window.location.origin + "/callback/";
  const CLIENT_ID = "dj0yJmk9Nmd4aExpNm1EWHVvJmQ9WVdrOVZsaHdRbGRRZG1NbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTUw";
  const authUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
  
  console.log("=== OAuth Debug Info ===");
  console.log("Redirect URI:", REDIRECT_URI);
  console.log("Client ID:", CLIENT_ID);
  console.log("Full Auth URL:", authUrl);
  console.log("========================");
  
  window.location = authUrl;
}

function testLeagueKeys() {
  const REDIRECT_URI = window.location.origin + "/test-league-keys/";
  const CLIENT_ID = "dj0yJmk9Nmd4aExpNm1EWHVvJmQ9WVdrOVZsaHdRbGRRZG1NbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTUw";
  const authUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
  
  console.log("=== Testing League Keys ===");
  console.log("Redirect URI:", REDIRECT_URI);
  console.log("Full Auth URL:", authUrl);
  console.log("========================");
  
  window.location = authUrl;
}

// Check if user returned with an access token
document.addEventListener("DOMContentLoaded", function() {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = fragment.get("access_token");
  
  if (accessToken) {
    // User has returned with an access token, redirect to callback page
    window.location = "/callback/";
  }
}); 