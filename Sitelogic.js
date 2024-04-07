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

function press(a) { 
    console.log("Turn:")
    //showMandatoryHit(); 
      
    selectTile(a);    
    
    
    //mandatoryHit = false;
    refreshDisplayData();     
    //plus check for queen     
    showMandatoryHit();   
    if (mandatoryHit){
        console.log("This turn has mandatory!");
    } else {
        console.log("This turn has NO mandatory!");
    }   
}

function selectTile(a){    
    //if clicked on empty red tile
    if (document.getElementById(a).src.endsWith("/red.png") && !mandatoryHit){
        deselectActiveTile(activeTile); 
        activeTile = "none";       
    }

    //if clicked on occupied tile
    if (matchTileAndPlayer(a) && !mandatoryHit){
        deselectActiveTile(activeTile);
        selectActiveTile(a);
        showDestination();
    }

    //jump to empty possible tile
    if (document.getElementById(a).src.endsWith("/bred.png")) {        
        hopOver(a);
        switchTurn();
    }

    //select from mandatory options
    if (document.getElementById(a).src.endsWith("MWselect.png") || document.getElementById(a).src.endsWith("MWQselect.png") 
        || document.getElementById(a).src.endsWith("MBselect.png") || document.getElementById(a).src.endsWith("MBQselect.png")) { 
        grayToRed();
        changeMandatoryBack();
        selectActiveTile(a);
        showPossibleMandatory();       
    }

    //jump over other tile
    if (document.getElementById(a).src.endsWith("/rred.png") && activeTile!="none") {
        hitTile(a);
        showMandatoryHit();
        if (!mandatoryHit) {
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

function showPossibleMandatory(){    
    var upOrDown = 1
    if (!whiteplayerturn) {
        upOrDown = -1;
    }

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


function showMandatoryHit(){
    mandatoryHit = false
    var upOrDown = 1
    if (!whiteplayerturn) {
        upOrDown = -1;
    }

    leftNeighbour = 0;
    rightneigbour = 0;
    jumpLeft = 0;
    jumpRight = 0;

    for (let i = 0; i < tileIDs.length; i++) { 
        if (matchTileAndPlayer(tileIDs[i])) {
            leftNeighbour = (Number(tileIDs[i][0])+upOrDown).toString() + ((Number(tileIDs[i][1])-1).toString());
            rightNeighbour = (Number(tileIDs[i][0])+upOrDown).toString() + ((Number(tileIDs[i][1])+1).toString());
            jumpLeft = (Number(tileIDs[i][0])+upOrDown*2).toString() + ((Number(tileIDs[i][1])-2).toString());
            jumpRight = (Number(tileIDs[i][0])+upOrDown*2).toString() + ((Number(tileIDs[i][1])+2).toString());

            //console.log("Coords: " + leftNeighbour + " + " + rightNeighbour + " + " + jumpLeft + " + " + jumpRight);

            if (leftNeighbour[1] > 1 && leftNeighbour[0] > 1 && leftNeighbour[0] < 8 && isOccupiedByOpponent(leftNeighbour)) {                
                if (!isOccupiedByOpponent(jumpLeft) && !isOccupiedByFriend(jumpLeft)) {
                    document.getElementById((jumpLeft)).src="imageref/rred.png";
                    selectActiveMandatoryTile(tileIDs[i]);
                    mandatoryHit = true;
                }
            }
            if (rightNeighbour[1] < 8 && rightNeighbour[0] > 1 && rightNeighbour[0] < 8 && isOccupiedByOpponent(rightNeighbour)) {
                if (!isOccupiedByOpponent(jumpRight) && !isOccupiedByFriend(jumpRight)) {                    
                    document.getElementById((jumpRight)).src="imageref/rred.png";
                    selectActiveMandatoryTile(tileIDs[i]);
                    mandatoryHit = true;
                }
            }
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

function showDestination(){
    var upOrDown = 1
    if (!whiteplayerturn) {
        upOrDown = -1;
    }

    if (document.getElementById(activeTile).src.endsWith("Wselect.png") || document.getElementById(activeTile).src.endsWith("Bselect.png")) {
        firstID = (Number(activeTile[0])+upOrDown).toString() + ((Number(activeTile[1])-1).toString());
        secondID = (Number(activeTile[0])+upOrDown).toString() + ((Number(activeTile[1])+1).toString());
    }    

    if (activeTile[1] > 1) {
        if (document.getElementById(firstID).src.endsWith("/red.png")) {
            document.getElementById((firstID)).src="imageref/bred.png";
        }
    }
    if (activeTile[1] < 8){
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

function matchTileAndPlayer(a){
    if ((document.getElementById(a).src.endsWith("Wtile.png") || document.getElementById(a).src.endsWith("WQtile.png")) && whiteplayerturn){
        return true;
    } else if ((document.getElementById(a).src.endsWith("Btile.png") || document.getElementById(a).src.endsWith("BQtile.png")) && !whiteplayerturn){
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