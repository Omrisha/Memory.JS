let objJson = window.localStorage.getItem('config');

function startGame() {
    if (objJson === null) {
        window.localStorage.setItem('config', JSON.stringify({
            player1Name: '',
            player2Name: '',
            player1Score: 0,
            player2Score: 0,
            boardSize: 0,
            isGameStarted: false,
            currentPlayer: 1
        }));
    } 
    
    if (objJson.isGameStarted){
        window.location.replace('./game.html');
    }

    var p1Name = document.getElementById('player1Name');
    var p2Name = document.getElementById('player2Name');
    var boardSize = document.getElementsByName('gridRadios');

    var config = JSON.parse(window.localStorage.getItem('config'));

    for (var i = 0; i < boardSize.length; i++) {
        if (boardSize[i].checked) {
            config.boardSize = parseInt(boardSize[i].value);
            break;
        }
    }

    if (p1Name.value.trim() == '' || p2Name.value.trim() == '') {
        document.getElementById('errorMessage').innerHTML = "Please fill all the detailes in order to play.";
        return false;
    } else {
        config.player1Name = p1Name.value;
        config.player2Name = p2Name.value;
        config.isGameStarted = true;
        window.localStorage.setItem('config', JSON.stringify(config));
        return true;
    }
}