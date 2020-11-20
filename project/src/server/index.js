require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')
const app = express()
const port = 3000


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))
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
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const currentDate = () => {
	const date = new Date();
	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();
	const dateString = `${year}-${month}-${day}`;
	return dateString;
}