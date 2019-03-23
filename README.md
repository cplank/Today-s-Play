# Today's Play

## App Summary ##
Today's Play is meant to be a simple application for music discovery based off location. The user types in a location (either local or elsewhere) and will be presented with a list of artists playing in that area on that day from Ticketmaster, and a Spotify playlist generated from the information provided from Ticketmaster.

## Built With ##
- Bootstrap
- JQuery
- JavaScript
- AJAX

## Authors ## 
- Carrie Plank - TPM, Spotify API, spotify widget, integration (back-end to front-end)
- Aprille Perez - Product idea, marketing, designer, front-end, integration lead
- Rob Fanfant - TicketMaster API, integration
- Jordan Babbitt - TicketMaster widget and widget integration

## Sitemap ##
- Landing section: the starting point and main interaction from the user. A simple form input of location (either local or exploring) is all that's needed from the user. Displays the current date at the time of use (will always be today's date), and provides a link to the about section.

- Spotify redirect: following Spotify's Implicit Grant Authorization Flow, once the user enters their city they are redirected to Spotify's login page. This request uses user-read-private, user-read-email, and playlist-modify-public scopes to access the user information needed (just user id) and create playlists in the user's account. Once the user has logged in, they are directed to the callback page with the auth token from Spotify. This token expires after 1 hour. 

- Widgets section: Ticketmaster Widget on the left/top, Spotify Widget on the right/bottom. Ticketmaster displays a visual list of artists that are playing on that day in that location (i.e populates artist playing in Seattle on Mar 22, 2019). Spotify creates a playlist based off of information provided from Ticketmaster's API query. This playlist will be saved to the user's spotify account.

- About section: An extra page that summarizes what the app is and how it works to new users or curious explorers of the app. This is a surface documentation of our app.


### Functionality ###
On first instance, the user begins at index.html. This is the initial step where the user will input their location, or see the about info. Once they click or press enter, they are redirected to Spotify to log in if not already previously logged in, else they will be redirected to our callback.html, which is the presentation of the Ticketmaster and Spotify widgets. They can interact with the widgets, as well as scroll back up to the landing section to type in a new location which will repeat the process of generating new information related to the new location query in the widgets. The site uses a sticky button to scroll back to the top once past the landing section.

API calls are linked to user action (putting in their location) and moment.js captures the date. Both of these are saved to local storage so they can be accessed from callback after the Spotify redirect. 

### Design ### 

HTML structure and CSS styling with a focus on simplicity ("one" action on the user end = simple app = simple design). 

## Ticketmaster Widget ##
Displays events happening today by passing ticket master's widget the date from moment.js and the city from the user's input. 

### Functionality ###
On page load, the widget is immediately rendered by a call to ticket master's widget script. That means the widget is only rendered once, so when the user searches again for another city, a new widget wasn't being generated. To fix this, we grabbed ticket master function that renders the widget from their github page, and made our own function to render the widget when the user inputs their city again. 

### What was learned:###
The ticket master widget and API don't have direct crossover, meaning the widget couldn't be rendered directly from our API call.


## Ticketmaster API ##
Ticket Master (TM) allows application developers the ability to interface and discover details of all events the comapany is promoting. Ticket Master views these interfaces as a way of 
encouraging additional ticket sales from  third party applications. The TM developer interfaces provided come in several flavors- API(s),SDKs as well as Widgets. Ticket Master also 
provides utilities allowing application developers the abilty to quickly evaluate the most commonly used API(s), without writing one line of code.  The utilities allow quick modification 
of API input parameters, as well as running the API's to obtain the results of the API(s). Using the TM utilites is were we started our investigation in order to better understand 
how best to use the API(s) and Widgets.

Based on our applications requirements, the user first enters a city to obtain today's music events/concerts. Once city has been selected, our TMApi javascript calls the TM API 
asynchrously using AJAX. The API returns every music event happening in the choosen city for that day. Our TMApi javascript code then processes the AJAX response, and extracts the following
from the AJAX response: 1) every artist(including warm-up bands) 2) event name/venue 3)event location/address and 4) event start time. Each event(i.e. concert) in the response , an Artist 
Object is created and populated with data contained within the AJAX response.  Artist Object is then pushed into the TMEvents array. Once the TM response is completely processed, the 
array TMEvents array is returned by our javascript code. The javascript entry point into our TM event discovery is called 
renderTMEvents(). At a minimum, renderTMEvents expects a start date, end date and city input parameters.

### API Details:### 

Entry Point -  renderTMEvents(startDate, startTime, endDate, endTime, city, state, postalCode, countryCode, radius, maxEvents)
    startDate(REQURED) = YYYY-MM-DD
    startTime (optional) =  HH:MM:SS  (if start time is not provided 00:00:00 is used)
    endDate(REQUIRED) = YYYY-MM-DD
    endTime (optional) =  HH:MM:SS    (if end time is not provided 23:59:59 is used)
    city (REQUIRED) =  search specific city to discover music events
    state (optional) = search a state to discover music events
    postalCode (optional) - search a specific zip code to discover music events
    countryCode (optional) - search a country to discover music events
    radius (optional) - search for a distance around a point to discover musice events
    maxEvents(optional) - limit the number of events returned from Ticket Master

### Functionality: ### 
    The entry point(renderTMEvents) does minimal validation of input parameters prior to proceeeding. A TM music discovery query string is then created based on renderTMEents inputs. 
    An AJAX call is then made to TM to obtain events based on our requested parameters. Once the response is returned, our renderTMEvents calls an internal function called 
    createEvent(response) , passing it the TM response returned from the AJAX call. 
    The createEvent() is responsible for looping through all TM events, and extracting information from each event into ArtistObject. Once the ArtistObject is extracted, ArtistObject is then 
    pushed into the TMEvents array. Once all events have been processed, TMEvent object is returned to the calling function. 

### What was learned:###
Data returned from TM isn't consistent so try/catch exception handling had to be added. For some events , multiple artists were listed in the venue name in comma separated format. Code was added to parse this particular scenario. Warm up bands 
were listed for some artists but not others. This is the most difficult aspect of using the TM discovery API(s).

## Spotify API ##
This code handles the pass off of the auth token to the AJAX calls that require it and initiates a chain of AJAX calls to render and populate the Spotify Widget.

### API Details ###
The code is broken into six main functions: 

* getAccessToken - a function that parses the url for the Spotify access token and saves it for later use.
* makePlaylist - this is the function that is called from app.js to initiate the AJAX calls. It uses the artist name retrieved from the ticketmaster API to:
    * first, get the user's id and save it in a variable
    * then, perform another AJAX call using the user id to generate a new playlist
    * then, add the artist top tracks to the play list
    * last, add the new play list to the spotify widget
* addTracksToPlaylist - this function performs an AJAX call using the playlist id grabbed above to add the top tracks to thte playlist
* getArtistTopTracks - performs an AJAX call to search Spotify for an artist using artist name. Once the id is captured, peform another AJAX call using the artist id to get the top tracks and save them to a new array.
* makeArtistNameWorkForSpotify - takes an array and returns an array endcoded as URI
* changeSpotifyWidget - function that adds the playlist id to the spotify widget so it renders the new playlist.

# Takeaway
The app is functional in showing accurate information for larger cities (i.e. Seattle/Chicago/Los Angeles) and generating a playlist based off those artists. This was our MVP, and it works smoothly with a nice, straightforward UI. The full experience of the app relies heavily on the user having a Spotify account (free or premium) which could be a soft spot in its accessibility.


# Future Development
We would like to incorporate:
- foolproof error states, such as if the user creates a typo in their location (--> the app would then notify the user of this instance)
- if the user searches a location that isn't a major city/doesn't have venues recognized by Ticketmaster
- selecting other dates than "today" (i.e. past dates for a playlist of past artists, and future dates for the same reason)
- being able to have the default playlist action be to remove it after that day, but if the user is comepelled to save it, they can (right now Spotify adds every playlist and doesn't delete it)
- incorporate a more visual display of the artists/more ingenuine approach to the dynamic parts of the site
- include the warm up bands for an artist. We have part of this functionality already, but need to incorporate into the Spotify API

