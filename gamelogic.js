var config = window.localStorage.getItem('config');
var configObj = JSON.parse(config);

let imgs = ["./img/angular.svg", "./img/angular.svg",
            "./img/aurelia.svg", "./img/aurelia.svg",
            "./img/backbone.svg", "./img/backbone.svg",
            "./img/ember.svg", "./img/ember.svg",
            "./img/react.svg", "./img/react.svg",
            "./img/vue.svg", "./img/vue.svg"];

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let playerTurn;

function InitBoard() {
    document.getElementById("p1image").style.visibility = 'visible';
    document.getElementById("p2image").style.visibility = 'hidden';
    let player1name = document.getElementById("player1name");
    let player2name = document.getElementById("player2name");
    let player1score = document.getElementById("player1score");
    let player2score = document.getElementById("player2score");
    if (configObj !== null){
        playerTurn = configObj.currentPlayer;
        player1name.innerHTML = configObj.player1Name;
        player2name.innerHTML = configObj.player2Name;
        player1score.innerHTML = configObj.player1Score;
        player2score.innerHTML = configObj.player2Score;
        var board = document.getElementById('board');
        var imgIndex = 0;
        for (var i = 0; i < configObj.boardSize; i ++){
            for (var j = 0; j < configObj.boardSize; j ++){
                var card = document.createElement("div");
                card.className = "memory-card";
                var imgName = imgs[imgIndex];
                card.dataset.framework = imgName.substring(imgName.lastIndexOf('/')+1, imgName.lastIndexOf("."));
                card.addEventListener("click", cardClick);
                var cardImageFront = document.createElement("img");
                cardImageFront.className = "front-face";
                cardImageFront.src = imgName;
                var cardImageBack = document.createElement("img");
                cardImageBack.src = "./img/js-badge.svg";
                cardImageBack.className = "back-face";
                imgIndex++;
                if (imgIndex == imgs.length) {
                    imgIndex = 0;
                }
                card.appendChild(cardImageFront);
                card.appendChild(cardImageBack);
                board.appendChild(card);
            }
            board.append(document.createElement("br"));
        }
    }

    shuffle();
}


function cardClick(){
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard){
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;

    checkForMatch();
}

function showWinDivs(){
    var winMsg = document.getElementById('winner-text');
    if (configObj.player1Score > configObj.player2Score)
        winMsg.innerText = 'Player 1 wins the game!';
    else if (configObj.player1Score < configObj.player2Score)
        winMsg.innerText = 'Player 2 wins the game!';
    else 
        winMsg.innerText = 'The game ended with a draw!';

    document.getElementById('newGameBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
}

function checkForMatch(){
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    
    isMatch ? disableCards() : unflipCards();
}

function disableCards(){
    if (playerTurn == 1){
        configObj.player1Score += 10;
        player1score.innerHTML = configObj.player1Score;
    } else if (playerTurn == 2){
        configObj.player2Score += 10;
        player2score.innerHTML = configObj.player2Score;
    }

    window.localStorage.setItem('config', JSON.stringify(configObj));
    firstCard.removeEventListener('click', cardClick);
    secondCard.removeEventListener('click', cardClick);

    // checking winning
    var cards = document.querySelectorAll('.memory-card');
    var counter = 0;
    cards.forEach(c => {
        if (c.classList.contains("flip")){
            counter++;
        }
    });

    if (configObj.boardSize === 3){
        if (counter === cards.length - 1){
            showWinDivs();
        }
    } else if (counter === cards.length){
        showWinDivs();
    }

    resetBoard();
}

function unflipCards(){
    lockBoard = true;
    const flipCardsTimeout = new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                firstCard.classList.remove('flip');
                secondCard.classList.remove('flip');
                
                chagneTurn();
                
                lockBoard = false;
                resetBoard();
                resolve('Wrong guess, player ' + playerTurn + ' turn now.');
            } catch (error) {
                reject(error);
            }
        }, 1500);
    });

    flipCardsTimeout.then(function(result){
        alert(result);
    }).catch(function(error){
        alert("There's an error in the flipping process, " + error);
    });
}

function chagneTurn(){
    if (playerTurn == 1){
        document.getElementById('p1image').style.visibility = 'hidden';
        document.getElementById('p2image').style.visibility = 'visible';
        playerTurn = 2;
        configObj.currentPlayer = playerTurn;
    } else if (playerTurn == 2){
        document.getElementById('p2image').style.visibility = 'hidden';
        document.getElementById('p1image').style.visibility = 'visible';
        playerTurn = 1;
        configObj.currentPlayer = playerTurn;
    }
    window.localStorage.setItem('config', JSON.stringify(configObj));
}

function resetBoard(){
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle(){
    var cards = document.querySelectorAll('.memory-card');

    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
}

function chagneSetting(){
 window.location.replace("./index.html");
}

function restrart(){
    var cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
        card.classList.remove('flip');
        card.addEventListener("click", cardClick);
    });

    resetBoard();

    lockBoard = false;

    if (configObj.player1Score > configObj.player2Score) {
        playerTurn = 1;
        document.getElementById('p2image').style.visibility = 'hidden';
        document.getElementById('p1image').style.visibility = 'visible';
        configObj.currentPlayer = playerTurn;
    } else {
        playerTurn = 2;
        document.getElementById('p2image').style.visibility = 'visible';
        document.getElementById('p1image').style.visibility = 'hidden';
        configObj.currentPlayer = playerTurn;
    }

    var winMsg = document.getElementById('winner-text');
    winMsg.innerText = '';
    document.getElementById('newGameBtn').disabled = true;
    document.getElementById('resetBtn').disabled = true;

    window.localStorage.setItem('config', JSON.stringify(configObj));
}