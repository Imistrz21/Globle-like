    let randomizedCountry = ""; 
    let randomizedCountryCentroid = null; 
    let guessedCorrectly = false; 
    
    fetch("example/datasets/ne_110m_admin_0_countries.geojson")
      .then((res) => res.json())
      .then((countries) => {
        console.log("GeoJSON features:", countries.features);
        
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
        
        const world = Globe()
          .onGlobeReady(randomizeCountry)
          .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
          .hexPolygonsData(countries.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.3)
          .hexPolygonUseDots(true)
          .hexPolygonColor(() => `#${Math.round(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, "0")}`)
          .hexPolygonLabel(({ properties: d }) => `<b>${d.ADMIN} (${d.ISO_A2})</b> <br />Population: <i>${d.POP_EST}</i>`)
          (document.getElementById("globeViz"));
        
        function getCentroid(coordinates) {
          let sumX = 0;
          let sumY = 0;
          let numPoints = 0;
          coordinates.forEach(area => {
            if (Array.isArray(area[0][0])) {
              // Obszar może składać się z wielu podobszarów, dlatego iterujemy przez każdy z nich
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
          const R = 6371; // Promień Ziemi w km
          const dLat = deg2rad(lat2 - lat1);
          const dLon = deg2rad(lon2 - lon1);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c; // Odległość w km
          return distance;
        }
        
        function deg2rad(deg) {
          return deg * (Math.PI/180);
        }
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
      });
    
    function showVictoryMessage(distance) {
      document.getElementById("globe-container").style.display = "none";
      const victoryMessage = document.createElement("div");
      victoryMessage.classList.add("victory-message");
      victoryMessage.innerHTML = `<div class="victory">Victory</div><div>${randomizedCountry} is ${distance.toFixed(2)} km away!</div>`;
      document.body.appendChild(victoryMessage);
      const refreshButton = document.createElement("button");
      refreshButton.innerText = "Play Again";
      refreshButton.addEventListener("click", () => {
        location.reload();
      });
      victoryMessage.appendChild(refreshButton);
    }