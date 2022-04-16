var map;
var cursorIcon;
var cursorX;
var cursorY;
var pixelSize = 2;

var mapInitialSizeX;
var mapInitialSizeY;
var moveStep = 1;
var pixelsOnScreenX = window.innerWidth / pixelSize;
var pixelsOnScreenY = window.innerHeight / pixelSize;
var pixelsOnScreenXdiv2 = parseInt(pixelsOnScreenX / 2);
var pixelsOnScreenYdiv2 = parseInt(pixelsOnScreenY / 2);
var cursorPosition = document.getElementById('cursorPosition');

function cursorUpdate() {
    cursorIcon.style.left = (pixelsOnScreenXdiv2 * pixelSize) + "px";
    cursorIcon.style.top = (pixelsOnScreenYdiv2 * pixelSize) + "px";
    cursorIcon.height = pixelSize;
    cursorIcon.width = pixelSize;
}

function mapScaleSetOffset() {
    var pivotLocationX = -1 * (cursorX - pixelsOnScreenXdiv2);
    var pivotLocationY = -1 * (cursorY - pixelsOnScreenYdiv2);
    map.style.left = (pivotLocationX * pixelSize) + "px";
    map.style.top = (pivotLocationY * pixelSize) + "px";
    // TODO: Fancy animation
}

function mapScale(value) {
    pixelSize = value;
    pixelsOnScreenX = window.innerWidth / pixelSize;
    pixelsOnScreenY = window.innerHeight / pixelSize;
    pixelsOnScreenXdiv2 = parseInt(pixelsOnScreenX / 2)
    pixelsOnScreenYdiv2 = parseInt(pixelsOnScreenY / 2)

    moveStep = parseInt(32 / pixelSize);

    map.width = mapInitialSizeX * pixelSize;
    map.height = mapInitialSizeY * pixelSize;
    mapScaleSetOffset();
    cursorUpdate()
}

function moveBy(x, y) {
    var targetX = cursorX + x;
    var targetY = cursorY + y;
    if (targetX * 2 < pixelsOnScreenX) {
        targetX = pixelsOnScreenXdiv2;
    } else if (2 * targetX + pixelsOnScreenX > 2 * mapInitialSizeX) {
        targetX = mapInitialSizeX - pixelsOnScreenXdiv2;
    }

    if (targetY * 2 < pixelsOnScreenY) {
        targetY = pixelsOnScreenYdiv2;
    } else if (2 * targetY + pixelsOnScreenY > 2 * mapInitialSizeY) {
        targetY = mapInitialSizeY - pixelsOnScreenYdiv2;
    }
    cursorX = targetX;
    cursorY = targetY;
    mapScaleSetOffset(pixelSize);
    cursorPosition.textContent = "(" + cursorX + ", " + cursorY + ")";
}

function mapInit() {
    map = document.getElementById('map');
    cursorIcon = document.getElementById('cursor');

    mapInitialSizeX = map.width;
    mapInitialSizeY = map.height;
    cursorX = parseInt(mapInitialSizeX / 2);
    cursorY = parseInt(mapInitialSizeY / 2);
    mapScale(2);
}

window.onload = function() {
    // init map settings.
    mapInit();
}

document.addEventListener('keydown', (event) => {
    const keyName = event.key;

    if (keyName == "ArrowRight") {
        moveBy(moveStep, 0);
    } else if (keyName == "ArrowLeft") {
        moveBy(-moveStep, 0)
    } else if (keyName == "ArrowUp") {
        moveBy(0, -moveStep);
    } else if (keyName == "ArrowDown") {
        moveBy(0, moveStep);
    }
});