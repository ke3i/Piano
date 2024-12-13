let notes = [60, 62, 64, 65, 67, 69, 71, 72]; // C, D, E, F, G, A, B, C (High)
let osc;
let keys = ['w', 'a', 's', 'd', 'f', 'g', ' ', 'ArrowUp']; // Mapping keys to notes
let manImg, guitar, bbox, music; // Start screen image
let state = "start"; // Game state: "start", "settings", "selection", or "play"
let guitarNotes = []; // Array to store guitar sounds
let beatboxNotes = []; // Array to store beatbox sounds
let pianoBeat;
let pianoBeatStarted = false;
let pianoBeatY = 0;
let helpMenu;


function preload() {
  manImg = loadImage('Man.jpg');
  guitar = loadImage('guitar.png');
  bbox = loadImage('boxer.jpg');
  music = loadImage('gif.gif');
  pianoBeat = loadImage('pianoBeats.png');
  helpMenu = loadImage('help.jpg');
  
  // Load guitar notes as p5.SoundFile objects
  guitarNotes.push(loadSound('g1.wav')); // W
  guitarNotes.push(loadSound('g2.wav')); // A
  guitarNotes.push(loadSound('g3.wav')); // S
  guitarNotes.push(loadSound('g4.wav')); // D
  guitarNotes.push(loadSound('g5.wav')); // F
  guitarNotes.push(loadSound('g6.wav')); // G
  guitarNotes.push(loadSound('g7.wav')); // Space
  
  // Load beatbox sounds as p5.SoundFile objects
  beatboxNotes.push(loadSound('bass.wav'));
  beatboxNotes.push(loadSound('clap.wav'));
  beatboxNotes.push(loadSound('kick.wav'));
  beatboxNotes.push(loadSound('rim.wav'));
  beatboxNotes.push(loadSound('snare.wav'));
  beatboxNotes.push(loadSound('snare.mp3'));
  beatboxNotes.push(loadSound('smallkick.wav'));
}

function setup() {
  createCanvas(900, 600);
  osc = new p5.TriOsc();
  osc.start();
  osc.amp(0);  
  textAlign(CENTER, CENTER);
  textSize(32);
}

function draw() {
  background(220); 

  if (state === "start") {
    drawStartPage();
  } else if (state === "help") {
    drawSettingsPage();
  } else if (state === "selection") {
    drawSelectionPage();
  } else if (state === "piano") {
    drawPianoPage();
  } else if (state === "guitar") {
    drawGuitarPage();
  } else if (state === "beatbox") {
    drawBeatboxPage();
  }
}

function drawStartPage() {
  image(manImg, -120, -30);
  textSize(48);
  fill(0);
  text("Musical Instrument", width / 2, height / 1.5);
  textSize(32);
  text("Press '🡳' for Help, '🡱' for Selection", width / 2, height / 1.3);
}

function drawSettingsPage() {
  background(220); 
  let scaleFactor = 0.8; 
  let imgWidth = helpMenu.width * scaleFactor;
  let imgHeight = helpMenu.height * scaleFactor;
  let imgX = (width - imgWidth) / 2; 
  let imgY = (height - imgHeight) / 2; 
  image(helpMenu, imgX, imgY, imgWidth, imgHeight);
  textSize(32);
  text("Press '🡳' to go back to the Start Page", width / 2, height - 50);
}

function drawSelectionPage() {
  textSize(48);
  fill(0);
  text("Selection Page", width / 2, height / 4);
  textSize(32);
  text("Press '🡰' Arrow for Piano '🡲' Arrow for Guitar \n Left click for BeatBox", width / 2, height / 2);
  text("Press '🡳' to go back to the Start Page", width / 2, height / 1.3);
}

function drawPianoPage() {
  let w = width / notes.length;
  let h = height / 4; 
  let yStart = height - h; 

  // Draw the piano keys
  for (let i = 0; i < notes.length; i++) {
    let x = i * w;
    fill(keyIsPressed && key === keys[i] ? [118, 181, 197] : (keyIsPressed ? 127 : 200));
    rect(x, yStart, w - 1, h - 1); 

    fill(0);
    textSize(24);
    textAlign(CENTER, TOP);
    let label = keys[i] === ' ' ? 'SPACE' : (keys[i] === 'ArrowUp' ? 'UP' : keys[i].toUpperCase());
    text(label, x + w / 2, yStart + h - 30);
  }

 
  if (pianoBeatStarted) {
    let stretchedHeight = 5000; 
    image(pianoBeat, 0, pianoBeatY, width, stretchedHeight); 
    pianoBeatY += 3; 
    
    if (pianoBeatY > height) {
      pianoBeatY = -stretchedHeight; 
    }
  }

 //Buttons
  fill(50, 205, 50, 80); 
  rect(width / 2 - 150, height / 2 - 30, 120, 60, 10); 
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Demo", width / 2 - 90, height / 2); 

  fill(255, 69, 0, 80); 
  rect(width / 2, height / 2 - 30, 120, 60, 10); 
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Play", width / 2 + 60, height / 2); 
  textSize(32);
  fill(0);
  text("Press '🡳' to go back to the Start Page", width / 2, 50);
}

function drawGuitarPage() {
  image(guitar, 0, 100, 900, 700);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Press keys to play the guitar", width / 2, height - 100);
  text("Press '🡳' to go back to the Start Page", width / 2, height - 50);
}

function drawBeatboxPage() {
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0);
  text("Press keys to make beatbox sounds", width / 2, height / 1.5);
  text("Press '🡳' to go back to the Start Page", width / 2, height - 50);
  
  image(bbox, 500, 100);
}

function keyPressed() {
  // Handle key presses to switch between states
  if (state === "start") {
    if (keyCode === DOWN_ARROW) state = "help";
    else if (keyCode === UP_ARROW) state = "selection";
  } else if (state === "help" || state === "selection" || state === "piano" || state === "guitar" || state === 'beatbox') {
    if (keyCode === DOWN_ARROW) state = "start";
  }

  if (state === "selection") {
    if (keyCode === LEFT_ARROW) state = "piano";
    else if (keyCode === RIGHT_ARROW) state = "guitar";
  }

  // Handle key presses for playing the piano
  if (state === "piano") {
    let index = keys.indexOf(key);
    if (index !== -1) {
      osc.freq(midiToFreq(notes[index]));
      osc.fade(0.5, 0.2); // Fade in when the key is pressed
    }
  }

  // Handle key presses for playing guitar
  if (state === "guitar") {
    playGuitarNote();
  }

  // Handle key presses for beatbox sounds
  if (state === "beatbox") {
    // Stop any currently playing beatbox sound
    beatboxNotes.forEach(note => note.stop());
    
    // Play the new sound corresponding to the key pressed
    let index = keys.indexOf(key);
    if (index !== -1) {
      beatboxNotes[index].play();
    }
  }

  // Reset the pianoBeat animation when leaving the piano page
  if (state !== "piano") {
    pianoBeatStarted = false; 
    pianoBeatY = 0;
  }
}


function keyReleased() {
  // Stop the piano sound when the key is released
  if (state === "piano") {
    osc.amp(0, 0.2); // Fade out the sound when the key is released
  }
}

function mousePressed() {
  if (state === "selection" && mouseButton === LEFT) {
    state = "beatbox"; 
  }

  if (state === "piano") {
    let playBtnX = width / 2 - 120;
    let playBtnY = height / 2 - 30;
    let playBtnW = 120;
    let playBtnH = 60;

    if (
      mouseX >= playBtnX &&
      mouseX <= playBtnX + playBtnW &&
      mouseY >= playBtnY &&
      mouseY <= playBtnY + playBtnH
    ) {
      pianoBeatStarted = true; 
      pianoBeatY = 0; 
    }

    let stopBtnX = width / 2;
    let stopBtnY = height / 2 - 30;
    let stopBtnW = 120;
    let stopBtnH = 60;

    if (
      mouseX >= stopBtnX &&
      mouseX <= stopBtnX + stopBtnW &&
      mouseY >= stopBtnY &&
      mouseY <= stopBtnY + stopBtnH
    ) {
      pianoBeatStarted = false; // Stop the animation
      pianoBeatY = 0; // Reset the position
    }
  }
}

function playGuitarNote() {
  // Check which key was pressed and play the corresponding sound
  if (key === 'w') guitarNotes[0].play();
  else if (key === 'a') guitarNotes[1].play();
  else if (key === 's') guitarNotes[2].play();
  else if (key === 'd') guitarNotes[3].play();
  else if (key === 'f') guitarNotes[4].play();
  else if (key === 'g') guitarNotes[5].play();
}
