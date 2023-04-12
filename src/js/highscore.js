const url =
  "https://highscore-ff271-default-rtdb.europe-west1.firebasedatabase.app/highscores.json";

async function getHighscores() {
  const response = await fetch(url);
  return Object.values(await response.json());
}

async function updateHighscores(newEntry) {
  const highscores = await getHighscores();
  highscores.push(newEntry);
  highscores.sort((a, b) => b.score - a.score).splice(5);

  const updatePromises = highscores.map(async (entry, i) => {
    const userKey = `user${i + 1}`;
    await fetch(`${url.slice(0, -5)}/${userKey}.json`, {
      method: "PUT",
      body: JSON.stringify(entry),
      headers: { "Content-Type": "application/json" },
    });
  });

  await Promise.all(updatePromises); // Wait for all updates to finish
}

function removeChildElements(parentElement) {
  const parent = document.getElementById(parentElement);
  if (parent) {
    while (parent.firstChild) {
      parent.firstChild.remove();
    }
  }
}

async function displayHighscores(parentElement, newEntry = null) {
  const highscores = await getHighscores();

  if (newEntry) {
    // Check if the newEntry is already in the highscores
    const newEntryExists = highscores.some(
      (entry) => entry.name === newEntry.name && entry.score === newEntry.score
    );

    // If newEntry is not in the highscores, add and sort it
    if (!newEntryExists) {
      highscores.push(newEntry);
      highscores.sort((a, b) => b.score - a.score).splice(5);
    }
  }

  const displayDiv = parentElement
    ? document.getElementById(parentElement)
    : document.getElementById("displayDiv");

  removeChildElements("displayDiv");

  highscores.forEach((entry, index) => {
    const highscoreP = document.createElement("p");
    highscoreP.innerHTML = `${index + 1}. ${entry.name}: ${entry.score}`;
    displayDiv.appendChild(highscoreP);
  });
}

export { updateHighscores, displayHighscores };
