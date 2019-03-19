// GLOBAL VARS
let currentDate = moment().format('LL'); // grabs current date from m.js in mmmm dd, yyyy format
let formattedCurrentDate = moment().format("YYYY-MM-DD"); // creates current date in YYYY-MM-DD format (for TM API)

let userCity;

$("#todays-date").text(currentDate); // this changes the DOM's current date


// Call to Rob's TM API js
// function renderTMEvents(startDate, startTime, endDate, endTime, city, state, postalCode, countryCode, radius, maxEvents) {
//     console.log(startDate);
//     console.log(city);
// };


// Call to Carrie's Spotify API js
let clientId = "db62643fda74460eb21d4ea74fddb8ce";
let redirectUri = "https:%2F%2Fcplank.github.io%2FToday-s-Play%2F";


userCity = localStorage.getItem("location");
formattedCurrentDate = localStorage.getItem("date");

// function when user submits location
function userAction(event) {

    userCity = $("#user-input").val().trim();
    $("#widgets").removeClass("hidden"); // shows widget section
    $('html,body').animate({ // animate page to scroll to widget div
        scrollTop: $("#widgets").offset().top
    }, 'slow');
    let tmParams = formattedCurrentDate + " " + userCity;
    renderTMEvents(formattedCurrentDate, "", formattedCurrentDate, "", userCity, "", "", "", "", "");
    $("#todays-date").val("");
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user-read-private%20user-read-email&response_type=token&state=123`;
};

// when user presses enter key
$("#user-input").keydown(function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        userAction();
    };
});

// when user clicks enter button
$('#enter-button').click(function (event) {  // when start button is clicked
    userAction();
});








// to populate spotify playlists (for each instance) 






