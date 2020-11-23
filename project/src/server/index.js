require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const port = 3000;
const Immutable = require('immutable');
const url = require('url');
 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '../public')));

//API calls
app.get('/curiosity', async (req, res) => {
    return fetchData('curiosity', req, res);
});
app.get('/opportunity', async (req, res) => {
    return fetchData('opportunity', req, res);
});
app.get('/spirit', async (req, res) => {
    return fetchData('spirit', req, res);
});
app.get('/more-photos', async (req, res) => {
    const reqUrl = req.originalUrl;
    const url_parts = url.parse(reqUrl, true);
    const query = url_parts.query;
    const rover = query.rover;
    const sol = query.sol;
    console.log(query);
    try {
        const morePhotos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${process.env.API_KEY}`)
        .then(res2 => res2.json())
        res.send(morePhotos);
    }
    catch(err) {
        console.log('error:', err);
    }
})

/**
* @description Fetches Rover data
* @param {string} rover name
* @param Get request
* @param Get response
*/
const fetchData = async (rname, req, res) => {
    let rover = rname;
    try {
        //get manifest
        const manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}/?api_key=${process.env.API_KEY}`)
        .then((response) => {
            return response.json();
        })
        //add manifest and max sol to array
        .then(getSol)
        //add photos from max sol to array with manifest, max sol
        .then(async (arr) => {
            const sol = arr.get(1);
            const photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${process.env.API_KEY}`)
            .then(res2 => res2.json());
            const intArray = arr.set(arr.size, photos);
            return intArray;
        })
        //send object with array of manifest, max sol, and recent photos
        res.send({manifest});
    } 
    catch (err) {
        console.log('error:', err);
    }    
}
function getSol(data) {
    //create immutable list with manifest data, max sol
    const sol = Immutable.List([data, data.photo_manifest.max_sol]);
    return sol;
}
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

