// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    //get most recent photo
    getMostRecent();
    //When button is clicked, get relevant rover data
    document.getElementById('curiosity').addEventListener('click', function() {
        getRoverData('curiosity');
    });
    document.getElementById('opportunity').addEventListener('click', function() {
        getRoverData('opportunity');
    });
    document.getElementById('spirit').addEventListener('click', function() {
        getRoverData('spirit');
    });
    document.getElementById('home').addEventListener('click', function() {
        getMostRecent();
    });
})

/**
* @description Get most recent photo from active mars rover and append to DOM
*/
function getMostRecent() {
    document.getElementById('info').style.display = "block";
    document.getElementById('rover').style.display = "none";
    fetch(`http://localhost:3000/curiosity`)
    .then((res) => {
        return res.json();
    })
    .then((res) => {
        const today = res.manifest[2].photos[res.manifest[2].photos.length - 1];
        const eDate = today.earth_date;
        const solD = today.sol;
        const rover = today.rover.name;
        const status = today.rover.status;
        const img = today.img_src;
        const mostRecent = `<img alt="most-recent-photo" src="${img}"><div id="most-recent-photo-info"><p><span class="uppercase">Earth Date: </span>${eDate}<br><span class="uppercase">Martian Sol: ${solD}</span><br><span class="uppercase">Rover Name: </span>${rover}<br><span class="uppercase">Status: </span>${status}</p><button id="fp-see-more">See More</button>`;
        //update most recent photo div with most recent photo
        return document.getElementById('most-recent-photo').innerHTML = mostRecent;
    })
    .then((mostRecent) => {
        document.getElementById('fp-see-more').addEventListener('click', function() {
            getRoverData('curiosity');
        });
        return;
    });     
    return;
}


/**
* @description Get rover data and append to DOM
* @param {string} rover name
*/
const getRoverData = async (rover) => {
    document.getElementById('info').style.display = "none";
    document.getElementById('rover').style.display = "block";
    document.getElementById('rover-info').innerHTML = `<h2 class="loader">Loading...</h2>`;
    document.getElementById('rover-photos').innerHTML = '';
    fetch(`http://localhost:3000/${rover}`)
    .then(res => res.json())
    .then((res) => {
        return Immutable.Map(res);
    })
    .then((data) => {
        document.getElementById('rover-info').innerHTML = `${getHeading(data.first()[0].photo_manifest)}`;
        getPhotos(data.first()[2]);
        return data;
    })
    .then((data) => {
        addListeners(navInit(data));
    });
}

/**
* @description Add appropriate header to rover page DOM
* @param {object} rover data
* @param Get request
* @returns HTML for rover heading
*/
function getHeading (manifest) {
    if(manifest.status === 'active') {
        return `<h2 class="rover-heading"><span class="subheading">Rover Name: </span><br>${manifest.name}</h2><p><span class="uppercase">Launch Date:</span> ${manifest.launch_date}<br><span class="uppercase">Landing Date:</span> ${manifest.landing_date}<br><span class="uppercase">Last Updated:</span> ${manifest.max_date}<br><span class="uppercase">Status: </span><span class="yellow">${manifest.status}</span></p>`
    }
    else {
        return `<h2 class="rover-heading"><span class="subheading">Rover Name: </span><br>${manifest.name}</h2><p><span class="uppercase">Launch Date:</span> ${manifest.launch_date}<br><span class="uppercase">Landing Date:</span> ${manifest.landing_date}<br><span class="uppercase">Last Updated:</span> ${manifest.max_date}<br><span class="uppercase">Status: </span><span class="green">${manifest.status}</span></p>`
    };
}

/**
* @description Get appropriate photo data from manifest
* @param {object} rover data
* @returns displayPhotos function
*/
function getPhotos(manifest) {
    const photoArray = manifest.photos;
    const newPhotoArray = photoArray.map(info);
    return displayPhotos(newPhotoArray);
}

/**
* @description Get appropriate photo data from manifest
* @param {object} with photo data
* @returns array with relevant photo info
*/
const info = (photo) => {
    return {
        date: photo.earth_date,
        img: photo.img_src
    }
}

/**
* @description Append photos and data to dom
* @param {object} with photo data
*/
const displayPhotos = (relevantInfo) => {
   relevantInfo.forEach(x => {
        const url = x.img;
        const date = x.date;
        const photos = document.getElementById('photos');
        return document.getElementById('rover-photos').innerHTML += `<div class="rover-item"><img src="${url}"><p><span class="uppercase">Taken:</span> ${date}</div>`;
    });
}

/**
* @description Append nav element to DOM
* @param {object} with photo data
* @returns rover data
*/
function navInit(data) {
    document.getElementById('rover-nav').innerHTML = `<button id="previous">More Photos</button>`;
    return data;
}

/**
* @description Add event listener to Nav element to load more photos
* @param {object} rover data
*/
function addListeners(data) {
    const rname = data.first()[0].photo_manifest.name;
    const max_sol = data.first()[0].photo_manifest.max_sol;
    let currentSol = max_sol; 
    document.getElementById('previous').addEventListener('click', function() {
        changeSol(true);
        getMorePhotos(rname, currentSol);
        if (currentSol <= 0) {
            document.getElementById('previous').style.display = "none";        
        }       
    });
    //update sol
     function changeSol (bool) {
        if(bool) {
            currentSol = currentSol - 1;
            return currentSol;
        }
        else {
            currentSol = currentSol + 1;
            return currentSol;
        }
     }
}

/**
* @description Load more photos
* @param {string} rover name
* @param {number} current sol
*/
const getMorePhotos = async (rover, sol) => {
    fetch(`http://localhost:3000/more-photos/?rover=${rover}&sol=${sol}`)
    .then(res => res.json())
    .then((res) => {
        if(res.photos.length === 0) {
            return document.getElementById('rover-photos').innerHTML += `<div class="rover-item"><p><span class="uppercase">No photos available for sol ${sol}. Please try again.</span></p></div>`;
        }
        else {
            getPhotos(res);
        }
    })
}