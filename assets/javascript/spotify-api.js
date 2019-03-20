let getAccessToken = function (field, url) {

    let reg = new RegExp('[#?&]' + field + '=([^&#]*)', 'i');
    let string = reg.exec(url);
    return string ? string[1] : null;
};
let dummycrap = "#access_token=BQDu3iiv1y5zUmeevoH2tIIa9hVADONDmqLatxT7mR19FX92PnxZvohZJjEOyfQp2E5isch4SMFooZad7r-0ytsCRaTSLL_8Q41YUZhz7m2-JFLalPWvIs4qGvkXQTVCC23Ume7YCnzGVQwVJUvdbgEOEsvpx87uudfBd4Dqer8TgeugJ_e23TtB1GiD2pLRf5yqaUuLK3rGcwxgca0&token_type=Bearer&expires_in=3600&state=123";
let url = window.location.href + dummycrap;
let newPlayListId = "";


let accessToken = getAccessToken('access_token', url);

function makePlaylist(artistName) {
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
            data: JSON.stringify({ "name": "Todays Music" }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
        }).then(function (response) {
            let newPlayListObj = response
            newPlayListId = response.id

            getArtistTopTracks(artistName, newPlayListId)
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
            addTracksToPlaylist(allTheUris, newPlayListId);
        });


    });
}

makePlaylist("Jenny%20Lewis");

//translating tm artist name to spotify

// let input = ["jenny lewis", "muse", "the beatles", "neutral milk hotel", "cher"]

// function makeArtistNameWorkForSpotify(arr) {
//     let returArray = []
//     for (let i = 0; i < arr.length; i++) {
//         returArray.push(encodeURIComponent(arr[i]));
//     }

//     return returArray
// }

// console.log(makeArtistNameWorkForSpotify(input))


function changeSpotifyWidget() {
    $("#spotify-widget").attr("src", `https://open.spotify.com/embed/playlist/${newPlayListId}`)
}

changeSpotifyWidget();