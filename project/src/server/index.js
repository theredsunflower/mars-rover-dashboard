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
// example API call
app.get('/apod', async (req, res) => {
    try {
        const apiDate = currentDate();
        let image = await fetch(`https://api.nasa.gov/planetary/apod?date=${apiDate}&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
});
app.get('/curiosity', async (req, res) => {
    try {
        const apiDate = currentDate();
        const manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity/?api_key=${process.env.API_KEY}`)
        .then((response) => {
            return response.json();
        })
        .then(getSol).then(async (obj) => {
            const sol = obj[1];
            const photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&page=1&api_key=${process.env.API_KEY}`).then(res2 => res2.json());
            return photos;
        });
        res.send({manifest});
    } catch (err) {
        console.log('error:', err);
    }
});

app.get('/opportunity', async (req, res) => {
    try {
        const apiDate = currentDate();
        const manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity/?api_key=${process.env.API_KEY}`)
        .then((response) => {
            return response.json();
        })
        .then(getSol).then(async (obj) => {
            const sol = obj[1];
            const recentPhotos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=${sol}&page=1&api_key=${process.env.API_KEY}`).then(res2 => res2.json());
            return photos;
        });
        res.send({manifest});
    } catch (err) {
        console.log('error:', err);
    }
});

app.get('/spirit', async (req, res) => {
    try {
        const apiDate = currentDate();
        const manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/spirit/?api_key=${process.env.API_KEY}`)
        .then((response) => {
            return response.json();
        })
        .then(getSol).then(async (obj) => {
            const sol = obj[1];
            const photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?sol=${sol}&page=1&api_key=${process.env.API_KEY}`).then(res2 => res2.json());
            return photos;
        });
        res.send({manifest});
    } catch (err) {
        console.log('error:', err);
    }
});
/*
app.get('/curiosity', async (req, res) => {
    try {
        const apiDate = currentDate();
        const manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity/?api_key=${process.env.API_KEY}`)
        .then((response) => {
            return response.json();
        })
        .then(getSol).then(async (obj) => {
            const sol = obj[1];
            const curiosity = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&page=1&api_key=${process.env.API_KEY}`).then(res2 => res2.json());
            return curiosity;
        });
        res.send({manifest});
    } catch (err) {
        console.log('error:', err);
    }
});
app.get('/opportunity', async (req, res) => {
    try {
        const apiDate = currentDate();
        const manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity/?api_key=${process.env.API_KEY}`).then((response) => {
            //console.log(response.json());
            return response.json();
        }).then(getSol);
        //const curiosity = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`).then(res2 => res2.json());
        res.send({manifest});
    } catch (err) {
        console.log('error:', err);
    }
});

app.get('/spirit', async (req, res) => {
    try {
        const apiDate = currentDate();
        const manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/spirit/?api_key=${process.env.API_KEY}`).then((response) => {
            //console.log(response.json());
            return response.json();
        }).then(getSol);
        //const curiosity = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`).then(res2 => res2.json());
        res.send({manifest});
    } catch (err) {
        console.log('error:', err);
    }
});
*/
function getSol(data) {
    return [data, data.photo_manifest.max_sol];
}
/*
app.get('/curiosity', async (req, res) => {
    try {
        const apiDate = currentDate();
        const manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity/?api_key=${process.env.API_KEY}`).then(res1 => res1.json());
        //const curiosity = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`).then(res2 => res2.json());
        res.send({manifest});
    } catch (err) {
        console.log('error:', err);
    }
});

// get rover photos
app.get('/opportunity', async (req, res) => {
    try {
        const apiDate = currentDate();
        const manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity/?api_key=${process.env.API_KEY}`).then(res1 => res1.json());
        //const curiosity = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`).then(res2 => res2.json());
        res.send({manifest});
    } catch (err) {
        console.log('error:', err);
    }
});

// get rover photos
app.get('/spirit', async (req, res) => {
    try {
        const apiDate = currentDate();
        const manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/spirit/?api_key=${process.env.API_KEY}`).then(res1 => res1.json());
        //const curiosity = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`).then(res2 => res2.json());
        res.send({manifest});
    } catch (err) {
        console.log('error:', err);
    }
});
*/
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const currentDate = () => {
	const date = new Date();
	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();
	const dateString = `${year}-${month}-${day}`;
	return dateString;
}



function mostRecent(acc, cur) {
    if (Date.parse(acc.earth_date) >= Date.parse(cur.earth_date)) {
        return acc;
    }
    else {
        return cur;
    }
}