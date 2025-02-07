let score = 0;
let targetColor = "";
const totalOptions = 6;

const colorBox = document.querySelector('[data-testid="colorBox"]');
const optionsContainer = document.getElementById("optionsContainer");
const gameStatus = document.querySelector('[data-testid="gameStatus"]');
const scoreDisplay = document.getElementById("score");
const newGameButton = document.getElementById("newGameButton");
const difficultyInputs = document.getElementsByName("difficulty");

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getSimilarColor(target) {

  const r = parseInt(target.slice(1, 3), 16);
  const g = parseInt(target.slice(3, 5), 16);
  const b = parseInt(target.slice(5, 7), 16);
  
  
  function adjust(c) {
    let newVal = c + Math.floor(Math.random() * 61) - 30;
    newVal = Math.max(0, Math.min(255, newVal));
    return newVal;
  }
  
  const newR = adjust(r);
  const newG = adjust(g);
  const newB = adjust(b);
  
  return "#" + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1).toUpperCase();
}

function getDifficulty() {
  for (const input of difficultyInputs) {
    if (input.checked) {
      return input.value;
    }
  }
  return "medium"; 
}

function generateColorOptions() {
  optionsContainer.innerHTML = ""; 
  const difficulty = getDifficulty();
  let options = [];
  
  
  options.push(targetColor);
  

  for (let i = 1; i < totalOptions; i++) {
    let newColor = "";
    if (difficulty === "hard") {
      
      newColor = getSimilarColor(targetColor);
    } else {
      
      newColor = getRandomColor();
      
      if (difficulty === "easy") {
        let diff = Math.abs(parseInt(targetColor.slice(1), 16) - parseInt(newColor.slice(1), 16));
        while (diff < 500000) {
          newColor = getRandomColor();
          diff = Math.abs(parseInt(targetColor.slice(1), 16) - parseInt(newColor.slice(1), 16));
        }
      }
    }
    options.push(newColor);
  }
  
  options.sort(() => Math.random() - 0.5);
  
  options.forEach(color => {
    const btn = document.createElement("button");
    btn.setAttribute("data-testid", "colorOption");
    btn.style.backgroundColor = color;
    btn.addEventListener("click", () => handleGuess(color, btn));
    optionsContainer.appendChild(btn);
  });
}

function handleGuess(selectedColor, btnElement) {
  if (selectedColor === targetColor) {
    gameStatus.textContent = "Correct!";
    btnElement.classList.add("correct");
    score++;
    scoreDisplay.textContent = score;
  } else {
    gameStatus.textContent = "Wrong! Try again.";
    btnElement.classList.add("wrong");
  }
  setTimeout(() => {
    btnElement.classList.remove("correct", "wrong");
  }, 500);
}

function startGame() {
  gameStatus.textContent = "";
  targetColor = getRandomColor();
  colorBox.style.backgroundColor = targetColor;
  generateColorOptions();
}

newGameButton.addEventListener("click", () => {
  startGame();
});


difficultyInputs.forEach(input => {
  input.addEventListener("change", startGame);
});

startGame();
