import { updateHighscores, displayHighscores } from "./highscore.js";

export class RockPaperScissors {
  constructor() {
    this.selectionBtns = document.querySelectorAll("[data-selection]");
    this.finalColumn = document.querySelector("[data-finalcolumn]");
    this.computerScoreSpan = document.querySelector("[data-computerScore]");
    this.playerScoreSpan = document.querySelector("[data-yourscore]");
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

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document
      .getElementById("formNameInput")
      .addEventListener("submit", (event) => this.handleNameInput(event));
    this.selectionBtns.forEach((selectionBtn) => {
      selectionBtn.addEventListener("click", (event) =>
        this.handleSelectionClick(event, selectionBtn)
      );
    });
  }

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

  clearElement(element) {
    while (element.firstChild) {
      element.firstChild.remove();
    }
  }

  createHTMLElement(tag, options = {}) {
    const element = document.createElement(tag);
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        element[key] = options[key];
      }
    }
    return element;
  }

  handleSelectionClick(event, selectionBtn) {
    const selectionName = selectionBtn.dataset.selection;
    const selection = this.selections.find(
      (selection) => selection.name === selectionName
    );
    this.makeSelection(selection);
  }

  makeSelection(selection) {
    const computerSelection = this.computerRandomSelect();
    const playerWinner = this.isWinner(selection, computerSelection);
    const computerWinner = this.isWinner(computerSelection, selection);

    this.addSelectionResult(computerSelection, computerWinner);
    this.addSelectionResult(selection, playerWinner);

    if (playerWinner) this.incrementScore(this.playerScoreSpan);
    if (computerWinner) this.incrementScore(this.computerScoreSpan);

    this.endGame(this.playerScoreSpan, computerWinner); // Pass computerWinner instead of computerScore
  }

  incrementScore(scoreSpan) {
    if (scoreSpan) {
      scoreSpan.innerText = parseInt(scoreSpan.innerText) + 1;
    }
  }

  addSelectionResult(selection, winner) {
    const div = document.createElement("div");
    div.innerText = selection.emoji;
    div.classList.add("resultSelection");
    if (winner) div.classList.add("winner");
    this.finalColumn.after(div);
  }

  isWinner(selection, opponentSelection) {
    return selection.beats === opponentSelection.name;
  }

  computerRandomSelect() {
    const randomIndex = Math.floor(Math.random() * this.selections.length);
    return this.selections[randomIndex];
  }

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
        innerText: `${playerName} is the winner!`,
      });
      const btn = this.createHTMLElement("button", {
        id: "newGameBtn",
        innerText: "New Game",
      });
      btn.addEventListener("click", () => {
        location.reload();
      });
      const displayDiv = this.createHTMLElement("div", { id: "displayDiv" });

      document.querySelector(".selections").append(div);
      div.append(h1, btn, displayDiv);

      await displayHighscores("displayDiv", newEntry);
    }
  }
}
