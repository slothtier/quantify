QUANTIFY
========

A simple [AngularJS](https://angularjs.org/) web application that estimates the size of [Spotify](https://www.spotify.com/) offline playlists
based upon data retrieved from the [Spotify Web API](https://developer.spotify.com/web-api/).

As retrieval of playlist data via the API requires authentication, QUANTIFY uses the APIs [Implicit Grant Workflow](https://developer.spotify.com/web-api/authorization-guide/#implicit_grant_flow) prompting users to sign-in and grant the application [read access to their playlists](https://developer.spotify.com/web-api/using-scopes/). 

Required storage space is calculated with assumed idealized bitrates of 96 kbps for normal, 160 kbps for high and 320 kbps for extreme [quality](https://support.spotify.com/us/learn-more/faq/#!/article/What-bitrate-does-Spotify-use-for-streaming/).
Based on real life tests, more realistic estimations can be achieved assuming 92, 153 and 281 kbps respectively.


**Have Fun!**

---

This project is licensed under [cc by 4.0](http://creativecommons.org/licenses/by/4.0/)

QUANTIFY is built on top of the [Web API](https://developer.spotify.com/web-api/) but is not affiliated in any way with Spotify. The API as well as all Spotify related content © [Spotify AB](https://www.spotify.com/).
