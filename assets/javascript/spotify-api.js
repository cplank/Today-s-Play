//parse the url for the access token 
let getAccessToken = function (field, url) {

    let reg = new RegExp('[#?&]' + field + '=([^&#]*)', 'i');
    let string = reg.exec(url);
    return string ? string[1] : null;
};

let url = window.location.href
let accessToken = getAccessToken('access_token', url);

//makePlaylist 

function makePlaylist(artistNames, city, date) {
    let queryUrl = "https://api.spotify.com/v1/me"

    $.ajax({
        url: queryUrl,
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
    }).then(function (response) {
        let userObj = response
        let userId = userObj.id

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
            changeSpotifyWidget(newPlayListId);
            for (let i = 0; i < artistNames.length; i++) {
                getArtistTopTracks(artistNames[i], newPlayListId)
            }
        })

    })
}

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
        let artistId = artistObj.artists.items[0].id;

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

            for (let i = 0; i < Math.min(3, topTracksObj.length); i++) {
                let topTracksUri = topTracksObj[i].uri

                // push the id to a global list?
                allTheUris.push(topTracksUri)
                console.log(topTracksUri);
            }
            addTracksToPlaylist(allTheUris, playlistId);
        });


    });
}

function makeArtistNameWorkForSpotify(arr) {
    let returArray = []
    for (let i = 0; i < arr.length; i++) {
        returArray.push(encodeURIComponent(arr[i]));
    }

    return returArray
}

//makeArtistNameWorkForSpotify(artistName);

//translating tm artist name to spotify

let input = ["jenny lewis", "muse", "the beatles", "neutral milk hotel", "cher"]




function changeSpotifyWidget(playlistId) {
    $("#spotify-widget").attr("src", `https://open.spotify.com/embed/playlist/${playlistId}`)
}

// changeSpotifyWidget();