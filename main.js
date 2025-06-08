const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const express = require("express");
const axios = require("axios");
const ngrok = require("ngrok");
require("dotenv").config();

const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
let redirectUri = ""; 
let accessToken = "";

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  win.loadFile("index.html");

  ipcMain.on("spotify-login", () => {
    shell.openExternal(`${redirectUri.replace('/callback', '')}/login`);
  });

  ipcMain.on("play-playlist", async (event, playlistUri) => {
    if (!accessToken) {
      console.log("Access token missing. Login first.");
      return;
    }

    try {
      await axios.put(
        "https://api.spotify.com/v1/me/player/play",
        { context_uri: playlistUri },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Playlist started");
    } catch (err) {
      console.error("Play error:", err.response?.data || err.message);
    }
  });
}

app.whenReady().then(async () => {
  createWindow();

  // Setup Express server
  const appServer = express();

  appServer.get("/login", (req, res) => {
    const scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing";
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${redirectUri}`;
    res.redirect(authUrl);
  });

  appServer.get("/callback", async (req, res) => {
    const code = req.query.code;

    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        }),
        {
          headers: {
            Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      accessToken = response.data.access_token;
      BrowserWindow.getAllWindows()[0].webContents.send("spotify-auth-success");
      res.send("Login successful! You can return to the app.");
    } catch (err) {
      console.error("Token error:", err.response?.data || err.message);
      res.send("Failed to get access token.");
    }
  });

  // Start HTTP server first
  const server = appServer.listen(8888, async () => {
    console.log("Local server running on port 8888");
    
    try {
      // Create ngrok tunnel
      const url = await ngrok.connect(8888);
      redirectUri = `${url}/callback`;
      console.log(`🔐 Secure tunnel created: ${url}`);
      console.log(`📝 Add this redirect URI to your Spotify app: ${redirectUri}`);
    } catch (error) {
      console.error("Failed to create ngrok tunnel:", error);
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", async () => {
  // Clean up ngrok tunnel
  await ngrok.kill();
});