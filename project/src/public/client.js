// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    //get most recent photo
    getMostRecent();
    //add event listeners for menu buttons
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


//When page loads get most recent photo from active mars rover
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


//get appropriate data for rover
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
        const later = document.createElement('div');
        later.id = "rover-nav";
        later.innerHTML = `<button id="previous">Previous Sol >></button>`;
        document.getElementById('rover-photos').appendChild(later);
        return data;
    })
    .then((data) => {
        const previous = document.getElementById("previous");
        const currentSol = data;
        previous.addEventListener('click', () => {
            console.log(currentSol.first()[0].photo_manifest);
        })
    });
}

//add an appropriate header to each rover page
function getHeading (manifest) {
    if(manifest.status === 'active') {
        return `<h2 class="rover-heading"><span class="subheading">Rover Name: </span><br>${manifest.name}</h2><p><span class="uppercase">Launch Date:</span> ${manifest.launch_date}<br><span class="uppercase">Landing Date:</span> ${manifest.landing_date}<br><span class="uppercase">Last Updated:</span> ${manifest.max_date}<br><span class="uppercase">Status: </span><span class="yellow">${manifest.status}</span></p>`
    }
    else {
        return `<h2 class="rover-heading"><span class="subheading">Rover Name: </span><br>${manifest.name}</h2><p><span class="uppercase">Launch Date:</span> ${manifest.launch_date}<br><span class="uppercase">Landing Date:</span> ${manifest.landing_date}<br><span class="uppercase">Last Updated:</span> ${manifest.max_date}<br><span class="uppercase">Status: </span><span class="green">${manifest.status}</span></p>`
    };
}

//Get appropriate photo data from manifest
function getPhotos(manifest) {
    const photoArray = manifest.photos;
    const newPhotoArray = photoArray.map(info);
    return displayPhotos(newPhotoArray);
}
//create new array with relevant photo info only
const info = (photo) => {
    return {
        date: photo.earth_date,
        img: photo.img_src
    }
}
//append photos to dom
const displayPhotos = (relevantInfo) => {
   relevantInfo.forEach(x => {
        const url = x.img;
        const date = x.date;
        const photos = document.getElementById('photos');
        return document.getElementById('rover-photos').innerHTML += `<div class="rover-item"><img src="${url}"><p><span class="uppercase">Taken:</span> ${date}</div>`;
    });
}