const html5QrCode = new Html5Qrcode("scanner");
const config = { fps: 10, qrbox: { width: 500, height: 500 } };

const onScanSuccess = (decodeText, decodeResult) => {
  alert("Selected Bike: " + decodeText, decodeResult)
}

function activateCamera() {
  html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess);
}