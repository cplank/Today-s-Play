# Spotify API
A series of AJAX calls to the Spotify API

## Description ##
This code handles the pass off of the auth token to the AJAX calls that require it and initiates a chain of AJAX calls to render and populate the Spotify Widget.

## Basics ##

The code is broken into six main functions: 

* getAccessToken - a function that parses the url for the Spotify access token and saves it for later use.
* makePlaylist - this is the function that is called from app.js to initiate the AJAX calls. It uses the artist name retrieved from the ticketmaster API to:
* * first, get the user's id and save it in a variable
* * then, perform another AJAX call using the user id to generate a new playlist
* * then, add the artist top tracks to the play list
* * last, add the new play list to the spotify widget
* addTracksToPlaylist - this function performs an AJAX call using the playlist id grabbed above to add the top tracks to thte playlist
* getArtistTopTracks - performs an AJAX call to search Spotify for an artist using artist name. Once the id is captured, peform another AJAX call using the artist id to get the top tracks and save them to a new array.
* makeArtistNameWorkForSpotify - takes an array and returns an array endcoded as URI
* changeSpotifyWidget - function that adds the playlist id to the spotify widget so it renders the new playlist.

## Roadmap ##

Eventually want to create another AJAX call to remove play lists that get created. 

## Shout Outs ##
 