// Define the URL for the Firebase Realtime Database storing highscores
const url =
  "https://highscore-ff271-default-rtdb.europe-west1.firebasedatabase.app/highscores.json";

// Fetch highscores from the database
async function getHighscores() {
  const response = await fetch(url);
  return Object.values(await response.json());
}

// Update the highscores with a new entry, keeping only the top 5 scores
async function updateHighscores(newEntry) {
  const highscores = await getHighscores();
  highscores.push(newEntry);
  highscores.sort((a, b) => b.score - a.score).splice(5);

  // Update the Firebase Realtime Database with the new highscores
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

// Remove all child elements of a specified parent element
function removeChildElements(parentElement) {
  const parent = document.getElementById(parentElement);
  if (parent) {
    while (parent.firstChild) {
      parent.firstChild.remove();
    }
  }
}

// Display the highscores on the webpage
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

  // Select the parent element to display the highscores
  const displayDiv = parentElement
    ? document.getElementById(parentElement)
    : document.getElementById("displayDiv");

  // Clear the existing highscores display
  removeChildElements("displayDiv");

  // Create and append highscore elements to the displayDiv
  highscores.forEach((entry, index) => {
    const highscoreP = document.createElement("p");
    highscoreP.innerHTML = `${index + 1}. ${entry.name}: ${entry.score}`;
    displayDiv.appendChild(highscoreP);
  });
}

// Export the functions to be used in other files
export { updateHighscores, displayHighscores };
