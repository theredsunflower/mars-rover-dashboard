require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const port = 3000;
const Immutable = require('immutable');
 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '../public')));

// your API calls
//TODO: accept sol# query strings to add pagination by sol
app.get('/curiosity', async (req, res) => {
    return fetchData('curiosity', req, res);
});
app.get('/opportunity', async (req, res) => {
    return fetchData('opportunity', req, res);
});
app.get('/spirit', async (req, res) => {
    return fetchData('spirit', req, res);
});

const fetchData = async (rname, req, res) => {
    let rover = rname;
    try {
        const apiDate = currentDate();
        const manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}/?api_key=${process.env.API_KEY}`)
        .then((response) => {
            return response.json();
        })
        .then(getSol)
        .then(async (arr) => {
            const sol = arr.get(1);
            const photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&page=1&api_key=${process.env.API_KEY}`).then(res2 => res2.json());
            const intArray = arr.set(arr.size, photos);
            return intArray;
        })
        //console.log(manifest);
        res.send({manifest});
    } 
    catch (err) {
        console.log('error:', err);
    }    
}
function getSol(data) {
    const sol = Immutable.List([data, data.photo_manifest.max_sol]);
    return sol;
}

const currentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const dateString = `${year}-${month}-${day}`;
    return dateString;
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

