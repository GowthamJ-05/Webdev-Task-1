
const gameBoard = document.querySelector("#gameBoard")
const playerDisplay= document.querySelector("#player")
const InfoDisplay= document.querySelector("#InfoDisplay")
const rotationDiv=document.querySelector('#rotation')

const player1TimerElement = document.querySelector('#timer1 .clock')
const player2TimerElement = document.querySelector('#timer2 .clock')
const resumeButton = document.getElementById('resumeButton')
const pauseButton = document.getElementById('pauseButton')
const resetButton = document.getElementById('resetButton')

let player1Time = 300
let player2Time = 300
let playerGo='white'
let opponentGo='beige'
let interval

const width=8

const startpieces= [
    titan,'','','','','','',canon,
    '','','','',semiRicochet,ricochet,tank,'',
    '','','','','','','','',
    titan,'','','','','','','',
    '','','','','','','','',
    '',tank,'','','',titan,'','',
    '','','','','','','','',
    '',ricochet,'','','',canon,'',ricochet
]
const leftDifficultSquare=[0,8,16,24,32,40,48,56]
const rightDifficultSquare=[7,15,23,31,39,47,55,63]
createBoard = ()=>{
    startpieces.forEach((startPiece,i)=>
    {
        const square=document.createElement('div')
        square.classList.add('square')
        square.setAttribute('square-id',i)
        square.innerHTML=startPiece
        square.firstChild?.setAttribute("draggable", true)
        const row = Math.floor((63-i)/8)+1
        if (row %2 == 0){
            square.classList.add(i%2===0?"red":"black")
        }
        else{
            square.classList.add(i%2===0?"black":"red")
        }

        if(i<=24){
            square.firstChild?.firstChild.classList.add("white")
        }
        else if(i>=25){
            square.firstChild?.firstChild.classList.add("beige")
        }

        gameBoard.append(square)
        makeRotationUnavailable()
        
    })
    playerDisplay.textContent='white'
    playingPaused = true

    let startPositionId
    let draggedElement
    let clickedPiece

    const allSquares = document.querySelectorAll("#gameBoard .square")
    const clockwiseBtn = document.querySelector("#clockwise")
    const anticlockwiseBtn = document.querySelector("#anticlockwise")


    allSquares.forEach((square)=>{
        square.addEventListener("dragstart", dragStart)
        square.addEventListener("dragover",dragOver)
        square.addEventListener("drop", dragDrop)
        if (square.firstChild){
            square.firstChild.addEventListener("click",highlighter)
        }
    })

    clockwiseBtn.addEventListener("click", turnClockwise)
    anticlockwiseBtn.addEventListener("click", turnAnticlockwise)


    resumeButton.addEventListener('click',startTimer)
    pauseButton.addEventListener('click', pauseTimer)
    resetButton.addEventListener('click', resetTimer)

}

createBoard()


function turnClockwise(e) {
   
    computedStyle = window.getComputedStyle(clickedPiece);
    transformValue = computedStyle.getPropertyValue('transform');
    if (transformValue !== 'none') {
        var values = transformValue.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
    }
    var radians = Math.atan2(b, a);
    var angle = radians * (180 / Math.PI);
    rotationAngle=angle.toFixed(0)
    //console.log(rotationAngle)
    clickedPiece.style.transform=`rotate(${Number(rotationAngle)+90}deg)`
    changePlayer()
    clearHighlights()
    makeRotationUnavailable()
    return
   
}
function turnAnticlockwise(e){
    computedStyle = window.getComputedStyle(clickedPiece);
    transformValue = computedStyle.getPropertyValue('transform');
    if (transformValue !== 'none') {
        var values = transformValue.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
    }
    var radians = Math.atan2(b, a);
    var angle = radians * (180 / Math.PI);
    rotationAngle=angle.toFixed(0)
    console.log(rotationAngle)
    clickedPiece.style.transform=`rotate(${Number(rotationAngle)-90}deg)`
    changePlayer()
    clearHighlights()
    makeRotationUnavailable()
    return
}

function dragStart(e){
    startPositionId=e.target.parentNode.getAttribute("square-id")
    draggedElement=e.target
    if (e.target.firstChild){
        highlighter(e)
    }
    if (playingPaused==true && draggedElement.firstChild.classList.contains(playerGo)){
        startTimer()
        playingPaused=false
        if (playerGo === 'white'){
            player1TimerElement.classList.add('active'); 
            player2TimerElement.classList.remove('active');
        }
        else{

            player1TimerElement.classList.remove('active');
            player2TimerElement.classList.add('active');
        }
    }
}

function dragOver(e){
    e.preventDefault()
}

function dragDrop(e){
    e.stopPropagation()
    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const opponentGo = playerGo === 'white'? 'beige':'white'
    valid=checkIfValid(e.target)
    if (correctGo){
        if(valid){
            e.target.append(draggedElement)
            changePlayer()
            clearHighlights()
            return
        }
    }
}

function checkIfValid(target){

    targetId= Number( target.getAttribute('square-id'))
    startId=Number(startPositionId)
    piece= draggedElement.id
    if(piece==="titan" || piece==="tank"){

        if(!leftDifficultSquare.includes(startId) && !rightDifficultSquare.includes(startId)){
            if (
                startId+width === targetId && !document.querySelector(`[square-id = "${startId+width}"]`).firstChild || 
                startId-width === targetId && !document.querySelector(`[square-id = "${startId-width}"]`).firstChild ||
                startId+width+1 === targetId && !document.querySelector(`[square-id = "${startId+width+1}"]`).firstChild ||
                startId+width-1 === targetId && !document.querySelector(`[square-id = "${startId+width-1}"]`).firstChild ||
                startId-width-1 === targetId && !document.querySelector(`[square-id = "${startId-width-1}"]`).firstChild ||
                startId-width+1 === targetId && !document.querySelector(`[square-id = "${startId-width+1}"]`).firstChild ||
                startId+1 === targetId && !document.querySelector(`[square-id = "${startId+1}"]`).firstChild ||
                startId-1 === targetId && !document.querySelector(`[square-id = "${startId-1}"]`).firstChild
            ){

                return true
            }

        }
        else if(leftDifficultSquare.includes(startId) ){
            if (
                startId+width === targetId && !document.querySelector(`[square-id = "${startId+width}"]`).firstChild || 
                startId-width === targetId && !document.querySelector(`[square-id = "${startId-width}"]`).firstChild ||
                startId+width+1 === targetId && !document.querySelector(`[square-id = "${startId+width+1}"]`).firstChild ||
                startId-width+1 === targetId && !document.querySelector(`[square-id = "${startId-width+1}"]`).firstChild ||
                startId+1 === targetId && !document.querySelector(`[square-id = "${startId+1}"]`).firstChild
            ){
                return true
            }
        }
        else if(rightDifficultSquare.includes(startId) ){
            if (
                startId+width === targetId && !document.querySelector(`[square-id = "${startId+width}"]`).firstChild || 
                startId-width === targetId && !document.querySelector(`[square-id = "${startId-width}"]`).firstChild ||
                startId+width-1 === targetId && !document.querySelector(`[square-id = "${startId+width-1}"]`).firstChild ||
                startId-width-1 === targetId && !document.querySelector(`[square-id = "${startId-width-1}"]`).firstChild ||
                startId-1 === targetId && !document.querySelector(`[square-id = "${startId-1}"]`).firstChild
            ){
                return true
            }
        }
    }

    if(piece==="ricochet" || piece==="semiRicochet"){
        if(!leftDifficultSquare.includes(startId) && !rightDifficultSquare.includes(startId)){
            if (
                startId+width === targetId && !document.querySelector(`[square-id = "${startId+width}"]`).firstChild || 
                startId-width === targetId && !document.querySelector(`[square-id = "${startId-width}"]`).firstChild ||
                startId+width+1 === targetId && !document.querySelector(`[square-id = "${startId+width+1}"]`).firstChild ||
                startId+width-1 === targetId && !document.querySelector(`[square-id = "${startId+width-1}"]`).firstChild ||
                startId-width-1 === targetId && !document.querySelector(`[square-id = "${startId-width-1}"]`).firstChild ||
                startId-width+1 === targetId && !document.querySelector(`[square-id = "${startId-width+1}"]`).firstChild ||
                startId+1 === targetId && !document.querySelector(`[square-id = "${startId+1}"]`).firstChild ||
                startId-1 === targetId && !document.querySelector(`[square-id = "${startId-1}"]`).firstChild 

            ){
                return true
            }

        }
        else if(leftDifficultSquare.includes(startId) ){
            if (
                startId+width === targetId && !document.querySelector(`[square-id = "${startId+width}"]`).firstChild || 
                startId-width === targetId && !document.querySelector(`[square-id = "${startId-width}"]`).firstChild ||
                startId+width+1 === targetId && !document.querySelector(`[square-id = "${ startId+width+1}"]`).firstChild ||
                startId-width+1 === targetId && !document.querySelector(`[square-id = "${startId-width+1}"]`).firstChild ||
                startId+1 === targetId && !document.querySelector(`[square-id = "${startId+1}"]`).firstChild
            ){
                return true
            }
        }
        else if(rightDifficultSquare.includes(startId) ){
            if (
                startId+width === targetId && !document.querySelector(`[square-id = "${startId+width}"]`).firstChild || 
                startId-width === targetId && !document.querySelector(`[square-id = "${startId-width}"]`).firstChild ||
                startId+width-1 === targetId && !document.querySelector(`[square-id = "${startId+width-1}"]`).firstChild ||
                startId-width-1 === targetId && !document.querySelector(`[square-id = "${startId-width-1}"]`).firstChild ||
                startId-1 === targetId && !document.querySelector(`[square-id = "${startId-1}"]`).firstChild
                
            ){
                return true
            }
        }

    }
    if (pieceId==="canon"){
        if(!leftDifficultSquare.includes(startId) && !rightDifficultSquare.includes(startId)){
            if (
                startId+1 === targetId && !document.querySelector(`[square-id = "${startId+1}"]`).firstChild ||
                startId-1 === targetId && !document.querySelector(`[square-id = "${startId-1}"]`).firstChild 
            ){
                return true
            }
        }
        else if(leftDifficultSquare.includes(startId) ){
            if (
                startId+1 === targetId && !document.querySelector(`[square-id = "${startId+1}"]`).firstChild
            ){
                return true
            }
        }
        else if(rightDifficultSquare.includes(startId) ){
            if (
                startId-1 === targetId && !document.querySelector(`[square-id = "${startId-1}"]`).firstChild
            ){
                return true
            }
        }
    }
}


function highlighter (e){
    if(e.type === 'click'){
        e.stopPropagation();
    }
    clickedPiece=e.target
    pieceId=e.target.id
    clickedPieceId=Number(e.target.parentNode.getAttribute("square-id"))
    clearHighlights()
    if (clickedPiece.firstChild.classList.contains(playerGo)){
        if (pieceId==="titan"||pieceId==="tank"){
            highlightArray=[clickedPieceId+width,clickedPieceId-width,clickedPieceId+width+1,clickedPieceId+width-1,clickedPieceId-width+1,clickedPieceId-width-1,clickedPieceId+1,clickedPieceId-1]
            leftHighlightArray=[clickedPieceId+width+1,clickedPieceId-width+1,clickedPieceId+1,clickedPieceId+width,clickedPieceId-width]
            rightHighlightArray=[clickedPieceId+width-1,clickedPieceId-width-1,clickedPieceId-1,clickedPieceId+width,clickedPieceId-width]
            
            for( let i of highlightArray){
                if (!leftDifficultSquare.includes(clickedPieceId)&&!rightDifficultSquare.includes(clickedPieceId)){
                    highlightSquare=document.querySelector(`[square-id="${i}"]`)
                    if (highlightSquare && !highlightSquare.firstChild){
                        highlightSquare.classList.add("highlight")
            
                    }
                }
                else if(leftDifficultSquare.includes(clickedPieceId)){
                    if (leftHighlightArray.includes(i)){
                        highlightSquare=document.querySelector(`[square-id="${i}"]`)
                        if (highlightSquare && !highlightSquare.firstChild){
                            highlightSquare.classList.add("highlight")
                        }
                    }
                }
                else if(rightDifficultSquare.includes(clickedPieceId)){
                    if (rightHighlightArray.includes(i)){
                        highlightSquare=document.querySelector(`[square-id="${i}"]`)
                        if (highlightSquare && !highlightSquare.firstChild){
                            highlightSquare.classList.add("highlight")
                        }
                    }
                }
    
            }
        }
        else if (pieceId==="ricochet"||pieceId === "semiRicochet"){
            highlightArray=[clickedPieceId+width,clickedPieceId-width,clickedPieceId+width+1,clickedPieceId+width-1,clickedPieceId-width+1,clickedPieceId-width-1,clickedPieceId+1,clickedPieceId-1]
            leftHighlightArray=[clickedPieceId+width+1,clickedPieceId-width+1,clickedPieceId+1,clickedPieceId+width,clickedPieceId-width]
            rightHighlightArray=[clickedPieceId+width-1,clickedPieceId-width-1,clickedPieceId-1,clickedPieceId+width,clickedPieceId-width]
            
            for( let i of highlightArray){
                if (!leftDifficultSquare.includes(clickedPieceId)&&!rightDifficultSquare.includes(clickedPieceId)){
                    highlightSquare=document.querySelector(`[square-id="${i}"]`)
                    if (highlightSquare && !highlightSquare.firstChild){
                        highlightSquare.classList.add("highlight")
                        makeRotationAvailable()
                    }
                }
                else if(leftDifficultSquare.includes(clickedPieceId)){
                    if (leftHighlightArray.includes(i)){
                        highlightSquare=document.querySelector(`[square-id="${i}"]`)
                        if (highlightSquare && !highlightSquare.firstChild){
                            highlightSquare.classList.add("highlight")
                            makeRotationAvailable()
                        }
                    }
                }
                else if(rightDifficultSquare.includes(clickedPieceId)){
                    if (rightHighlightArray.includes(i)){
                        highlightSquare=document.querySelector(`[square-id="${i}"]`)
                        if (highlightSquare && !highlightSquare.firstChild){
                            highlightSquare.classList.add("highlight")
                            makeRotationAvailable()
                        }
                    }
                }
    
            }
        } 
        else if (pieceId==="canon"){   
            highlightArray=[clickedPieceId+1,clickedPieceId-1]
            leftHighlightArray=[clickedPieceId+1]
            rightHighlightArray=[clickedPieceId-1]
            for( let i of highlightArray){
                if (!leftDifficultSquare.includes(clickedPieceId)&&!rightDifficultSquare.includes(clickedPieceId)){
                    highlightSquare=document.querySelector(`[square-id="${i}"]`)
                    if (highlightSquare && !highlightSquare.firstChild){
                        highlightSquare.classList.add("highlight")
    
                    }
                }
                else if(leftDifficultSquare.includes(clickedPieceId)){
                    if (leftHighlightArray.includes(i)){
                        highlightSquare=document.querySelector(`[square-id="${i}"]`)
                        if (highlightSquare && !highlightSquare.firstChild){
                            highlightSquare.classList.add("highlight")
                        }
                    }
                }
                else if(rightDifficultSquare.includes(clickedPieceId)){
                    if (rightHighlightArray.includes(i)){
                        highlightSquare=document.querySelector(`[square-id="${i}"]`)
                        if (highlightSquare && !highlightSquare.firstChild){
                            highlightSquare.classList.add("highlight")
    
                        }
                    }
                }
    
            }
    
        }
    
    }
    if (playingPaused==true && clickedPiece.firstChild.classList.contains(playerGo)){
        startTimer()
        playingPaused=false
        if (playerGo === 'white'){
            player1TimerElement.classList.add('active'); 
            player2TimerElement.classList.remove('active');
        }
        else{
            player1TimerElement.classList.remove('active');
            player2TimerElement.classList.add('active');
        }
    }
    
}

function clearHighlights() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        if(square.classList.contains("highlight")){
            square.classList.remove('highlight');
        }
    });
    makeRotationUnavailable()
}

document.addEventListener('click',clearHighlights)


function makeRotationAvailable(){
    rotationDiv.classList.remove("hidden")
}

function  makeRotationUnavailable(){
    rotationDiv.classList.add("hidden")
}


async function changePlayer(){
    if (playerGo === 'white')
        {
            await shootCanonBullets()
            reverseIds()
            playerGo='beige'
            opponentGo='white'
            playerDisplay.textContent='beige'
            player1TimerElement.classList.remove('active');
            player2TimerElement.classList.add('active');
        }
    else
    {   
        await shootCanonBullets()
        reverseIds()
        playerGo='white'
        opponentGo='beige'
        playerDisplay.textContent='white'
        player1TimerElement.classList.add('active');
        player2TimerElement.classList.remove('active');
    }
}


function reverseIds(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square) =>{
        oldSquareId=square.getAttribute('square-id')
        square.setAttribute('square-id', (width*width-1)-oldSquareId)
    })
}


function formatTime (time){
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function updateTimerDisplay() {
    player1TimerElement.textContent = formatTime(player1Time);
    player2TimerElement.textContent = formatTime(player2Time);
}


function startTimer(){

    clearInterval(interval)
    interval = setInterval(() => {
        if (playerGo === 'white') {
            player1Time--
            if (player1Time <= 0) {
                clearInterval(interval)
                alert('beige wins!')
            }
        } else {
            player2Time--
            if (player2Time <= 0) {
                clearInterval(interval)
                alert('white wins!')
            }
        }
        updateTimerDisplay()
    }, 1000)
}


function pauseTimer(){
    clearInterval(interval)
    playingPaused = true
}

function resetTimer(){
    clearInterval(interval)
    player1Time = 300
    player2Time = 300
    playerGo="white"
    updateTimerDisplay()
    player1TimerElement.classList.add('active')
    player2TimerElement.classList.remove('active')
    destroyBoard()
    createBoard()
}


function destroyBoard(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square) =>{
        square.remove()
    })
}

//add shootCannonBullets before ReverseId
bulletMovement={axis:'column',parity:'down'}
// function shootCanonBullets(){

//     return new Promise((resolve)=>{
//         canonElement=document.querySelector(playerGo==="white"?"div#canon svg.white":"div#canon svg.beige")
//         presentSquare=canonElement.parentNode
//         presentSquareId=presentSquare.getAttribute("square-id")

//         row=0
//         col=Number(presentSquareId)
//         //initiating the first target square
//         deltaRow=1
//         deltaCol=0
//         targetRow=row+deltaRow
//         targetCol=col+deltaCol
//         targetSquareId=targetRow*width+targetCol
//         targetSquare=document.querySelector(`"[square-id=${targetSquareId}]"`)
//         count=0
        
//         setInterval(()=>{
//             if (count==0){
//                 bulletDiv=document.createElement("div")
//                 bulletDiv.classList.add("bullet")
//                 bulletDiv.innerHTML=bullet
//                 bulletDiv.firstChild.firstChild.classList.add(playerGo)
//                 targetSquare.append(bullet)

//                 if (targetSquare.childElementCount<2){
//                     deltaRow=1
//                     deltaCol=0
//                 }
//                 else{
//                     piece=targetSquare.querySelector(".pieces")
//                     pieceId=piece.id
//                     if(pieceId=="titan"){
                        
//                     }
//                 }
//             }
//             else{



//                 targetSquare = document.querySelector("")
//                 bulletDiv=document.createElement("div")
//                 bulletDiv.classList.add("bullet")
//                 bulletDiv.innerHTML=bullet
//                 targetSquare.append(bullet)
//             }

            
//         },500)

//     })
    
// }

function endGame(player){
    if (player=='white'){
        alert('white has lost and beige has won!')
        triggerClickEvent()
        
    }
    else {
        alert('beige has lost and white has won!')
        triggerClickEvent()
    }
    
}


function triggerClickEvent() {
    const event = new Event('click');
    pauseButton.dispatchEvent(event);
}


return new Promise( async (resolve, reject) =>{
        const canonElement = document.querySelectorAll(playerGo === "white" ? "#canon svg.white" : '#canon svg.beige')

        canonElement.forEach(element => {
        square = element.parentElement.parentElement

        r = 0
        c = Number(square.getAttribute("square-id"))

        deltaRow = 1
        deltaCol = 0

        const interval = setInterval(() => {

            let targetRow = r + deltaRow
            let targetCol = c + deltaCol
            let previousSquareId=r*width+c
            let targetSquareId = targetRow*width + targetCol
            var bulletDiv



            if (targetSquareId<0 || targetSquareId>63) {
                bulletDiv=document.querySelector(".bullet")
                bulletDiv?.remove();
                resolve()
                clearInterval(interval);
                
            }

            const targetSquare = document.querySelector(`[square-id="${targetSquareId}"]`)

            const previousSquare = document.querySelector(`[square-id="${previousSquareId}"]`)

            const previousBullet = previousSquare?.querySelector('.bullet');
            if (previousBullet) {
                previousBullet.remove()
            }
            bulletDiv = document.createElement('div')
            bulletDiv.innerHTML=bullet
            bulletDiv.classList.add('bullet')
            bulletDiv.firstChild.firstChild.classList.add(playerGo)
            if (targetSquare){
               
                if (targetSquare.childElementCount > 1) {

                    const piece = targetSquare.querySelector('.pieces')
                    const pieceId=piece.id
                    const pieceOfWhiteColor=piece.firstChild.classList.contains('white')
                    if (pieceId=='titan') {
                        pieceOfWhiteColor?endGame("white"):endGame("beige")
                        clearInterval(interval)
                        return
                    }

                    if (pieceId=='ricochet') {
                        computedStyle = window.getComputedStyle(piece);
                        transformValue = computedStyle.getPropertyValue('transform');
                        if (transformValue !== 'none') {
                            var values = transformValue.split('(')[1].split(')')[0].split(',');
                            var a = values[0];
                            var b = values[1];
                        }
                        var radians = Math.atan2(b, a);
                        var angle = radians * (180 / Math.PI);
                        ricoRotation=angle.toFixed(0)
                        console.log(ricoRotation)
                        if ((ricoRotation === -150 || ricoRotation === 30) && bulletMovement==='column'){
                            console.log(600)
                            bulletMovement='row'
                            deltaRow=0
                            deltaCol=1
                        }
                        else if((ricoRotation === -150 || ricoRotation ===30) && bulletMovement ==='row'){
                            bulletMovement='column'
                            deltaRow=1
                            deltaCol=0
                        }
                        else if((ricoRotation === 120 || ricoRotation === -60) && bulletMovement==='column'){
                            bulletMovement='row'
                            
                            deltaRow=0
                            deltaCol=-1
                        }
                        else if((ricoRotation === 120 || ricoRotation === -60) && bulletMovement==='row'){
                            bulletMovement='column'
                            
                            deltaRow=-1
                            deltaCol=0
                        }
                        r = targetRow
                        c = targetCol
                        
                    }
                if (pieceId='semiRicochet') {
                    count++;
                    const semiRotation = parseInt(semi.dataset.rotation) || 0;
                    const deflection = deflectBullet('semi', semiRotation, color, count, targetRow, targetCol, bullet, interval, deltaRow, deltaCol);
                    deltaRow = deflection.newDeltaRow;
                    deltaCol = deflection.newDeltaCol;
                    rowIndex = targetRow;
                    colIndex = targetCol;
                    return;
                }
    
                    if (pieceId=='tank') {
                        bulletDiv.remove();
                        clearInterval(interval);
                        resolve()
                    }
                    

                    bulletDiv.remove();
                    clearInterval(interval);
                    resolve()

                }
                targetSquare.append(bulletDiv)
                
            }
            r = targetRow;
            c = targetCol;
        },500)
    })

    })