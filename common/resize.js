window.addEventListener('resize', () => {
    location.reload();
  });
game();
function game(wincounter, combo, streak, again){
    if(!wincounter){
        wincounter = 0;
    }
function settingshideshow() {
    const settings = document.getElementById("settings");
    const currentOpacity = window.getComputedStyle(settings).opacity;

    if (currentOpacity === "1") {
        settings.style.opacity = "0";
        settings.style.pointerEvents = "none";
    } else {
        settings.style.opacity = "1";
        settings.style.pointerEvents = "all";
    }
}
let counter = 0;
let countries = null;
let originalCountries = null;
let randomizedCountry = "";
let randomizedCountryCentroid = null;
let guessedCorrectly = false;
let world; // Declare world in global scope
errorHide();
console.log(wincounter);
function getCountryCentroid(countryName) {
    const countryFeature = originalCountries.features.find(feature => feature.properties.ADMIN.toLowerCase() === countryName.toLowerCase());
    if (!countryFeature) {
        console.error("Country not found:", countryName);
        return null;
    }
    return countryFeature.properties.centroid;
}

function getCentroid(coordinates) {
    let sumX = 0;
    let sumY = 0;
    let numPoints = 0;
    coordinates.forEach(area => {
        if (Array.isArray(area[0][0])) {
            area.forEach(subArea => {
                subArea.forEach(([x, y]) => {
                    sumX += x;
                    sumY += y;
                    numPoints++;
                });
            });
        } else {
            area.forEach(([x, y]) => {
                sumX += x;
                sumY += y;
                numPoints++;
            });
        }
    });
    return [sumX / numPoints, sumY / numPoints];
}

function getDistance(p1, p2) {
    const [lat1, lon1] = p1;
    const [lat2, lon2] = p2;
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function writeError(message) {
    const errorElements = document.querySelectorAll('.errorNAV');
    errorElements.forEach(el => {
        el.classList.remove('hide');
    });
    let errorInput = document.getElementById('error');
    errorInput.innerText = message;
    setTimeout(errorHide, 550);
}

function errorHide() {
    const errorElements = document.querySelectorAll('.errorNAV');
    errorElements.forEach(el => {
        el.classList.add('hide');
    });
}

function checkcountry(event) {
    event.preventDefault();
    const inputCountry = document.getElementById("countryid").value;
    const centroid = getCountryCentroid(inputCountry);
    if (!centroid) {
        console.log("Country not found.");
        writeError("Country not Found!");
        document.getElementById("countryid").value = "";
        return;
    }
    counter += 1;
    document.getElementById("counter").textContent = counter;
    const distance = getDistance(centroid, randomizedCountryCentroid);
    document.getElementById("distance").textContent = ` ${distance.toFixed(2)} km`;
    // Remove the input country from the globe
    const updatedFeatures = countries.features.filter(feature => feature.properties.ADMIN.toLowerCase() !== inputCountry.toLowerCase());
    countries.features = updatedFeatures;
    world.hexPolygonsData(updatedFeatures);
    if (inputCountry.toLowerCase() === randomizedCountry.toLowerCase()) {
        guessedCorrectly = true;
        showVictoryMessage(distance);
    }
    document.getElementById("countryid").value = "";
}

fetch("../datasets/ne_110m_admin_0_countries.geojson")
    .then((res) => res.json())
    .then((data) => {
        countries = JSON.parse(JSON.stringify(data));
        originalCountries = data;
        function randomizeCountry() {
            const randomIndex = Math.floor(Math.random() * countries.features.length);
            randomizedCountry = countries.features[randomIndex].properties.ADMIN;
            randomizedCountryCentroid = getCentroid(countries.features[randomIndex].geometry.coordinates);
        }

        document.querySelector(".preloader").style.display = "none";
        document.getElementById("globe-container").style.display = "block";

        countries.features.forEach((feature) => {
            feature.properties.centroid = getCentroid(feature.geometry.coordinates);
        });
        originalCountries.features.forEach((feature) => {
            feature.properties.centroid = getCentroid(feature.geometry.coordinates);
        });

        // Function to generate a consistent color based on country name
        function stringToColor(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            let color = '#';
            for (let i = 0; i < 3; i++) {
                let value = (hash >> (i * 8)) & 0xFF;
                color += ('00' + value.toString(16)).slice(-2);
            }
            return color;
        }

        world = Globe() // Assign to global world variable
            .onGlobeReady(randomizeCountry)
            .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
            .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
            .showGraticules(true)
            .showAtmosphere(true)
            .hexPolygonsData(countries.features)
            .hexPolygonResolution(4)
            .hexPolygonMargin(0)
            .hexPolygonUseDots(false)
            .hexPolygonColor(({ properties: d }) => stringToColor(d.ADMIN))
            .hexPolygonLabel(({ properties: d }) => `<b>${d.ADMIN} (${d.ISO_A2})</b> <br />Population: <i>${d.POP_EST}</i>`)
            .onHexPolygonClick(({ properties: d }) => {
                if (!guessedCorrectly) {
                    const centroid = d.centroid || [];
                    if (centroid.length !== 2) {
                        console.error("Invalid centroid data:", centroid);
                        return;
                    }
                    if (!randomizedCountry) {
                        console.error("Randomized Country not yet defined.");
                        return;
                    }
                    counter += 1;
                    document.getElementById("counter").textContent = counter;
                    const distance = getDistance(centroid, randomizedCountryCentroid);
                    document.getElementById("distance").textContent = ` ${distance.toFixed(2)} km`;
                    console.log(`Distance: ${distance.toFixed(2)} km`);
                    const updatedFeatures = countries.features.filter(feature => feature.properties.ADMIN !== d.ADMIN);
                    countries.features = updatedFeatures;
                    world.hexPolygonsData(updatedFeatures);
                    if (d.ADMIN === randomizedCountry) {
                        guessedCorrectly = true;
                        showVictoryMessage(distance);
                    }
                }
            })(document.getElementById("globeViz"));

        document.onkeypress = function (e) {
            e = e || window.event;
            if (e.key === ']') {
                console.log("Changing debug mode to true...");
                let debugged = true;
                console.log("Is debug mode on??", debugged);
                console.log("Randomized Country:", randomizedCountry);
                console.log(countries.features);
                writeError(randomizedCountry);
            }
        };

    })
    .catch((error) => {
        console.error("Error loading GeoJSON:", error);
    });

function showVictoryMessage(distance) {
    const victoryMessage = document.createElement("div");
    wincounter += 1;
    victoryMessage.classList.add("victory-message");
    victoryMessage.innerHTML = `<div>Victory</div><div>${randomizedCountry} is ${distance.toFixed(2)} km away!</div>`;
    document.body.appendChild(victoryMessage);
    const refreshButton = document.createElement("button");
    refreshButton.innerText = "Play Again";
    refreshButton.addEventListener("click", () => {
        location.reload();
    });
    const continueButton = document.createElement("button");
    continueButton.innerText = "Continue Playing";
    continueButton.addEventListener("click", () => {
        victoryMessage.remove();
        game(wincounter,0,0,true);
    });
    victoryMessage.appendChild(refreshButton);
    victoryMessage.appendChild(continueButton);
}}