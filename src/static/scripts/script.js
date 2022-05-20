
let map_pieces_x = 2
let map_pieces_y = 2
let map_piece_size_x = 256
let map_piece_size_y = 256

var pieces = Array(map_pieces_x).fill(null).map(() => Array(map_pieces_y));

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
var token = null;

function get_piece_src(x, y) {
    return "static/source/map/row-" + (y + 1) + "-column-" + (x + 1) + ".png";
}

function load_piece(x, y) {
    img = document.createElement('img');
    img.src = get_piece_src(x, y) + "?random=" + new Date().getTime();
    img.classList.add("map");
    img.setAttribute("id", x + "_" + y);
    img.width = map_piece_size_x;
    img.height = map_piece_size_y;
    document.getElementById("mapDiv").appendChild(img);
    pieces[x][y] = document.getElementById(x + "_" + y);
}

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

function pieceScaleOffset(x, y) {
    var pivotLocationX = -1 * (cursorX - pixelsOnScreenXdiv2);
    var pivotLocationY = -1 * (cursorY - pixelsOnScreenYdiv2);
    pivotLocationX += x * map_piece_size_x;
    pivotLocationY += y * map_piece_size_y;
    pieces[x][y].style.left = (pivotLocationX * pixelSize) + "px";
    pieces[x][y].style.top = (pivotLocationY * pixelSize) + "px";
}

function pieceScale(x, y) {
    pieces[x][y].width = mapInitialSizeX / map_pieces_x * pixelSize;
    pieces[x][y].height = mapInitialSizeY / map_pieces_y * pixelSize;
}

function mapScale(value) {
    pixelSize = value;
    pixelsOnScreenX = window.innerWidth / pixelSize;
    pixelsOnScreenY = window.innerHeight / pixelSize;
    pixelsOnScreenXdiv2 = parseInt(pixelsOnScreenX / 2)
    pixelsOnScreenYdiv2 = parseInt(pixelsOnScreenY / 2)

    setCookie("pixelSize", pixelSize, {'max-age': 3600});
    moveStep = parseInt(32 / pixelSize);

    for (var i = 0; i < map_pieces_x; i++) {
        for (var j = 0; j < map_pieces_y; j++) {
            pieceScale(i, j);
            pieceScaleOffset(i, j);
        }
    }
    
    cursorUpdate()
}

function moveBy(x, y) {
    var targetX = cursorX + x;
    var targetY = cursorY + y;
    if (targetX < 0) {
        targetX = 0;
    } else if (targetX >= mapInitialSizeX) {
        targetX = mapInitialSizeX - 1;
    }

    if (targetY < 0) {
        targetY = 0;
    } else if (targetY >= mapInitialSizeY) {
        targetY = mapInitialSizeY - 1;
    }

    cursorX = targetX;
    setCookie("cursorX", cursorX, {'max-age': 3600});

    cursorY = targetY;
    setCookie("cursorY", cursorY, {'max-age': 3600});



    for (var i = 0; i < map_pieces_x; i++) {
        for (var j = 0; j < map_pieces_y; j++) {
            pieceScaleOffset(i, j);
        }
    }
    cursorPosition.textContent = "(" + cursorX + ", " + cursorY + ")";
}

function mapInit() {
    cursorPosition = document.getElementById("cursorPosition");
    map = document.getElementById('map');
    mapInitialSizeX = map_piece_size_x * map_pieces_x;
    mapInitialSizeY = map_piece_size_y * map_pieces_y;

    cursorIcon = document.getElementById('cursor');

    pixelSize = parseInt(getCookie("pixelSize"))
    if (isNaN(pixelSize)) {
        pixelSize = 2;
    }

    document.getElementById("mapSize").value = pixelSize;

    cursorX = parseInt(getCookie("cursorX"));
    if (isNaN(cursorX)) {
        cursorX = parseInt(mapInitialSizeX / 2);
    }

    cursorY = parseInt(getCookie("cursorY"));
    if (isNaN(cursorY)) {
        cursorY = parseInt(mapInitialSizeY / 2);
    }

    mapScale(pixelSize);
}

function uiInit() {
    if (token == null) {

    } else {

    }
}

window.onload = function() {
    token = getCookie("token");
    uiInit();
    // init map settings.
    for (var i = 0; i < map_pieces_x; i++) {
        for (var j = 0; j < map_pieces_y; j++) {
            load_piece(i, j);
        }
    }
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
    } else if (keyName == "Enter" || keyName == " ") {
        fillTheCell();
    }
});

function updateCell(x, y) {
    var cell_x = parseInt(x / map_piece_size_x);
    var cell_y = parseInt(y / map_piece_size_y);
    pieces[cell_x][cell_y].src = get_piece_src(cell_x, cell_y) + "?random=" + new Date().getTime();
}

function askUserToLogin() {
    alert("To place cells you need to authorize first.")
}

function fillTheCell() {
    if (token == null) {
        askUserToLogin()
        return;
    }
    let xhr = new XMLHttpRequest();
    xhr.open("POST", '/submit', true);

    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var color = document.getElementById("color").value;
    let data = JSON.stringify({
        "x" : cursorX, 
        "y" : cursorY, 
        "color" : color,
        "token" : token
    });
    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                updateCell(cursorX, cursorY);
            }
        }
    };

    xhr.send(data);
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
  
function setCookie(name, value, options = {}) {
    options = {
        path: '/',
        ...options
    };
  
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }
  
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
  
    document.cookie = updatedCookie;
}

function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}

function clearCookies() {
    deleteCookie("cursorX");
    deleteCookie("cursorY");
    deleteCookie("pixelSize");
    deleteCookie("token");
}