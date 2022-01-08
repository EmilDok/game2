function handleMouseMove(event) {
    var Point = {
        posX: event.clientX - (window.innerWidth - 800)/2,
        posY: event.clientY - (window.innerHeight - 442)/2
    }
    return Point;
}

//variables
const canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 442;
const ctx = canvas.getContext('2d');

//layer1 - это фигура и прочие
//layer2 - линии

const canvas_stack = new CanvasStack('canvas');
const layer1 = canvas_stack.createLayer();
const layer1_ctx = document.getElementById(layer1).getContext('2d')

const layer2 = canvas_stack.createLayer();
const layer2_ctx = document.getElementById(layer2).getContext('2d')

const layer3 = canvas_stack.createLayer();
const layer3_ctx = document.getElementById(layer3).getContext('2d')

let canvases = document.querySelectorAll('canvas');

canvases.forEach(element => {
    element.style.left = '0'
    element.style.right = '0'
    element.style.top = '0'
    element.style.bottom = '0'
    element.style.margin = 'auto'
});

let curX = 0;
let curY = 0;

let frstX = 0;
let frstY = 0;

let scndX = 0;
let scndY = 0;
let curLineNumber = 0;
let linesPointsArr = [];
let specFunc;
let normalCoords = [];
let points = [0,0,0];
let toggleBtn = document.querySelector('.toggle-button');

let penalty = [
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
];
let levelsuc = [
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
];

let levelnum = -1;
let levelHardness = 0;

let time = 1;
//Add decorative items
let decor1 = new Image();
decor1.src = 'img/bg_decor.png';
decor1.onload = () => layer3_ctx.drawImage(decor1, 0, 0, 800, 442);

if (localStorage.getItem('username')) {
    let helloContainer = document.querySelector('.first-screen-container');
    let gameMenu = document.querySelector('.game-menu');
    gameMenu.classList.add("db")
    helloContainer.classList.add("dn")
    openMenu();
}

if (localStorage.getItem('theme') == '1') {
    toggleBtn.click()
    document.querySelector("body").classList.add("body-theme")
}

function changeTheme() {
    if (document.querySelector("body").classList.contains("body-theme")) {
        document.querySelector("body").classList.remove("body-theme");
        localStorage.setItem('theme', '0')
    } else {
        document.querySelector("body").classList.add("body-theme");
        localStorage.setItem('theme', '1')
    }
}

function Authorizate() {
    let inputName = document.querySelector('.first-screen input');
    let gameMenuContainer = document.querySelector('.game-menu');


    gameMenuContainer.classList.add("db")
    localStorage.setItem('username', inputName.value);

    let helloContainer = document.querySelector('.first-screen-container');
    
    helloContainer.classList.add("dn");
    openMenu();
}

function openScores() {
    let scores = document.querySelector('.best-score');
    let menuContainer = document.querySelector('.control-elements-container');
    let scoreLevels = document.querySelectorAll('.best-score .score-container span');
    let scorePoints = document.querySelectorAll('.best-score .points-container span');

    let firstBest = 0;
    let secondBest = 0;
    let thirdBest = 0;

    menuContainer.style.display = "none";
    scores.classList.add("db");

    for (let i = 1; i <= 4; i++) {
        if (localStorage.getItem(`${i} 0`) != null && firstBest < parseInt(localStorage.getItem(`${i} 0`))){
            firstBest = localStorage.getItem(`${i} 0`)
        }
    }

    scorePoints[0].innerHTML = firstBest;

    for (let i = 1; i <= 4; i++) {
        if (localStorage.getItem(`${i} 1`) != null && secondBest < parseInt(localStorage.getItem(`${i} 1`))){
            secondBest = localStorage.getItem(`${i} 1`)
        }
    }
    
    scorePoints[1].innerHTML = secondBest;

    for (let i = 1; i <= 4; i++) {
        if (localStorage.getItem(`${i} 2`) != null && thirdBest < parseInt(localStorage.getItem(`${i} 2`))){
            thirdBest = localStorage.getItem(`${i} 2`)
        }
    }
    
    scorePoints[2].innerHTML = thirdBest;
    

    ///////////////////

    for (let i = 0; i < 3; i++) {
        if (localStorage.getItem(`1 ${i}`) == null)
            scoreLevels[i].innerHTML = "-"
        else
            scoreLevels[i].innerHTML = "+";

        console.log(localStorage.getItem(`1 ${i}`), i)
    }

    for (let i = 3; i < 6; i++) {

        if (localStorage.getItem(`2 ${i-3}`) == null)
            scoreLevels[i].innerHTML = "-"
        else
            scoreLevels[i].innerHTML = "+";

        console.log(localStorage.getItem(`2 ${i}`), i)
    }

    for (let i = 6; i < 9; i++) {

        if (localStorage.getItem(`3 ${i-6}`) == null)
            scoreLevels[i].innerHTML = "-"
        else
            scoreLevels[i].innerHTML = "+";

        console.log(localStorage.getItem(`3 ${i}`), i)
    }

    for (let i = 9; i < 12; i++) {

        if (localStorage.getItem(`4 ${i-9}`) == null)
            scoreLevels[i].innerHTML = "-"
        else
            scoreLevels[i].innerHTML = "+";

        console.log(localStorage.getItem(`4 ${i}`), i)
    }


}

function openMenu() {
    let mainContainer = document.querySelector('.control-elements-container');
    let breads = document.querySelectorAll('.game-menu .levels-container img');
    let helloName = document.querySelector('.game-menu h1 strong');
    let topContainer = document.querySelector('.game-top');
    let gameResult = document.querySelector('.game-result');
    let scores = document.querySelector('.best-score');

    clearInterval(time);
    scores.classList.remove("db");
    gameResult.classList.remove("db");
    topContainer.classList.add("dn");
    mainContainer.style.display = "flex";

    helloName.innerHTML = localStorage.getItem('username');

    layer1_ctx.clearRect(0, 0, canvas.width, canvas.height);
    layer2_ctx.clearRect(0, 0, canvas.width, canvas.height);

    breads.forEach(element => {
        element.addEventListener('click', focusBread)
    });
}

function startGame() {
    let topContainer = document.querySelector('.game-top');
    let menuContainer = document.querySelector('.control-elements-container');
    let breads = document.querySelectorAll('.game-menu .levels-container img');
    let tasks = document.querySelectorAll('.task');
    let gameResult = document.querySelector('.game-result');
    let radios = document.querySelectorAll(".custom-radio");

    clearInterval(time);

    for (let i = 0; i < breads.length; i++) {
        if (breads[i].classList.contains('img-opacity')) {
            levelnum = i + 1;
        }
    }
    
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked)
            levelHardness = i;
    }

    gameResult.classList.remove("db")


    if (levelnum != -1) {
        menuContainer.style.display = "none";
        topContainer.classList.remove("dn");
        topContainer.classList.add("db");

        for (let i = 0; i < tasks.length; i++) {
            if (i == levelnum - 1)
                tasks[i].classList.add("db")
            else
                tasks[i].classList.remove("db")
        }


        switch (levelnum) {
            case 1:
                startFirstLevel(1 - levelHardness/4);
            break;
            case 2:
                startSecondLevel(1.25 - levelHardness/4);
            break;
            case 3:
                startThirdLevel(2 - levelHardness/2.5);
            break;
            case 4:
                startFourthLevel(2 - levelHardness/2.5);
            break;
        }
    }
}

function levelFailed() {
    let gameResultTitle = document.querySelector('.game-result h2');
    let gameResultPoints = document.querySelector('.game-result .points strong');
    let gameResultPenalty = document.querySelector('.game-result .penalty strong');
    let gameResult = document.querySelector('.game-result');


    clearInterval(time);

    gameResult.classList.add("db")

    gameResultTitle.innerHTML = "Уровень провален";

    switch (levelnum) {
        case 1:
            if (penalty[0][levelHardness] != 1 && levelsuc[0][levelHardness] == 0 && points[levelHardness]  - 1 >= 0 ){
                penalty[0][levelHardness] = 1;
                points[levelHardness] -= getSumPenalty();
            }

            gameResultPoints.innerHTML = `${points[levelHardness]}/10`;
            gameResultPenalty.innerHTML = `${getSumPenalty()}`;
        break;
        case 2:
            if (penalty[1][levelHardness] != 1 && levelsuc[1][levelHardness] == 0 && points[levelHardness]  - 1 >= 0){
                penalty[1][levelHardness]++;
                points[levelHardness]  -= getSumPenalty();
            }
        
            gameResultPoints.innerHTML = `${points[levelHardness]}/10`;
            gameResultPenalty.innerHTML = `${getSumPenalty()}`;
        break;
        case 3:
            if (penalty[2][levelHardness] != 1 && levelsuc[2][levelHardness] == 0 && points[levelHardness]  - 1 >= 0){
                penalty[2][levelHardness]++;
                points[levelHardness]  -= getSumPenalty();
            }
            
            gameResultPoints.innerHTML = `${points[levelHardness]}/10`;
            gameResultPenalty.innerHTML = `${getSumPenalty()}`;
        break;
        case 4:
            if (penalty[3][levelHardness] != 1 && levelsuc[3][levelHardness] == 0 && points[levelHardness]  - 1 >= 0){
                penalty[3][levelHardness]++;
                points[levelHardness]  -= getSumPenalty();
            }
            
            gameResultPoints.innerHTML = `${points[levelHardness] }/10`;
            gameResultPenalty.innerHTML = `${getSumPenalty()}`;
        break;
    }
    gameResultPenalty.innerHTML = getSumPenalty().toString();
}

function getSumPenalty() {
    let sum = 0;

    penalty[levelHardness].forEach(element => {
        sum += element;
    });
    
    return sum;
}

function levelSucceeded() {
    let gameResultTitle = document.querySelector('.game-result h2');
    let gameResultPoints = document.querySelector('.game-result .points strong');
    let gameResultPenalty = document.querySelector('.game-result .penalty strong');
    let gameResult = document.querySelector('.game-result');


    gameResult.classList.add("db")
    gameResultTitle.innerHTML = "Уровень пройден";
    clearInterval(time);

    switch (levelnum) {
        case 1:
            if (levelsuc[0][levelHardness] != 1)
                points[levelHardness]  += 1;

            gameResultPoints.innerHTML = `${points[levelHardness]}/10`;
            gameResultPenalty.innerHTML = getSumPenalty().toString();
            levelsuc[0][levelHardness] = 1;

        break;
        case 2:
            if (levelsuc[1][levelHardness] != 1)
                points[levelHardness]  += 2;

            gameResultPoints.innerHTML = `${points[levelHardness]}/10`;
            gameResultPenalty.innerHTML = getSumPenalty().toString();
            levelsuc[1][levelHardness] = 1;

        break;
        case 3:
            if (levelsuc[2][levelHardness] != 1)
                points[levelHardness]  += 3;

            gameResultPoints.innerHTML = `${points[levelHardness]}/10`;
            gameResultPenalty.innerHTML = getSumPenalty().toString();
            levelsuc[2][levelHardness] = 1;

        break;
        case 4:
            if (levelsuc[3][levelHardness] != 1)
                points[levelHardness]  += 4;

            gameResultPoints.innerHTML = `${points[levelHardness]}/10`;
            gameResultPenalty.innerHTML = getSumPenalty().toString();
            levelsuc[3][levelHardness] = 1;
            
        break;
    }

    localStorage.setItem(`${levelnum} ${levelHardness}`, points[levelHardness])
    

    // switch (levelnum) {
    //     case 1:
    //         if (localStorage.getItem(`${levelnum}1level`) == null || localStorage.getItem(`${levelnum}1level`) < levelSuccess[levelnum][levelHardness])
    //             localStorage.setItem(`${levelnum}1level`)
    //     break;
    //     case 2:
    //         if (localStorage.getItem(`${levelnum}2level`) == null || localStorage.getItem(`${levelnum}2level`) < levelSuccess[levelnum][levelHardness])
    //             localStorage.setItem(`${levelnum}2level`)
    //     break;
    //     case 3:
    //         if (localStorage.getItem(`${levelnum}3level`) == null || localStorage.getItem(`${levelnum}3level`) < levelSuccess[levelnum][levelHardness])
    //             localStorage.setItem(`${levelnum}3level`)
    //     case 4:
    //         if (localStorage.getItem(`${levelnum}4level`) == null || localStorage.getItem(`${levelnum}4level`) < levelSuccess[levelnum][levelHardness])
    //             localStorage.setItem(`${levelnum}4level`)
    //     break;
    // }     


}

function focusBread(event) {
    let breads = document.querySelectorAll('.game-menu .levels-container img');
    breads.forEach(element => {
        element.classList.remove("img-opacity");
    });

    event.target.classList.add("img-opacity");
}

function timer(timeMinut){
    let timerCont = document.querySelector('.game-top .timer');

    timeMinut = timeMinut*60;
    timerCont.innerHTML = " ";
    clearInterval(time);

    time = setInterval(function () {
        let seconds = timeMinut%60 // Получаем секунды
        let minutes = timeMinut/60%60 // Получаем минуты

        if (timeMinut <= -1) {

            clearInterval(time);
            // Выводит сообщение что время закончилось
            levelFailed();
        } else { // Иначе
            let strTimer = `${Math.trunc(minutes)}:${seconds}`;
            timerCont.innerHTML = strTimer;
        }
        --timeMinut; // Уменьшаем таймер
    }, 1000)
}

//Start levels

function startFirstLevel(time) {
    curLineNumber = 0;
    linesPointsArr = [];
    normalCoords = [];

    timer(time);

    layer1_ctx.clearRect(0, 0, canvas.width, canvas.height);
    layer2_ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.removeEventListener("click", specFunc);
    specFunc = setFirstPoint(followMouse(drawCircle), checkCollision, 1);
    canvas.addEventListener("click", specFunc);
    drawCircle();
}

function startSecondLevel(time) {
    curLineNumber = 0;
    linesPointsArr = [];
    normalCoords = [];

    timer(time);

    layer1_ctx.clearRect(0, 0, canvas.width, canvas.height);
    layer2_ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.removeEventListener("click", specFunc);
    specFunc = setFirstPoint(followMouse(drawRect), checkCollision2, 2);
    canvas.addEventListener("click", specFunc);
    drawRect();
}

function startThirdLevel(time) {
    curLineNumber = 0;
    linesPointsArr = [];

    timer(time);

    layer1_ctx.clearRect(0, 0, canvas.width, canvas.height);
    layer2_ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.removeEventListener("click", specFunc);
    specFunc = setFirstPoint(followMouse(drawRect2), checkCollision3, 4);
    canvas.addEventListener("click", specFunc);
    drawRect2();
}

function startFourthLevel(time) {
    curLineNumber = 0;
    linesPointsArr = [];
    normalCoords = [];

    timer(time);

    layer1_ctx.clearRect(0, 0, canvas.width, canvas.height);
    layer2_ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.removeEventListener("click", specFunc);
    specFunc = setFirstPoint(followMouse(drawRect3), checkCollision4, 4);
    canvas.addEventListener("click", specFunc);
    drawRect3();
}

//First level functions

function setFirstPoint(funcOnMouse, funcToCheck, linesNumber) {

    return function name(event) {
        //Если это конечный клик
        if (curLineNumber == linesNumber*2) {
            
            layer2_ctx.clearRect(0, 0, canvas.width, canvas.height);

            scndX = handleMouseMove(event).posX;
            scndY = handleMouseMove(event).posY;

            var Point1 = {
                posX: scndX,
                posY: scndY
            }

            linesPointsArr.push(Point1)

            funcToCheck();
            curLineNumber = 0;
            linesPointsArr = [];
        }
        //Если это первый клик
        if (curLineNumber % 2 == 0) {

            frstX = handleMouseMove(event).posX;
            frstY = handleMouseMove(event).posY;

            var Point1 = {
                posX: frstX,
                posY: frstY
            }

            linesPointsArr.push(Point1)
            document.onmousemove = funcOnMouse;
            curLineNumber++;
        //Если это второй клик
        } else {
            curLineNumber++;
            scndX = handleMouseMove(event).posX;
            scndY = handleMouseMove(event).posY;

            var Point1 = {
                posX: scndX,
                posY: scndY
            }
            linesPointsArr.push(Point1)

            funcToCheck();
            layer2_ctx.clearRect(0, 0, canvas.width, canvas.height);
            let fp = 0;
            let sp = 1;
            if (curLineNumber > 1) {
                while (sp <= linesPointsArr.length - 1) {
                    layer2_ctx.beginPath();
                    layer2_ctx.moveTo(linesPointsArr[fp].posX, linesPointsArr[fp].posY);
                    layer2_ctx.lineTo(linesPointsArr[sp].posX, linesPointsArr[sp].posY);
                    layer2_ctx.closePath();
                    layer2_ctx.lineWidth = 3;
                    layer2_ctx.strokeStyle = '#c2c2c2'
                    layer2_ctx.stroke();
                    fp += 2;
                    sp += 2;
                }
            }
        }

    };
}

function followMouse(linesNumber) {
    return function name1(event) {
        if (curLineNumber % 2 != 0) {

            curX = handleMouseMove(event).posX;
            curY = handleMouseMove(event).posY;

            layer2_ctx.clearRect(0, 0, canvas.width, canvas.height);
            //drawFigure();


            let fp = 0;
            let sp = 1;
            if (curLineNumber > 1) {
                while (sp <= linesPointsArr.length - 1) {
                    layer2_ctx.beginPath();
                    layer2_ctx.moveTo(linesPointsArr[fp].posX, linesPointsArr[fp].posY);
                    layer2_ctx.lineTo(linesPointsArr[sp].posX, linesPointsArr[sp].posY);
                    layer2_ctx.closePath();
                    layer2_ctx.strokeStyle = '#c2c2c2';
                    layer2_ctx.lineWidth = 3;
                    layer2_ctx.stroke();
                    fp += 2;
                    sp += 2;
                }
            }

            layer2_ctx.beginPath();
            layer2_ctx.moveTo(frstX, frstY);
            layer2_ctx.lineTo(curX, curY);
            layer2_ctx.closePath();
            layer2_ctx.strokeStyle = '#000000';
            layer2_ctx.lineWidth = 3;
            layer2_ctx.stroke();

        }
    }
}

//First level functions

function drawCircle() {

    let base_image = new Image();
    base_image.src = 'img/lay2.png';
    base_image.onload = () => layer1_ctx.drawImage(base_image, 400 - 100, 221 - 100, 200, 200);

}

function checkCollision(){
    if (linesPointsArr.length == 2) {
        let x = 0;
        let y = 0;

        normalCoords = [];
        linesPointsArr.forEach(el => {
            var Point = {
                posX: (el.posX - 400),
                posY: - (el.posY - 221)
            }
            normalCoords.push(Point)
        });

        a = (normalCoords[0].posY-normalCoords[1].posY)/(normalCoords[1].posX-normalCoords[0].posX);
        c = (normalCoords[1].posX*normalCoords[0].posY-normalCoords[0].posX*normalCoords[1].posY)/(normalCoords[0].posX-normalCoords[1].posX);
        b = 1;
        radius = 100;

        let dist = (Math.abs(a * x + b * y + c)) / Math.sqrt(a * a + b * b);

        if (radius >= dist && Math.sqrt(normalCoords[0].posX*normalCoords[0].posX + normalCoords[0].posY*normalCoords[0].posY) >= radius
        &&  Math.sqrt(normalCoords[1].posX*normalCoords[1].posX + normalCoords[1].posY*normalCoords[1].posY) >= radius){
            console.log("chetko");
            console.log(Math.abs(100 - dist/radius*100));
            levelSucceeded();
        }
        else{
            levelFailed();
        }
    }
}

//Second level functions

function drawRect() {
    let base_image = new Image();
    base_image.src = 'img/lay3.png';
    base_image.onload = () => layer1_ctx.drawImage(base_image, 400 - 77, 221 - 77, 154, 154);

}

function checkCollision2(){
    if (linesPointsArr.length == 4) {
        normalCoords = [];
        
        let firstCheck = true;

        linesPointsArr.forEach(el => {
            var Point = {
                posX: (el.posX - 400),
                posY: - (el.posY - 221)
            }
            normalCoords.push(Point)
        });
        
        let b1 = 0;
        let b2 = 0;
        let k1 = 0;
        let k2 = 0;

        b1 = (normalCoords[0].posX*normalCoords[1].posY-normalCoords[0].posY*normalCoords[1].posX)/(normalCoords[0].posX-normalCoords[1].posX);
        k1 = normalCoords[0].posY/normalCoords[0].posX - b1*(1/normalCoords[0].posX);

        b2 = (normalCoords[2].posX*normalCoords[3].posY-normalCoords[2].posY*normalCoords[3].posX)/(normalCoords[2].posX-normalCoords[3].posX);
        k2 = normalCoords[2].posY/normalCoords[2].posX - b2*(1/normalCoords[2].posX);

        let innerX = (b2-b1)/(k1-k2);
        let innerY = k2*innerX + b2;

        normalCoords.forEach(element => {
            if ((element.posX <= 75 && element.posY <= 75 && element.posX >= -75 && element.posY >= -75)) {
                firstCheck = false;
            }
        });

        if (innerX <= 75 && innerY <= 75 && innerX >= -75 && innerY >= -75 && firstCheck == true) {
            console.log('chetko')
            levelSucceeded();
        } else {
            levelFailed();
        }
    }
}

//Third level functions

function drawRect2() {
    t1 = 100;
    t2 = 100;

    // layer1_ctx.beginPath();
    // layer1_ctx.moveTo(400, 221-t1);
    // layer1_ctx.lineTo(400+t2, 221);
    // layer1_ctx.closePath();
    // layer1_ctx.stroke();

    // layer1_ctx.beginPath();
    // layer1_ctx.moveTo(400+t2, 221);
    // layer1_ctx.lineTo(400, 221+t1);
    // layer1_ctx.closePath();
    // layer1_ctx.stroke();

    // layer1_ctx.beginPath();
    // layer1_ctx.moveTo(400, 221+t1);
    // layer1_ctx.lineTo(400-t2, 221);
    // layer1_ctx.closePath();
    // layer1_ctx.stroke();

    // layer1_ctx.beginPath();
    // layer1_ctx.moveTo(400-t2, 221);
    // layer1_ctx.lineTo(400, 221-t1);
    // layer1_ctx.closePath();
    // layer1_ctx.stroke();


    let base_image = new Image();
    base_image.src = 'img/lay3_45.png';
    base_image.onload = () => layer1_ctx.drawImage(base_image, 400 - 93, 221 - 96, 188, 188);
}

function checkCollision3(){
    let amountOfInners = 0;
    normalCoords = [];
    let firstCheck = true;

    if (linesPointsArr.length == 8) {

        linesPointsArr.forEach(el => {
            var Point = {
                posX: (el.posX - 400),
                posY: - (el.posY - 221)
            }
            normalCoords.push(Point)
        });
        
        for (let i = 0; i <= 6; i = i+2) {

            for (let j = i + 1; j <= 6; j = j+2) {

                if (checkIfLinesCrossedInRomb(normalCoords[i], normalCoords[i+1], normalCoords[j+1], normalCoords[j+2]))
                    amountOfInners++;
                
            }
            
        }

        normalCoords.forEach(element => {
            if (checkIfPointInRomb(element)) {
                firstCheck = false;
            }
        });

        if (amountOfInners != 4 || firstCheck == false){
            levelFailed();
        }
        else{
            console.log('chetko')
            levelSucceeded();
        }
        
        

    }
}

function checkIfLinesCrossedInRomb(point1, point2, point3, point4) {

    let b1 = 0;
    let b2 = 0;
    let k1 = 0;
    let k2 = 0;
    let innerX = 0;
    let innerY = 0;

    k1 = (point2.posY - point1.posY)/(point2.posX - point1.posX)
    b1 = point1.posY - k1*point1.posX

    k2 = (point4.posY - point3.posY)/(point4.posX - point3.posX)
    b2 = point3.posY - k2*point3.posX

    innerX = (b2-b1)/(k1-k2);
    innerY = k1*innerX + b1;


    if (innerY < (innerX + 100) && innerY > (- innerX - 100) && innerY < (-innerX  + 100) && innerY > (innerX  - 100))
        return true;
    else
        return false;

}

function checkIfPointInRomb(point) {
    if (point.posY < (point.posX + 100) && point.posY > (- point.posX - 100) && point.posY < (-point.posX  + 100) && point.posY > (point.posX  - 100))
        return true;
    else
        return false;
}

//Fourth level functions

function drawRect3() {
    let indent = 70;
    let squareSize = 80;

    // layer1_ctx.beginPath();
    // layer1_ctx.rect(400 - indent - squareSize/2, 221 - indent - squareSize/2, squareSize, squareSize);
    // layer1_ctx.stroke();

    // layer1_ctx.beginPath();
    // layer1_ctx.rect(400 - indent - squareSize/2, 221 + indent - squareSize/2, squareSize, squareSize);
    // layer1_ctx.stroke();

    // layer1_ctx.beginPath();
    // layer1_ctx.rect(400 + indent - squareSize/2, 221 + indent - squareSize/2, squareSize, squareSize);
    // layer1_ctx.stroke();

    // layer1_ctx.beginPath();
    // layer1_ctx.rect(400 + indent - squareSize/2, 221 - indent - squareSize/2, squareSize, squareSize);
    // layer1_ctx.stroke();

    let base_image = new Image();
    base_image.src = 'img/lay4.png';
    base_image.onload = () => layer1_ctx.drawImage(base_image, 400 - indent - squareSize/2 - 2, 221 - indent - squareSize/2 - 2, squareSize + 4, squareSize + 4);

    let base_image2 = new Image();
    base_image2.src = 'img/lay4.png';
    base_image2.onload = () => layer1_ctx.drawImage(base_image2, 400 - indent - squareSize/2 - 2, 221 + indent - squareSize/2 - 2, squareSize + 4, squareSize + 4);

    let base_image3 = new Image();
    base_image3.src = 'img/lay4.png';
    base_image3.onload = () => layer1_ctx.drawImage(base_image3, 400 + indent - squareSize/2 - 2, 221 + indent - squareSize/2 - 2, squareSize + 4, squareSize + 4);

    let base_image4 = new Image();
    base_image4.src = 'img/lay4.png';
    base_image4.onload = () => layer1_ctx.drawImage(base_image4, 400 + indent - squareSize/2 - 2, 221 - indent - squareSize/2 - 2, squareSize + 4, squareSize + 4);
}   

function checkCollision4()
{
    let linesCrossedPoints = [];
    let linesAreInSquares = [0, 0, 0, 0];
    let firstCheck = true;

    if (linesPointsArr.length == 8) {
        normalCoords = [];

        linesPointsArr.forEach(el => {
            var Point = {
                posX: (el.posX - 400),
                posY: - (el.posY - 221)
            }
            normalCoords.push(Point)
        });
        
        for (let i = 0; i <= 6; i = i+2) {

            for (let j = i + 1; j <= 6; j = j+2) {
                linesCrossedPoints.push(getCrossingPoint(normalCoords[i], normalCoords[i+1], normalCoords[j+1], normalCoords[j+2]))
            }
            
        }

        for (let i = 0; i < linesCrossedPoints.length; i++) {
            if (linesCrossedPoints[i].posX >= -110 && linesCrossedPoints[i].posY >= 30 && linesCrossedPoints[i].posX <= -30 && linesCrossedPoints[i].posY <= 110) {
                linesAreInSquares[0]++;
                linesCrossedPoints.splice(i, 1)
            }
        }
        
        for (let i = 0; i < linesCrossedPoints.length; i++) {
            if (linesCrossedPoints[i].posX >= 30 && linesCrossedPoints[i].posY >= 30 && linesCrossedPoints[i].posX <= 110 && linesCrossedPoints[i].posY <= 110) {
                linesAreInSquares[1]++;
                linesCrossedPoints.splice(i, 1)
            }
        }
        
        for (let i = 0; i < linesCrossedPoints.length; i++) {
            if (linesCrossedPoints[i].posX >= 30 && linesCrossedPoints[i].posY >= -110 && linesCrossedPoints[i].posX <= 110 && linesCrossedPoints[i].posY <= -30) {
                linesAreInSquares[2]++;
                linesCrossedPoints.splice(i, 1)
            }
        }
        
        for (let i = 0; i < linesCrossedPoints.length; i++) {
            if (linesCrossedPoints[i].posX >= -110 && linesCrossedPoints[i].posY >= -110 && linesCrossedPoints[i].posX <= -30 && linesCrossedPoints[i].posY <= -30) {
                linesAreInSquares[3]++;
                linesCrossedPoints.splice(i, 1)
            }
        }

        normalCoords.forEach(element => {
            if ((element.posX >= -110 && element.posY >= 30 && element.posX <= -30 && element.posY <= 110) || 
                (element.posX >= 30 && element.posY >= 30 && element.posX <= 110 && element.posY <= 110) || 
                (element.posX >= 30 && element.posY >= -110 && element.posX <= 110 && element.posY <= -30) || 
                (element.posX >= -110 && element.posY >= -110 && element.posX <= -30 && element.posY <= -30) ||
                (element.posX >= -110 && element.posY >= -110 && element.posX <= 110 && element.posY <= 110) 
            ) {
                firstCheck = false
            }
        });

        if (linesAreInSquares[0] == 1 && linesAreInSquares[1] == 1 && linesAreInSquares[2] == 1 && linesAreInSquares[3] == 1 && firstCheck == true) {
            console.log('chetko')
            levelSucceeded();
        } else{
            levelFailed();
            console.log(linesCrossedPoints)
        }
    }
}

function getCrossingPoint(point1, point2, point3, point4) {

let b1 = 0;
let b2 = 0;
let k1 = 0;
let k2 = 0;
let innerX = 0;
let innerY = 0;

k1 = (point2.posY - point1.posY)/(point2.posX - point1.posX)
b1 = point1.posY - k1*point1.posX

k2 = (point4.posY - point3.posY)/(point4.posX - point3.posX)
b2 = point3.posY - k2*point3.posX

innerX = (b2-b1)/(k1-k2);
innerY = k1*innerX + b1;

var Point = {
    posX: innerX,
    posY: innerY
}

return Point;
}
