let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root');
const photos = document.getElementById('photos');

const updateStore = (store, newState) => {
    store = Object.assign(store, newState);
    //console.log(store);
    render(root, store);
}

const render = async (root, state) => {
    root.innerHTML = App(state)
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
        clearScreen('root');
        clearScreen('photos');
        getPhotos('curiosity');
    });
    document.getElementById('opportunity').addEventListener('click', function() {
        clearScreen('root');
        clearScreen('photos');
        getPhotos('opportunity');
    });
    document.getElementById('spirit').addEventListener('click', function() {
        clearScreen('root');
        clearScreen('photos');
        getPhotos('spirit');
    });
    document.getElementById('home').addEventListener('click', function() {
        clearScreen('photos');
        render(root, store);
    });
})


// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

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
        //.then(apod => updateStore(store, { apod }))
    return state
}
const getPhotos = (rover) => {
    fetch(`http://localhost:3000/${rover}`)
    .then(res => res.json())
    .then((photos) => {
        renderPhotos(Object.values(photos)[0]);;
    })
}

function renderPhotos(photos) {
    const photoArray = photos.photos;
    //console.log(photoArray);
    const adjustedArray = photoArray.map(info);
    const newHTML = displayPhotos(adjustedArray);
    //console.log(adjustedArray);
}

const info = (photo) => {
    const relevantInfo = {
        launch: photo.rover.launch_date,
        land: photo.rover.landing_date,
        status: photo.rover.status,
        img: photo.img_src
    }
    return relevantInfo;
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
//Launch Date, Landing Date, Status, Most recently available photos, date most recent photos were taken

function renderImg (url) {
    console.log(url);
}

function clearScreen(element) {
    document.getElementById(element).innerHTML = '';
}