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
    .then(res => res.json())
    .then((data) => {
        const info = document.getElementById('info');
        info.innerHTML = getHeading(data.manifest[0]);
        document.getElementById('photos').innerHTML += `<h3>Latest Activity</h3>`;
        getPhotos(data.manifest[1]);
        if(data.manifest[0].status === 'complete') {
            document.getElementById('photos').innerHTML += `<h2 class="rover-heading">Old Photos</h2>`;
            getPhotos(data.manifest[2]);
        }        
        return
    });
}

function getHeading (manifest) {
    return `<h2 class="rover-heading"><span class="subheading">Rover Name: </span><br>${manifest.name}</h2><p><span class="uppercase">Launch Date:</span> ${manifest.launch_date}<br><span class="uppercase">Landing Date:</span> ${manifest.landing_date}<br><span class="uppercase">Last Updated:</span> ${manifest.max_date}<br><span class="uppercase">Status:</span> ${manifest.status}`;
}

function getPhotos(manifest) {
    const photoArray = manifest.photos;
    const newPhotoArray = photoArray.map(info);
    return displayPhotos(newPhotoArray);
}
const info = (photo) => {
    return {
        date: photo.earth_date,
        img: photo.img_src
    }
}
const displayPhotos = (relevantInfo) => {
    //console.log(relevantInfo);
   relevantInfo.forEach(x => {
        const url = x.img;
        const date = x.date;
        const photos = document.getElementById('photos');
        photos.innerHTML += `<div class="rover-item"><img src="${url}"><p><span class="uppercase">Taken:</span> ${date}</div>`;
    });
    ////console.log(trythis);
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