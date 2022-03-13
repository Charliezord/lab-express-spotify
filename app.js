require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
//home page
app.get("/", (req, res) => {
  res.render("index");
});

//artist-search result when clicking on search button


// app.get("/artist-search", (req, res) => {
//     let artists  = req.query.artists;
//     console.log(req.query.artists);
//     spotifyApi
//     .searchArtists(artists)
//     .then((data) => {



app.get("/artist-search", (req, res) => {
    const { artists } = req.query;
    // console.log(artists);
    
    spotifyApi
      .searchArtists(artists)
      .then((data) => {
        let artistObject = data.body.artists.items[0];
        let artistImg = artistObject.images[0].url;
        let artistName = artistObject.name;
        let artistId = artistObject.id;
        // console.log(artistObject)
        res.render("artist-search-result", {artistImg, artistName, artistId});
    //   }).then(() => {
       
      })
      .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});



app.get("/albums/:artistId/", (req, res) => {
    let artistIdFromAlbum = req.params.artistId;

    spotifyApi
      .getArtistAlbums(artistIdFromAlbum)
      .then((data) => {
        let albumItems = data.body.items
        let albumArr = [];
        for(let i= 0; i < albumItems.length; i++){
            let currentElem = albumItems[i];
            let albumObj = {albumName: '', albumImg: "", albumId: ""};
            albumObj.albumName = currentElem.name;
            albumObj.albumImg = currentElem.images[0].url;
            albumObj.albumId = currentElem.id;
            albumArr.push(albumObj);
        }
        console.log(albumArr)
         res.render("albums", {albumArr});
      })
        .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
})

// app.get("/artist-search-result", (req, res) => {
//   spotifyApi
//     .searchArtists(req.query.artists)
//     .then((data) => {
//       console.log("The received data from the API: ", data.body.artists);
//       res.render("artist-search-result.hbs");
//       // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//     })
//     .catch((err) =>
//       console.log("The error while searching artists occurred: ", err)
//     );
// });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
