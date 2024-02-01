function initializeSSE() {
  const eventSource = new EventSource('/log-stream');
  let isFirstMessage = true;

  eventSource.onmessage = function (event) {
    const logDiv = document.getElementById('log');
    const loadingDiv = document.getElementById('loading');

    if (isFirstMessage && loadingDiv) {
      loadingDiv.style.display = 'none';
      isFirstMessage = false;
    }

    if (logDiv) {
      const newLine = document.createElement('div');
      newLine.textContent = event.data;
      logDiv.appendChild(newLine);

      // Auto-scroll to the bottom of the logDiv
      logDiv.scrollTop = logDiv.scrollHeight;
    }
  };

  eventSource.onerror = function () {
    console.error('EventSource failed.');
    eventSource.close();
  };
}

// Call initializeSSE when the page is loaded
window.onload = initializeSSE;