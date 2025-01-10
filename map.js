zones = []
fills = []
max = []
names = []
pins = []
pinicons = []
let mainMap

fetch(`${window.location.href}server/max.txt`).then(response => {
  return response.text()
}).then(data => {
  max = data.trim().split(",")
});

fetch(`${window.location.href}server/names.txt`).then(response => {
  return response.text()
}).then(data => {
  names = data.trim().split(",")
});

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

  fetch(`${window.location.href}server/fill.txt`, { cache: 'no-cache' }).then(response => {
    return response.text()
  }).then(data => {
    recieveFill(data)
  });

}

function recieveFill(dataIn) {
  fills = dataIn.trim().split(",")
  fills = fills.map(numberIn => Number(numberIn))
  print(fills)

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
    let fillLevel = fills[i]
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

    const pinImg = new Image()
    pinImg.src = `pins/pin${fillLevel}.svg`
    pinImg.style.height = "40mm"
    document.body.appendChild(pinImg)
    pins.push(pinImg)
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

      showHud(names[i],fills[i],max[i])
    });
    zone.setMap(mainMap)
    zones.push(zone)
  }
  print(pins)
}

initMap();

function updatePins(dataIn) {
  dataList = dataIn.trim().split(",")
  // print(dataList)
  for(let i in dataList) {
    pins[i].src = `pins/pin${dataList[i]}.svg`
  }

}

setInterval(getFill => fetch(`${window.location.href}server/fill.txt`, { cache: 'no-cache' }).then(response => {
  return response.text()
}).then(data => {
  updatePins(data)
}), 2000)