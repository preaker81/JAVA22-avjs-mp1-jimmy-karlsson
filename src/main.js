// const img = document.createElement('img');
// const imgUrl = new URL('./media/placeholderImage.png', import.meta.url);
// img.src = imgUrl.href;
// document.body.append(img);

// console.log(import.meta);

const selectionBtns = document.querySelectorAll('[data-selection]');
const finalColumn = document.querySelector('[data-finalColumn]');
const computerScoreSpan = document.querySelector('[data-computerScore]');
const playerScoreSpan = document.querySelector('[data-yourScore]');
const selections = [
    {
        name: 'rock',
        emoji: '✊',
        beats: 'scissors'
    },
    {
        name: 'paper',
        emoji: '✋',
        beats: 'rock'
    },
    {
        name: 'scissors',
        emoji: '✌️',
        beats: 'paper'
    }
];

// Eventlistener to Name input field and sets the player name. Removes inputfield after input.
    document.getElementById('formNameInput').addEventListener('submit', event => {
    event.preventDefault();
    document.getElementById('playerName').innerText = document.getElementById('inputText').value == '' ? 'Player' : document.getElementById('inputText').value;
    document.getElementById('inputText').value = '';
    document.getElementById('formNameInput').innerHTML = '';
    document.querySelectorAll('.selection').forEach(Element => Element.classList.remove('hidden'));
});

// Sets eventlisteners to the game buttons.
selectionBtns.forEach(selectionBtn => {
    selectionBtn.addEventListener('click', event => {
        const selectionName = selectionBtn.dataset.selection;
        const selection = selections.find(selection => selection.name === selectionName);
        makeSelection(selection)
    })
});

// Main game function
function makeSelection(selection) {
    const computerSelection = computerRandomSelect(); //Enter result of computer choise to variable
    const playerWinner = isWinner(selection, computerSelection); //Checks if player is round winner
    const computerWinner = isWinner(computerSelection, selection); //Checks if computer is round winner

    addSelectionResult(computerSelection, computerWinner);
    addSelectionResult(selection, playerWinner);

    if (playerWinner) incrementScore(playerScoreSpan); //uptick point for player
    if (computerWinner) incrementScore(computerScoreSpan); //uptick point for computer

    endGame(playerScoreSpan, computerScoreSpan); //Checks if the game is over.
};

// Function for uptick score
function incrementScore(scoreSpan) {
    scoreSpan.innerText = parseInt(scoreSpan.innerText) + 1;
};

// Adds div whit result to finalColumn
function addSelectionResult(selection, winner) {
    const div = document.createElement('div');
    div.innerText = selection.emoji;
    div.classList.add('resultSelection'); // Adds class to Css styling for loser
    if (winner) div.classList.add('winner'); // Adds class to Css styling for winner
    finalColumn.after(div);
};

// Function for declaring round winner
function isWinner(selection, opponentSelection) {
    return selection.beats === opponentSelection.name;
};

// Function for letting the computer making its choice by random
function computerRandomSelect() {
    const randomIndex = Math.floor(Math.random() * selections.length);
    return selections[randomIndex];
};

// Function for ending the game, code inside only runs if any player reached set score
function endGame(playerScore, computerScore) {
    if (playerScore.innerText == 3 || computerScore.innerText == 3) {
        const winner = playerScore.innerText > computerScore.innerText ? document.getElementById('playerName').innerText : 'Computer';

        // Disable all buttons by hiding them using Css class selector 'hidden'
        const disableBtns = document.querySelectorAll('.selection');
        for (const disableBtn of disableBtns) {
            disableBtn.classList.add('hidden');
        };

        // Creates a div containing a H1 and a Button Element for declaring winner and restarting the game.
        const div = document.createElement('div');
        div.classList.add('newGameDiv');

        const h1 = document.createElement('H1');
        h1.setAttribute('id', 'victoryH1');
        h1.innerText = `${winner} is the winner!`;

        const btn = document.createElement('button');
        btn.innerText = 'New Game';
        btn.setAttribute('id', 'newGameBtn');
        btn.addEventListener('click', ()=>{
            location.reload();
        });

        document.querySelector('.selections').append(div);
        div.append(h1, btn);
    };
};