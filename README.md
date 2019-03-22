# Today's Play - FRONTEND + UI


# App Summary
Today's Play is meant to be a simple application for music discovery based off location. The user types in a location (either local or elsewhere) and will be presented with a list of artists playing in that area on that day from Ticketmaster, and a Spotify playlist generated from the information provided from Ticketmaster.


# Sitemap
- Landing section: the starting point and main interaction from the user. A simple form input of location (either local or exploring) is all that's needed from the user. Displays the current date at the time of use (will always be today's date), and provides a link to the about section. 
- Widgets section: Ticketmaster Widget on the left/top, Spotify Widget on the right/bottom. Ticketmaster displays a visual list of artists that are playing on that day in that location (i.e populates artist playing in Seattle on Mar 22, 2019). Spotify creates a playlist based off of information provided from Ticketmaster's API query. This playlist will be saved to the user's spotify account.
- About section: An extra page that summarizes what the app is and how it works to new users or curious explorers of the app. This is a surface documentation of our app.


# Functionality
On first instance, the user begins at index.html. This is the initial step where the user will input their location, or see the about info. Once they click or press enter, they are redirected to Spotify to log in if not already previously logged in, else they will be redirected to our callback.html, which is the presentation of the Ticketmaster and Spotify widgets. They can interact with the widgets, as well as scroll back up to the landing section to type in a new location which will repeat the process of generating new information related to the new location query in the widgets. The site uses a sticky button to scroll back to the top once past the landing section.


# Takeaway
The app is functional in showing accurate information for larger cities (i.e. Seattle/Chicago/Los Angeles) and generating a playlist based off those artists. This was our MVP, and it works smoothly with a nice, straightforward UI. The full experience of the app relies heavily on the user having a Spotify account (free or premium) which could be a soft spot in its accessibility. 


# Future Development
We would like to incorporate:
- foolproof error states, such as if the user creates a typo in their location (--> the app would then notify the user of this instance)
- if the user searches a location that isn't a major city/doesn't have venues recognized by Ticketmaster
- selecting other dates than "today" (i.e. past dates for a playlist of past artists, and future dates for the same reason)
- being able to have the default playlist action be to remove it after that day, but if the user is comepelled to save it, they can (right now Spotify adds every playlist and doesn't delete it)
- incorporate a more visual display of the artists/more ingenuine approach to the dynamic parts of the site


# AP Contributions
I took charge of the full HTML structure and CSS styling focusing on the simplicity that the user would go through when using the app ("one" action on their end = simple app = simple design). I also pulled together the "glue" file which is our app.js that calls both the Ticketmaster and Spotify APIs' functions by linking it to the one action the user does--putting in their location. I used moment.js to run the date functionality and storing that data in a variable that Ticketmaster would use (both the date and location data) to pinpoint its database of artists for that day. With collaboration I was able to get the widgets to successfully appear in their section, while also having each portion of the site accurately and elegantly function as it should (ref Functionality above). I proposed the app idea/name to the group and we just ran with it, very successfully completing the MVP and learning a more hands-on approach to the ups and downs programming and teamwork. 