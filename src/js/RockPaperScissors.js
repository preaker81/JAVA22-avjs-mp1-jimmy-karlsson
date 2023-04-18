// Importing necessary functions from highscore.js
import { updateHighscores, displayHighscores } from "./highscore.js";

// The RockPaperScissors class containing the game logic
export class RockPaperScissors {
  constructor() {
    // Initializing variables and selecting necessary DOM elements
    this.selectionBtns = document.querySelectorAll("[data-selection]");
    this.finalColumn = document.getElementById("roundResult");
    this.playerScoreSpan = document.getElementById("playerScore");
    this.selections = [
      {
        name: "rock",
        emoji: "✊",
        beats: "scissors",
      },
      {
        name: "paper",
        emoji: "✋",
        beats: "rock",
      },
      {
        name: "scissors",
        emoji: "✌️",
        beats: "paper",
      },
    ];

    // Calling method to set up event listeners
    this.initializeEventListeners();
  }

  // Method to initialize event listeners
  initializeEventListeners() {
    // Event listener for the name input form submission
    document
      .getElementById("formNameInput")
      .addEventListener("submit", (event) => this.handleNameInput(event));
    // Event listener for the selection buttons
    this.selectionBtns.forEach((selectionBtn) => {
      selectionBtn.addEventListener("click", (event) =>
        this.handleSelectionClick(event, selectionBtn)
      );
    });
  }

  // Method to handle the name input form submission
  handleNameInput(event) {
    event.preventDefault();
    const inputText = document.getElementById("inputText");
    const playerName = document.getElementById("playerName");
    playerName.innerText = inputText.value || "Player";
    inputText.value = "";
    this.clearElement(document.getElementById("formNameInput"));
    document
      .querySelectorAll(".selection")
      .forEach((element) => element.classList.remove("hidden"));
  }

  // Method to clear an element of its child nodes
  clearElement(element) {
    while (element.firstChild) {
      element.firstChild.remove();
    }
  }

  // Method to create an HTML element with optional properties
  createHTMLElement(tag, options = {}) {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(options)) {
      element[key] = value;
    }
    return element;
  }

  // Method to handle selection button clicks
  handleSelectionClick(event, selectionBtn) {
    const selectionName = selectionBtn.dataset.selection;
    const selection = this.selections.find(
      (selection) => selection.name === selectionName
    );
    this.makeSelection(selection);
  }

  // Method to handle the player's selection
  makeSelection(selection) {
    const computerSelection = this.computerRandomSelect();
    const playerWinner = this.isWinner(selection, computerSelection);
    const computerWinner = this.isWinner(computerSelection, selection);

    this.addSelectionResult(computerSelection, computerWinner);
    this.addSelectionResult(selection, playerWinner);

    if (playerWinner) this.incrementScore(this.playerScoreSpan);

    this.endGame(this.playerScoreSpan, computerWinner);
  }

  // Method to increment the score
  incrementScore(scoreSpan) {
    if (scoreSpan) {
      scoreSpan.innerText = parseInt(scoreSpan.innerText) + 1;
    }
  }

  // Method to add the result of a selection
  addSelectionResult(selection, winner) {
    const div = document.createElement("div");
    div.innerText = selection.emoji;
    div.classList.add("resultSelection");

    if (winner) div.classList.add("winner");
    this.finalColumn.after(div);
  }

  // Method to determine if a selection wins over the opponent's selection
  isWinner(selection, opponentSelection) {
    return selection.beats === opponentSelection.name;
  }

  // Method for the computer to make a random selection
  computerRandomSelect() {
    const randomIndex = Math.floor(Math.random() * this.selections.length);
    return this.selections[randomIndex];
  }

  // Method to end the game and update highscores
  async endGame(playerScore, computerWinner) {
    if (computerWinner) {
      // Check if computerWinner is true
      const playerName = document.getElementById("playerName").innerText;
      const newEntry = {
        name: playerName,
        score: parseInt(playerScore.innerText),
      };

      await updateHighscores(newEntry);

      document.querySelectorAll(".selection").forEach((btn) => {
        btn.classList.add("hidden");
      });

      const div = this.createHTMLElement("div", { className: "newGameDiv" });
      const h1 = this.createHTMLElement("H1", {
        id: "victoryH1",
        innerText: `Game over, try again!`,
      });
      const btn = this.createHTMLElement("button", {
        id: "newGameBtn",
        innerText: "New Game",
      });
      btn.addEventListener("click", () => {
        location.reload();
      });
      await displayHighscores("displayDiv", newEntry);

      document.querySelector(".selections").append(div);
      div.append(h1, btn); // Remove displayDiv from this line

      await displayHighscores("displayDiv", newEntry);
    }
  }
}
