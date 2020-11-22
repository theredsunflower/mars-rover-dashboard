let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('info');
const photos = document.getElementById('photos');

const updateStore = (store, newState) => {
    store = Object.assign(store, newState);
    //console.log(store);
    render(root, store);
}



// create content
const App = (state) => {
    let { rovers, apod } = state;
    return `
            <div>
                ${ImageOfTheDay(apod)}
            </div
    `;
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store);
    document.getElementById('curiosity').addEventListener('click', function() {
        clearScreen('info');
        clearScreen('photos');
        getRoverData('curiosity');
    });
    document.getElementById('opportunity').addEventListener('click', function() {
        clearScreen('info');
        clearScreen('photos');
        getRoverData('opportunity');
    });
    document.getElementById('spirit').addEventListener('click', function() {
        clearScreen('info');
        clearScreen('photos');
        getRoverData('spirit');
    });
    document.getElementById('home').addEventListener('click', function() {
        clearScreen('info');
        clearScreen('photos');
        render(root, store);
    });
})


// ------------------------------------------------------  COMPONENTS

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date();
    const photodate = new Date(apod.date);
    //console.log(apod.image.url);
    //console.log(photodate);
    //console.log(photodate.getDate(), today.getDate());
    //console.log(photodate.getDate() === today.getDate());

    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store);
        return;
    }
    // check if the photo of the day is actually type video!
    if (apod.image.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.image.url}">here</a></p>
            <p>${apod.image.title}</p>
            <p>${apod.image.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state;
    //console.log({apod});
    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then((apod) => {
            //console.log(apod);
            updateStore(store, {apod})
        })
    return state;
}
const render = async (root, state) => {
    root.innerHTML = App(state)
}
const getRoverData = async (rover) => {
    fetch(`http://localhost:3000/${rover}`)
    .then(res => res.json()).then((data) => {
        console.log(data.manifest.photos);
        return;
    })
    /*.then((data) => {
        const info = document.getElementById('info');
        const photos = document.getElementById('photos');
        info.innerHTML = getHeading(data);
        photos.innerHTML += getPhotos(data);
    });*/
   /* .then((data) => {
        getHeading(rover);
        getRoverInfo(rover)
        getPhotos(data);
       // return Object.values(data));
    });*/
}

function getHeading (data) {
    const manifest = Object.values(data)[0].photo_manifest;
    return `<h2>${manifest.name}</h2><p><b>Launch Date:</b> ${manifest.launch_date}<br><b>Landing Date:</b> ${manifest.landing_date}<br><b>Status:</b> ${manifest.status}<br><b>Last Updated:</b> ${manifest.max_date}`;
    //return document.getElementById('photos').innerHTML += `<h2 class="rover-heading">${rover}</h2>`;
}

function getPhotos(data) {
    const manifest = Object.values(data)[0].photo_manifest;
    if (manifest.status === 'active') {
        const photoArray = manifest.photos;
        console.log(photoArray.reduce(mostRecent).sol);
    }
}
function mostRecent(acc, cur) {
    if (Date.parse(acc.earth_date) >= Date.parse(cur.earth_date)) {
        return acc;
    }
    else {
        return cur;
    }
}
    //console.log(apod.image.url);
    //console.log(photodate);
    //console.log(photodate.getDate(), today.getDate());
    //console.log(photodate.getDate() === today.getDate());
    //const photoManifest = manifest.photos.photo_manifest;
    //const photos = rawData.photos;
    //photoArray = photos.map(info);
    //getHtml = displayPhotos(photoArray);
const info = (photo) => {
    return {
        launch: photo.rover.launch_date,
        land: photo.rover.landing_date,
        status: photo.rover.status,
        img: photo.img_src
    }
}
const displayPhotos = (relevantInfo) => {
    relevantInfo.forEach(x => {
        const url = x.img;
        const launch = x.launch;
        const land = x.land;
        const status = x.status;
        document.getElementById('photos').innerHTML += `<div class="rover-item"><img src="${url}"><p><b>Launch Date:</b> ${launch}</p><p><b>Landing Date:</b> ${land}</p><p><b>Status:</b> ${status}</p></div>`;
    });
    //console.log(trythis);
}



function clearScreen(element) {
    document.getElementById(element).innerHTML = '';
}

const currentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const dateString = `${year}-${month}-${day}`;
    return dateString;
}