visible = false
var activePin = "None"

document.getElementById("hud").onpointerdown = handleTouch
document.getElementById("hud").onpointercancel = handleTouch
document.onpointermove = handleMove
document.onpointerup = handleUp
document.getElementById("hud").addEventListener("touchmove", preventDef)

function preventDef(evt) {
  evt.preventDefault()
}

function showHud(pinIn) {
  activePin = pinIn
  visible = true
  document.getElementById("hud").style.transition = "bottom 0.2s ease-out"
  document.getElementById("hud").style.bottom = "1vh"
  document.getElementById("hud").style.top = ""
  document.getElementById("greeter").textContent = activePin
}

touch0 = 0 //Where the touch was first performed
moved = 0 //Record if the pointer moved
movement = 0 //The current movement of the item in pixels
mode = 0
initHeight = "80mm" //Initial height of the HUD
openHeight = "50%"
document.getElementById("hud").style.height = initHeight
setHeight = initHeight

function handleTouch(evt) { //Handle touches
  touch0 = evt.pageY + movement
  moved = 1
}

function handleMove(evt) {
  if(moved != 0) {
    document.getElementById("hud").style.transition = ""
    moved = 2
    movement = (touch0 - evt.pageY)
    document.getElementById("hud").style.height = `calc(${setHeight} + ${movement}px)`
    truHeight = parseInt(window.getComputedStyle(document.getElementById("hud")).getPropertyValue("height"), 10)
    if(truHeight < (window.innerHeight * 0.08)) {
      document.getElementById("hud").style.height = `${(window.innerHeight * 0.08)}px`
    } else if (truHeight > (window.innerHeight * 0.6)) {
      document.getElementById("hud").style.height = `${(window.innerHeight * 0.6)}px`
    }
    console.debug(movement)
  }
}

function handleUp(evt) {
  if(moved != 0) {
    if(moved == 1) {mode = (mode == 0) ? 1:0}
    if(movement > 300 && mode == 0) {
      mode = 1
    } else if(movement < -30 && mode == 0) {
      visible = false
      document.getElementById("hud").style.transition = "bottom 0.2s ease-out"
      document.getElementById("hud").style.bottom = ""
      document.getElementById("hud").style.top = "100vh"
    } else if(movement < -300 && mode == 1) {
      mode = 0
    }
    if(mode == 0) {
      setHeight = initHeight
    } else {
      setHeight = openHeight
    }
    movement = 0
    if(visible) {
      document.getElementById("hud").style.transition = "height 0.2s ease-out"
    }
    document.getElementById("hud").style.height = setHeight
    moved = 0
  }
}