const BGA_APP_URL = 'https://boardgamearena.com';

const button = document.getElementById('ext-add');
button.addEventListener('click', () => {
  button.disabled = true;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length || !tabs[0].url.includes(BGA_APP_URL)) {
      alert('Please go to BGA'); // eslint-disable-line no-alert
      return;
    }

    chrome.tabs.sendMessage(tabs[0].id, { action: 'add_games_ratings' });
  });
});
