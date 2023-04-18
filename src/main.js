import { RockPaperScissors } from "./js/RockPaperScissors.js";
import { displayHighscores } from "./js/highscore.js";

document.addEventListener("DOMContentLoaded", () => {
  displayHighscores("displayDiv");
});

const game = new RockPaperScissors();
