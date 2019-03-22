//parse the url for the access token 
let getAccessToken = function (field, url) {

    let reg = new RegExp('[#?&]' + field + '=([^&#]*)', 'i');
    let string = reg.exec(url);
    return string ? string[1] : null;
};

let url = window.location.href
let accessToken = getAccessToken('access_token', url);

//makePlaylist function - this is the function that is ultimately called from app to run the Spotify
//API. It takes the parameters of artistNames (which is the argument it takes in app when called), city,
//and data. City and data are used further down to name the playlist.

function makePlaylist(artistNames, city, date) {
    let queryUrl = "https://api.spotify.com/v1/me"

    $.ajax({
        url: queryUrl,
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
    }).then(function (response) {
        //saving the object from spotify that holds all the user information
        let userObj = response
        let userId = userObj.id

        //initating the next AJAX call - this uses the userid we grabbed above to create a 
        //new playlist using the POST method. Spotify also requires extra information in the call,
        //incluidng a playlist name (which uses the date and city parameters from above), a content type
        //and data type.

        let queryUrl = `https://api.spotify.com/v1/users/${userId}/playlists`

        $.ajax({
            url: queryUrl,
            method: "POST",
            data: JSON.stringify({ "name": `Today's Play for ${date} in ${city}` }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
        }).then(function (response) {
            let newPlayListObj = response
            let newPlayListId = response.id

            for (let i = 0; i < artistNames.length; i++) {
                getArtistTopTracks(artistNames[i], newPlayListId)
            }

            //this function adds the new play list to the spotify widget
            changeSpotifyWidget(newPlayListId);
        })

    })
}

//this function takes and array and an id to perform another AJAX call  so we can add tracks
//to the play list. 
function addTracksToPlaylist(arr, playlistId) {
    let queryUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`

    $.ajax({
        url: queryUrl,
        method: "POST",
        data: JSON.stringify({ "uris": arr }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            'Authorization': 'Bearer ' + accessToken,

        },
    })
}

//This function takes artist name and an id to initaite the AJAX call to get top tracks for an artist.
function getArtistTopTracks(artistName, playlistId) {

    let queryUrl = `https://api.spotify.com/v1/search?q=${artistName}&type=artist`

    $.ajax({
        url: queryUrl,
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
    }).then(function (response) {
        let artistObj = response
        if (artistObj.artists.length < 1) {
            return;
        }
        //getting the id for the artist
        let artistId = artistObj.artists.items[0].id;

        //using the artist id to perform another AJAX call to get the top tracks
        let queryUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`
        $.ajax({
            url: queryUrl,
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
        }).then(function (response) {
            let topTracksObj = response.tracks
            let allTheUris = [];

            //we know we want the top three songs, so loop through the array three times or the length
            //of the array, whichever happens first.
            for (let i = 0; i < Math.min(3, topTracksObj.length); i++) {
                let topTracksUri = topTracksObj[i].uri

                // push the id to the empty array
                allTheUris.push(topTracksUri)
                console.log(topTracksUri);
            }
            addTracksToPlaylist(allTheUris, playlistId);
        });


    });
}

//this function ensures the artist name we get from ticketmaster matches the uri endcode neccessary
//for the spotify search
function makeArtistNameWorkForSpotify(arr) {
    let returArray = []
    for (let i = 0; i < arr.length; i++) {
        returArray.push(encodeURIComponent(arr[i]));
    }

    return returArray
}
//render the spotify widget using the play list id
function changeSpotifyWidget(playlistId) {
    $("#spotify-widget").attr("src", `https://open.spotify.com/embed/playlist/${playlistId}`)
}

