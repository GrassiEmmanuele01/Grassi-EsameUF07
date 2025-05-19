let timerInterval;
let seconds = 0;

function updateButtonStates() {
  const startBtn = document.querySelector(".btn-start");
  const stopBtn = document.querySelector(".btn-stop");
  const resetBtn = document.querySelector(".btn-reset");

  if (timerInterval) {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = true;
  } else {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = seconds === 0;
  }
}

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);

  updateButtonStates();
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;

  updateButtonStates();
}

function resetTimer() {
  stopTimer();
  seconds = 0;
  updateTimer();
  updateButtonStates();
}

function updateTimer() {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  document.getElementById(
    "timer"
  ).textContent = `${minutes}:${remainingSeconds}`;
}
