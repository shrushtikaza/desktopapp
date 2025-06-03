const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
require("dotenv").config();
const express = require("express");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = "https://localhost:8888/callback";

let accessToken = "";
let win;

const open = (...args) => import("open").then(m => m.default(...args));

function createWindow() {
  win = new BrowserWindow({
    width: 550,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.removeMenu();
  win.loadFile("index.html");

  ipcMain.on("load-page", (_, page) => {
    win.loadFile(page);
  });

  ipcMain.on("spotify-login", () => {
    open("http://localhost:8888/login");
  });

  ipcMain.on("play-playlist", async (_, playlistUri) => {
    if (!accessToken) {
      console.log("Access token missing. Login first.");
      return;
    }

    try {
      await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context_uri: playlistUri,
          offset: { position: 0 },
        }),
      });

      console.log("▶️ Playlist started:", playlistUri);
    } catch (err) {
      console.error("Error starting playlist:", err);
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  const authApp = express();

  authApp.get("/login", (req, res) => {
    const scopes = [
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-read-currently-playing"
    ].join(" ");

    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${redirectUri}`;
    open(authUrl);
    res.send("Logging in to Spotify...");
  });

  authApp.get("/callback", async (req, res) => {
    const code = req.query.code;

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        }),
      });

      const data = await response.json();
      accessToken = data.access_token;
      res.send("Login successful! You can return to the app.");
    } catch (err) {
      res.send("Error fetching access token.");
    }
  });

  authApp.listen(8888, () => {
    console.log("Auth server running at http://localhost:8888/login");
  });
});
