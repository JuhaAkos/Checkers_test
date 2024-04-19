var whiteplayerturn = false;
var blacktiles = 12;
var whitetiles = 12;
var mandatoryHit = false;

var activeTile = "none";

const tileIDs = 
[
"11", "13", "15", "17", 
"22", "24", "26", "28",
"31", "33", "35", "37", 
"42", "44", "46", "48",
"51", "53", "55", "57", 
"62", "64", "66", "68",
"71", "73", "75", "77", 
"82", "84", "86", "88",
];

function chekForQueens(){
    let queenFound = false;
    for (let i=0; i<4;i++){
        if (document.getElementById(tileIDs[i]).src.endsWith("/Btile.png") ||
        document.getElementById(tileIDs[i]).src.endsWith("/Bselect.png") ) {
            document.getElementById(tileIDs[i]).src="imageref/BQtile.png";
            queenFound = true;
        }
    }
    for (let i=28; i<32;i++){
        if (document.getElementById(tileIDs[i]).src.endsWith("/Wtile.png") ||
        document.getElementById(tileIDs[i]).src.endsWith("/Wselect.png") ) {
            document.getElementById(tileIDs[i]).src="imageref/WQtile.png";
            queenFound = true;
        }
    }
    return queenFound;
}

function checkForWinner(){
    
}

function press(a) { 
    console.log("\nTurn:")
      
    selectTile(a);    
    
    refreshDisplayData();        
    callShowMandatoryHit()
}

function selectTile(a){    
    //if clicked on empty red tile
    if (document.getElementById(a).src.endsWith("/red.png") && !mandatoryHit){
        deselectActiveTile(activeTile); 
        activeTile = "none";       
    }

    //if clicked on occupied tile
    if (matchTileAndPlayer(a) && !mandatoryHit){
        //todo for queens
        deselectActiveTile(activeTile);
        selectActiveTile(a);
        //ÚJJJJJJJJJJJJJ
        callDestinationDetection()
    }

    //jump to empty possible tile
    if (document.getElementById(a).src.endsWith("/bred.png")) {        
        hopOver(a);
        //ÚJJJJJJJ
        chekForQueens()
        switchTurn();
    }

    //select from mandatory options
    if (document.getElementById(a).src.endsWith("MWselect.png") || document.getElementById(a).src.endsWith("MWQselect.png") 
        || document.getElementById(a).src.endsWith("MBselect.png") || document.getElementById(a).src.endsWith("MBQselect.png")) { 
        grayToRed();
        changeMandatoryBack();
        selectActiveTile(a);
        //ÚJJJJ
        callMandatoryDetection();    
    }

    //jump over other tile
    if (document.getElementById(a).src.endsWith("/rred.png") && activeTile!="none") {
        hitTile(a);
        callShowMandatoryHit()
        //ÚJJJJJJJJ
        if (chekForQueens() || !mandatoryHit) {
            switchTurn();
        }
    }
    
}

function grayToRed(){
    for (let i = 0; i < tileIDs.length; i++) { 
        if (document.getElementById(tileIDs[i]).src.endsWith("gred.png")) {
            document.getElementById(tileIDs[i]).src="imageref/rred.png";
        }
    }
}

function callMandatoryDetection(){
    if (document.getElementById(activeTile).src.endsWith("WQselect.png") || document.getElementById(activeTile).src.endsWith("BQselect.png")) {
        console.log("QUEEN - MANDA");
        showPossibleMandatory(-1)
        showPossibleMandatory(1)
    } else if (document.getElementById(activeTile).src.endsWith("Wselect.png")) {
        showPossibleMandatory(1)
    }
    else if (document.getElementById(activeTile).src.endsWith("Bselect.png")) {
        showPossibleMandatory(-1)
    }
}

function showPossibleMandatory(upOrDown){    
    var jumpLeft = (Number(activeTile[0])+upOrDown*2).toString() + ((Number(activeTile[1])-2).toString());
    var jumpRight = (Number(activeTile[0])+upOrDown*2).toString() + ((Number(activeTile[1])+2).toString());

    for (let i = 0; i < tileIDs.length; i++) { 
        if (document.getElementById(tileIDs[i]).src.endsWith("rred.png") && tileIDs[i]!=jumpLeft && tileIDs[i]!=jumpRight) {
            document.getElementById(tileIDs[i]).src="imageref/gred.png";
        }
    }
}

function changeMandatoryBack(){
    for (let i = 0; i < tileIDs.length; i++) { 
        if (document.getElementById(tileIDs[i]).src.endsWith("Wselect.png")) {
            document.getElementById((tileIDs[i])).src="imageref/MWselect.png";
        } else if (document.getElementById(tileIDs[i]).src.endsWith("WQselect.png")) {
            document.getElementById((tileIDs[i])).src="imageref/MWQselect.png";
        } else if (document.getElementById(tileIDs[i]).src.endsWith("Bselect.png")) {
            document.getElementById((tileIDs[i])).src="imageref/MBselect.png";
        } else if (document.getElementById(tileIDs[i]).src.endsWith("BQselect.png")) {
            document.getElementById((tileIDs[i])).src="imageref/MBQselect.png";
        } 
    }
}

function showMandatoryHit(tileID, upOrDown){
    leftNeighbour = (Number(tileID[0])+upOrDown).toString() + ((Number(tileID[1])-1).toString());
    rightNeighbour = (Number(tileID[0])+upOrDown).toString() + ((Number(tileID[1])+1).toString());
    jumpLeft = (Number(tileID[0])+upOrDown*2).toString() + ((Number(tileID[1])-2).toString());
    jumpRight = (Number(tileID[0])+upOrDown*2).toString() + ((Number(tileID[1])+2).toString());           

    if (leftNeighbour[1] > 1 && leftNeighbour[0] > 1 && leftNeighbour[0] < 8 && isOccupiedByOpponent(leftNeighbour)) {                
        if (!isOccupiedByOpponent(jumpLeft) && !isOccupiedByFriend(jumpLeft)) {
            document.getElementById((jumpLeft)).src="imageref/rred.png";
            selectActiveMandatoryTile(tileID);
            mandatoryHit = true;
        }
    }
    if (rightNeighbour[1] < 8 && rightNeighbour[0] > 1 && rightNeighbour[0] < 8 && isOccupiedByOpponent(rightNeighbour)) {
        if (!isOccupiedByOpponent(jumpRight) && !isOccupiedByFriend(jumpRight)) {                    
            document.getElementById((jumpRight)).src="imageref/rred.png";
            selectActiveMandatoryTile(tileID);
            mandatoryHit = true;
        }
    }
}


function callShowMandatoryHit(){
    mandatoryHit = false;
    for (let i = 0; i < tileIDs.length; i++) { 
        if (matchTileAndPlayer(tileIDs[i]) 
        && (document.getElementById(tileIDs[i]).src.endsWith("Wselect.png") || document.getElementById(tileIDs[i]).src.endsWith("Wtile.png"))) {
            showMandatoryHit(tileIDs[i], 1)
        }
        else if (matchTileAndPlayer(tileIDs[i]) 
        && (document.getElementById(tileIDs[i]).src.endsWith("Bselect.png") || document.getElementById(tileIDs[i]).src.endsWith("Btile.png"))) {
            showMandatoryHit(tileIDs[i], -1)
        } else if (matchTileAndPlayer(tileIDs[i]) 
        && (document.getElementById(tileIDs[i]).src.endsWith("BQselect.png") || document.getElementById(tileIDs[i]).src.endsWith("BQtile.png")
        || document.getElementById(tileIDs[i]).src.endsWith("WQselect.png") || document.getElementById(tileIDs[i]).src.endsWith("WQtile.png"))) {
            showMandatoryHit(tileIDs[i], 1)
            showMandatoryHit(tileIDs[i], -1)
        }
    }
}

function hitTile(a) {
    enemyTile = 
        ((Number(activeTile[0])+Number(a[0]))/2).toString()+
        ((Number(activeTile[1])+Number(a[1]))/2).toString();

    if (whiteplayerturn) {
        blacktiles -= 1;
    } else {
        whitetiles -= 1;
    }

    document.getElementById((enemyTile)).src="imageref/red.png"

    hopOver(a);
    deselectAll();
}

function hopOver(destTile) {
    deselectActiveTile(activeTile);
    document.getElementById((destTile)).src=document.getElementById((activeTile)).src;
    document.getElementById((activeTile)).src="imageref/red.png";    
    activeTile = "none";
}

function callDestinationDetection(){
    if (document.getElementById(activeTile).src.endsWith("WQselect.png") || document.getElementById(activeTile).src.endsWith("BQselect.png")) {
        console.log("QUEEN");
        showDestination(-1)
        showDestination(1)
    } else if (document.getElementById(activeTile).src.endsWith("Wselect.png")) {
        showDestination(1)
    }
    else if (document.getElementById(activeTile).src.endsWith("Bselect.png")) {
        showDestination(-1)
    }
}

//ÚJJJJJJJ
function showDestination(upOrDown){
    if ((Number(activeTile[0])+upOrDown)>0 && (Number(activeTile[0])+upOrDown)<8 && Number(activeTile[1]) > 1) {
        firstID = (Number(activeTile[0])+upOrDown).toString() + ((Number(activeTile[1])-1).toString()); 
        if (document.getElementById(firstID).src.endsWith("/red.png")) {
            document.getElementById((firstID)).src="imageref/bred.png";
        }         
    }

    if ((Number(activeTile[0])+upOrDown)>0 && (Number(activeTile[0])+upOrDown)<8 && Number(activeTile[1]) < 8) { 
        secondID = (Number(activeTile[0])+upOrDown).toString() + ((Number(activeTile[1])+1).toString());  
        if (document.getElementById(secondID).src.endsWith("/red.png")){
            document.getElementById((secondID)).src="imageref/bred.png";
        }
    }
}

function isOccupiedByFriend(destTile){
    if (((document.getElementById(destTile).src.endsWith("/Wtile.png") || document.getElementById(destTile).src.endsWith("/WQtile.png")) && whiteplayerturn) 
        || ((document.getElementById(destTile).src.endsWith("/Btile.png") || document.getElementById(destTile).src.endsWith("/BQtile.png")) && !whiteplayerturn))
    {
        return true;
    }
    return false;

}

function isOccupiedByOpponent(destTile){
    if (((document.getElementById(destTile).src.endsWith("/Wtile.png") || document.getElementById(destTile).src.endsWith("/WQtile.png")) && !whiteplayerturn) 
        || ((document.getElementById(destTile).src.endsWith("/Btile.png") || document.getElementById(destTile).src.endsWith("/BQtile.png")) && whiteplayerturn))
    {
        return true;
    }
    return false;
}

function switchTurn(){
    if (whiteplayerturn) {
        whiteplayerturn = false;
    } else {
        whiteplayerturn = true;
    }
}

function refreshDisplayData() {
    document.getElementById("numOfTiles").innerHTML = "W: " + whitetiles.toString() + " / B: " + blacktiles.toString();

    if (whiteplayerturn) {
        document.getElementById("currentPlayer").innerHTML = "Fehér kör";
    } else {
        document.getElementById("currentPlayer").innerHTML = "Fekete kör";
    }
}

//ÚJJJJJJ
function matchTileAndPlayer(a){
    if ((document.getElementById(a).src.endsWith("Wtile.png") || document.getElementById(a).src.endsWith("WQtile.png")
        || document.getElementById(a).src.endsWith("WQselect.png") || document.getElementById(a).src.endsWith("Wselect.png")) && whiteplayerturn){
        return true;
    } else if ((document.getElementById(a).src.endsWith("Btile.png") || document.getElementById(a).src.endsWith("BQtile.png")
    || document.getElementById(a).src.endsWith("BQselect.png") || document.getElementById(a).src.endsWith("Bselect.png")) && !whiteplayerturn){
        return true;
    }
    return false;
}

function selectActiveTile(a){    
    activeTile = a;
    if (document.getElementById(a).src.endsWith("Wtile.png") || document.getElementById(a).src.endsWith("MWselect.png")) {
        document.getElementById((a)).src="imageref/Wselect.png";
    } else if (document.getElementById(a).src.endsWith("WQtile.png") || document.getElementById(a).src.endsWith("MWQselect.png")) {
        document.getElementById((a)).src="imageref/WQselect.png";
    } else if (document.getElementById(a).src.endsWith("Btile.png") || document.getElementById(a).src.endsWith("MBselect.png")) {
        document.getElementById((a)).src="imageref/Bselect.png";
    } else if (document.getElementById(a).src.endsWith("BQtile.png") || document.getElementById(a).src.endsWith("MBQselect.png")) {
        document.getElementById((a)).src="imageref/BQselect.png";
    }
}

function selectActiveMandatoryTile(a){    
    if (document.getElementById(a).src.endsWith("Wtile.png")) {
        document.getElementById((a)).src="imageref/MWselect.png";
    } else if (document.getElementById(a).src.endsWith("WQtile.png")) {
        document.getElementById((a)).src="imageref/MWQselect.png";
    } else if (document.getElementById(a).src.endsWith("Btile.png")) {
        document.getElementById((a)).src="imageref/MBselect.png";
    } else if (document.getElementById(a).src.endsWith("BQtile.png")) {
        document.getElementById((a)).src="imageref/MBQselect.png";
    }
}

function deselectActiveTile(a){
    if (a!="none"){
        if (document.getElementById(a).src.endsWith("Wselect.png") || document.getElementById(a).src.endsWith("MWselect.png")) {
            document.getElementById((a)).src="imageref/Wtile.png";
        } else if (document.getElementById(a).src.endsWith("WQselect.png") || document.getElementById(a).src.endsWith("MWQselect.png")) {
            document.getElementById((a)).src="imageref/WQtile.png";
        } else if (document.getElementById(a).src.endsWith("Bselect.png") || document.getElementById(a).src.endsWith("MBselect.png")) {
            document.getElementById((a)).src="imageref/Btile.png";
        } else if (document.getElementById(a).src.endsWith("BQselect.png") || document.getElementById(a).src.endsWith("MBQselect.png")) {
            document.getElementById((a)).src="imageref/BQtile.png";
        }        

        //removes blue and red selected tiles too
        for (let i = 0; i < tileIDs.length; i++) { 
            if(document.getElementById(tileIDs[i]).src.endsWith("/bred.png") || document.getElementById(tileIDs[i]).src.endsWith("/rred.png") || document.getElementById(tileIDs[i]).src.endsWith("/gred.png")){
                document.getElementById(tileIDs[i]).src="imageref/red.png";
            }
        } 
    }
}

function deselectAll() {
    for (let i = 0; i < tileIDs.length; i++) { 
        deselectActiveTile(tileIDs[i]);
    }
}