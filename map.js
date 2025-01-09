zones = []
let mainMap

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  mainMap = new Map(document.getElementById("map"), {
    zoom: 19,
    gestureHandling: "greedy",
    center: { lat: 42.273836, lng: -71.809810 },
    mapId: 'DEMO_MAP_ID',
    mapTypeId: "satellite",
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER,
    },
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER,
    },
    scaleControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    rotateControl: true,
    rotateControlOptions: {
      position: google.maps.ControlPosition.LEFT_CENTER,
    },
    controlSize: 50,
  });

  fetch(`${window.location.href}server/zones.csv`).then(response => {
    return response.text()
  }).then(data => {
    generateZones(data)
  });

}

async function generateZones(csvIn) {
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
  map = mainMap

  data = csvIn.split("\n")
  data = data.filter(item => item.includes("POLYGON"));
  data = data.map(item => item.substr(item.indexOf("((")+2,item.len).split(`))",`).reverse())
  data = data.map(item => [item[0], item[1].split(", ")])
  
  for(let i in data) {
    let fillLevel = Math.floor(Math.random()*5)
    let cords = []

    for(let j in data[i][1]) {
      arr = data[i][1][j].split(" ").reverse()
      cords.push({ lat : Number(arr[0]), lng : Number(arr[1])})
    }
    const zone = new google.maps.Polygon({
      paths: cords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
    });

    const pinImg = document.createElement("img")
    pinImg.src = `pins/pin${fillLevel}.svg`
    pinImg.style.height = "40mm"
    const pin = new PinElement({
      scale: 3,
      glyph: pinImg
    });
    const marker = new AdvancedMarkerElement({
      map,
      position: cords[0],
      content: pin.element,
      title: data[i][0],
      gmpClickable: true,
    });
    marker.addListener("click", ({ domEvent, latLng }) => {
      const { target } = domEvent;

      showHud(data[i][0])
    });
    zone.setMap(mainMap)
    zones.push(zone)
  }
}

initMap();