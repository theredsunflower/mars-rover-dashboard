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

let state = Immutable.Map({
 
});

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
        const newState = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}/?api_key=${process.env.API_KEY}`)
        .then((response) => {
            return response.json();
        })
        //add manifest and max sol to array
        .then(updateStateData)
        .then(updateStatePhotos)
        res.send(newState)
    } 
    catch (err) {
        console.log('error:', err);
    }
}
/**
* @description Updates State with current data
* @param data fetched from server
*/
function updateStateData(data) {
    const currentData = data.photo_manifest;
    const rname = addDataPoint('name', currentData.name);
    const rstatus = addDataPoint('status', currentData.status);
    const lastupdate = addDataPoint('last_update', currentData.max_date);
    const maxSol = addDataPoint('max_sol', currentData.max_sol);
    const landing = addDataPoint('landing', currentData.landing_date);
    const launch = addDataPoint('launch', currentData.launch_date);
    const newState = state.merge(rname, rstatus, lastupdate, maxSol, landing, launch);
    return newState;  
}

/**
* @description Updates State with photos from manifest
* @param photo data fetched from server
*/
async function updateStatePhotos(currentState) {
    const photoArray = await getPhotoArray(currentState);   
    const rphotos = addDataPoint('photos', photoArray);
    const newState2 = currentState.merge(rphotos);
    return newState2;
}
/**
* @description Updates state with specified data
* @param {string} key name
* @param data fetched from server
*/
function addDataPoint(key, data) {
    return state.set(key, data);
}

/**
* @description Get most recent photo manifest from API and return array of photos
* @param current state
*/
async function getPhotoArray(state) {
    const sol = state.get('max_sol');
    const rover = state.get('name');
    let photoArray = '';
    const photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${process.env.API_KEY}`)
    .then((res) => {
        return res.json()
    })
    .then((res) => {
        photoArray = res.photos;
    })
    return photoArray;
}
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

