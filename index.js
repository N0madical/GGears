printer = true
visible = false
var activePin = "None"

function print(input) {
  if(printer) {console.debug(input)}
}

document.getElementById("hud").onpointerdown = handleTouch
document.getElementById("hud").onpointercancel = handleTouch
document.onpointermove = handleMove
document.onpointerup = handleUp
document.getElementById("hud").addEventListener("touchmove", preventDef)

function preventDef(evt) {
  evt.preventDefault()
}

function showHud(pinIn,count,total) {
  document.getElementById("info").textContent = `${count}/${total} bikes remaining at the ${pinIn} bike rack`
  visible = true
  document.getElementById("hud").style.height = setHeight
  document.getElementById("hud").style.visibility = "visible"
  document.getElementById("hud").style.transition = "bottom 0.2s ease-out"
  document.getElementById("hud").style.bottom = "2vw"
}

touch0 = 0 //Where the touch was first performed
moved = 0 //Record if the pointer moved
movement = 0 //The current movement of the item in pixels
mode = 0
initHeight = "80mm" //Initial height of the HUD
openHeight = "60%"
setHeight = initHeight
document.getElementById("hud").style.height = initHeight
document.getElementById("hud").style.bottom = `-${setHeight}`

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
    } else if (truHeight > (window.innerHeight * 0.7)) {
      document.getElementById("hud").style.height = `${(window.innerHeight * 0.7)}px`
    }
    print(movement)
  }
}

function handleUp(evt) {
  if(moved != 0) {
    if(moved == 1 && mode == 0) {mode = 1}
    if(movement > 150 && mode == 0) {
      mode = 1
    } else if(movement < -50 && mode == 0) {
      visible = false
      document.getElementById("hud").style.transition = "bottom 0.2s ease-out"
      document.getElementById("hud").style.bottom = `-${setHeight}`
    } else if(movement < -150 && mode == 1) {
      mode = 0
    }
    movement = 0
    if(visible) {
        if(mode == 0) {
            setHeight = initHeight
        } else {
            setHeight = openHeight
        }
      document.getElementById("hud").style.transition = "height 0.2s ease-out"
      document.getElementById("hud").style.height = setHeight
    }
    moved = 0
  }
}