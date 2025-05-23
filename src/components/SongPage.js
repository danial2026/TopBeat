import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBackIos } from "@mui/icons-material";
import axios from "axios";

const ArtistPage = () => {
  const navigate = useNavigate();
  const [mostPlayedSong, setMostPlayedSong] = useState(null);

  const getTokenFromLocalStorage = () => {
    return localStorage.getItem("spotify_access_token");
  };

  const deleteTokenFromLocalStorage = () => {
    return localStorage.clear();
  };

  const logout = useCallback(() => {
    deleteTokenFromLocalStorage();
    navigate(0);
  }, [navigate]);

  const getMostPlayedSong = useCallback(
    async (accessToken) => {
      try {
        const response = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            limit: 1,
            time_range: "medium_term",
          },
        });

        if (response.data.items && response.data.items.length > 0) {
          const mostPlayed = response.data.items[0];
          setMostPlayedSong(mostPlayed);
        } else {
          console.log("No top tracks found for the user.");
          logout();
        }
      } catch (error) {
        console.error("Error fetching most played track:", error);
        logout();
      }
    },
    [logout]
  );

  React.useEffect(() => {
    const cachedToken = getTokenFromLocalStorage();
    if (cachedToken) {
      getMostPlayedSong(cachedToken);
    } else {
      navigate(`/`);
    }
  }, [navigate, getMostPlayedSong]);

  return (
    <div>
      <button className="ios-back-button" onClick={() => navigate(-1)}>
        <ArrowBackIos fontSize="small" />
      </button>
      <div className="app-container">
        {mostPlayedSong && (
          <div className="most-played-container">
            <h2>Your Most Played Song:</h2>
            <img src={mostPlayedSong.album.images[0].url} alt="Album Art" />
            <h3>{mostPlayedSong.name}</h3>
            <p>{mostPlayedSong.artists[0].name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistPage;
