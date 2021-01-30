let state = Immutable.Map({
 
});
const rovers = ['Curiosity', 'Opportunity', 'Spirit'];
// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(state);
});

//render app UI
function render(state) {
    if (state.has('name')) {
        document.getElementById("app-body").innerHTML = displayRoverInfo(state);
        roverPhotos(state);
        refreshReady();
    }
    else {
        createMenu(rovers);
        displayIntro();
    }
}

//update state
function updateState(rover) {
    fetch(`http://localhost:3000/${rover}`)
    .then((res) => {
        return res.json();
    })
    .then((res) => {
        const currentData = res;
        const rname = addDataPoint('name', currentData.name);
        const rstatus = addDataPoint('status', currentData.status);
        const rphotos = addDataPoint('photos', getRecentPhotos(currentData.photos));
        const lastupdate = addDataPoint('last_update', currentData.last_update);
        const maxSol = addDataPoint('max_sol', currentData.max_sol);
        const landing = addDataPoint('landing', currentData.landing);
        const launch = addDataPoint('launch', currentData.launch);
        const newState = state.merge(rname, rstatus, rphotos, lastupdate, maxSol, landing, launch);
        return newState; 
    })
    .then((newState) => {
        render(newState);
    })
    return;
}

//add data point to state
function addDataPoint(key, data) {
    return state.set(key, data);
}
//display app instructions
function displayIntro() {
    return document.getElementById("app-body").innerHTML = `<h1 class="intro">Choose a rover to begin</h1>`;
}
//create navigation menu
function createMenu(rovers) {
    rovers.forEach((rover) => {
        const menuItem = document.createElement("li");
        menuItem.innerHTML = rover;
        menuItem.className = "menu-item";
        menuItem.id = rover;
        document.getElementById("main-menu-items").appendChild(menuItem);
        menuItem.addEventListener("click", function(event) {
            const target = event.target.id;
            updateState(target);
        });        
    });
}
//take photo manifest and return an object with necessary info only
function getRecentPhotos(state) {
    return state.map(formatURLs);
}
//format photo manifest data with necessary info only
function formatURLs(item) {
    return {
        url: item.img_src,
        earth_date: item.earth_date,
        sol: item.sol
    }
}
//create a new DOM element
function createSection(idName) {
    const newSection = document.createElement("DIV");
    newSection.id = idName;
    return document.getElementById("app-body").appendChild(newSection);
}
//get array of photos from current state and return dom element with photo and relevant info
function roverPhotos(state) {
    const photoArray = state.get('photos');
    createSection('rover-photos');
    return photoArray.forEach(displayRoverPhoto);
}
//creates and returns a dom element with rover photo and relevant data
function displayRoverPhoto(item) {
    const roverItem = document.createElement("DIV");
    roverItem.className = "rover-item";
    roverItem.innerHTML = `<img src="${item.url}"><p>Sol: ${item.sol}</p><p>Earth Date: ${item.earth_date}</p>`;
    return document.getElementById("rover-photos").appendChild(roverItem);
}
//returns relevant rover information for current state
function displayRoverInfo(state) {
    return `
    <h1 class="rover-heading">${state.get('name')}</h1>
    <p>Status: ${state.get('status')}</p>
    <p>Last Update: ${state.get('last_update')}</p>
    <p>Max Sol: ${state.get('max_sol')}</p>
    <p>Launch Date: ${state.get('launch')}</p>
    <p>Landing Date: ${state.get('landing')}</p>`;
}
//refreshes page when site name is clicked
function refreshReady() {
    document.getElementById("home").addEventListener("click", function() {
        window.location.reload(false);
    })
}