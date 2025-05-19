let timerInterval;
let seconds = 0;

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
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
