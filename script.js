// Create button container
const btnContainer = document.createElement('div');
btnContainer.className = 'btnContainer';
document.body.appendChild(btnContainer);
console.log(btnContainer);
  
// Button group with click actions
const btnGrupp = [
  { class: 'btn-up', text: 'Up', click: () => moveIt(currentX, currentY - 1) },
  { class: 'btn-down', text: 'Down', click: () => moveIt(currentX, currentY + 1) },
  { class: 'btn-right', text: 'Right', click: () => moveIt(currentX + 1, currentY) },
  { class: 'btn-left', text: 'Left', click: () => moveIt(currentX - 1, currentY) },
  { class: 'btn-attack', text: 'Attack', click: doIt }
];
console.log(btnGrupp);

// Function to create buttons from config
function createBtns(config) {
  for (let index = 0; index < config.length; index++) {
    const { class: className, text, click } = config[index];
    console.log(index);

    const button = document.createElement('button');
    button.innerText = text;
    button.className = className;
    button.style.margin = '5px';

    // Add click event
    button.addEventListener('click', click);
    
    btnContainer.appendChild(button);
    console.log("Button created...");
  }
}
createBtns(btnGrupp);

// Initial character state
let currentX = 0;
let currentY = 0;
let cooldownTime = 0;
let isRequesting = false;
let cooldownInterval = null;
const server = "https://api.artifactsmmo.com";
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFtb2tyYW5lLm5AaWNsb3VkLmNvbSIsInBhc3N3b3JkX2NoYW5nZWQiOiIifQ.6d0swQJLQdMeK9anCl60XULnHpU20-i2b760ghypxVM";// Replace with your actual token
const character = "Axils"; // Replace with your actual character name

// Fetch options function
function FetchIt(method, body = null) {
  let options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  // If there's a body, add it to the options
  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
}

// Fetch and move character
async function moveIt(newX, newY) {
  if (isRequesting) return;

  const url = `${server}/my/${character}/action/move`;
  const options = FetchIt('POST', { x: newX, y: newY });

  try {
    isRequesting = true;
    const response = await fetch(url, options);
    const data = await response.json();
    updateCharacterUI(data.data.character);
    startCooldown(data.data.cooldown.remaining_seconds);
  } catch (error) {
    console.error("Failed to move character:", error);
  } finally {
    isRequesting = false;
  }
}

// Update character info on the UI
function updateCharacterUI(data) {
  if (!data) return;

  currentX = data.x;
  currentY = data.y;
  const currentHealth = data.hp;
  cooldownTime = data.cooldown?.remaining_seconds || 0;

  // Assuming you have elements to show these values
  nameDisplay.innerText = `Name: ${data.name}`;
  healthDisplay.innerText = `HP: ${currentHealth}`;
  xPosDisplay.innerText = `X: ${currentX}`;
  yPosDisplay.innerText = `Y: ${currentY}`;
  cooldownDisplay.innerText = `Cooldown: ${cooldownTime}`;
}

// Start cooldown timer
function startCooldown(seconds) {
  cooldownTime = seconds;
  cooldownDisplay.innerText = `Cooldown: ${cooldownTime}`;

  if (cooldownInterval) clearInterval(cooldownInterval);

  cooldownInterval = setInterval(() => {
    if (cooldownTime > 0) {
      cooldownTime--;
      cooldownDisplay.innerText = `Cooldown: ${cooldownTime}`;
    } else {
      clearInterval(cooldownInterval);
    }
  }, 1000);
}

// Fight action
async function doIt() {
  const url = `${server}/my/${character}/action/fight`;
  const options = FetchIt('POST');

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    updateCharacterUI(data.data.character);
    startCooldown(data.data.cooldown.remaining_seconds);
  } catch (error) {
    console.error("Error performing attack:", error);
  }
}



async function updateAppearance(newColor, newSize) {
  const url = `${server}/my/${character}/bank/withdraw`;  // Ensure this is the correct API endpoint
  
  const appearanceData = {
    color: newColor,  // New color (example: "red", "blue")
    size: newSize     // New size (example: "large", "medium")
  };

  const options = FetchIt('POST', appearanceData);

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log('Character appearance updated:', data);
  } catch (error) {
    console.error('Error updating appearance:', error);
  }
}





// Create button for updating appearance


const nameDisplay = document.createElement('div');
const healthDisplay = document.createElement('div');
const xPosDisplay = document.createElement('div');
const yPosDisplay = document.createElement('div');
const cooldownDisplay = document.createElement('div');

// Append display elements to body for visibility
document.body.append(nameDisplay, healthDisplay, xPosDisplay, yPosDisplay, cooldownDisplay);
