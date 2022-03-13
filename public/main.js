const BGG_APP_URL = 'https://boardgamegeek.com';
const BGG_API_URL = 'https://api.geekdo.com/xmlapi2';
const greenIconUrl = chrome.runtime.getURL('images/hexagon-green.png');
const blueIconUrl = chrome.runtime.getURL('images/hexagon-blue.png');
const purpleIconUrl = chrome.runtime.getURL('images/hexagon-purple.png');
const redIconUrl = chrome.runtime.getURL('images/hexagon-red.png');

const getDisplayedGames = () => {
  const links = document.getElementsByTagName('a');

  return Array.from(links).reduce((games, link) => {
    const names = link.getElementsByClassName('gamename');
    if (!names.length) return games;

    link.parentElement.style.position = 'relative'; // eslint-disable-line no-param-reassign

    const name = names[0].textContent.trim();
    const ids = games[name] || [];
    ids.push(link.parentElement.id);

    return { ...games, [name]: ids };
  }, {});
};

const getGameByName = async (name) => {
  try {
    const response = await fetch(`${BGG_API_URL}/search?query=${name}&type=boardgame&exact=1`);
    const str = await response.text();
    const data = new window.DOMParser().parseFromString(str, 'text/xml');
    const items = data.getElementsByTagName('item');

    if (!items.length) {
      console.warn(`${name} was not found`);
      return;
    }

    return items[0];
  } catch (error) {
    console.warn(`An error has occurred while searching for ${name}`);
  }
};

const fetchGameRatingById = async (id) => {
  try {
    const response = await fetch(`${BGG_API_URL}/thing?id=${id}&stats=1`);
    const str = await response.text();
    const data = new window.DOMParser().parseFromString(str, 'text/xml');
    const averages = data.getElementsByTagName('average');

    if (!averages.length) {
      console.warn(`#${id} average was not found`);
      return;
    }

    return averages[0].getAttribute('value');
  } catch (error) {
    console.warn(`An error has occurred while fetching #${id}`);
  }
};

const addGameRatings = (id, rating, elementsIds) => {
  const rounded = parseFloat(rating).toFixed(1);
  const link = `${BGG_APP_URL}/boardgame/${id}`;

  let iconUrl = redIconUrl;
  if (rounded >= 8) {
    iconUrl = greenIconUrl;
  } else if (rounded >= 7) {
    iconUrl = blueIconUrl;
  } else if (rounded >= 5) {
    iconUrl = purpleIconUrl;
  }

  const str = `<a class="ext-rating" href="${link}" target="_blank"><img src="${iconUrl}" /><span>${rounded}</span></a>`;
  const parser = new DOMParser();

  elementsIds.forEach((elementId) => {
    const parsed = parser.parseFromString(str, `text/html`);
    const links = parsed.getElementsByTagName('a');

    document.getElementById(elementId).append(links[0]);
  });
};

const addGamesRatings = () => {
  const games = getDisplayedGames();
  console.log(`Found ${Object.keys(games).length} games`);

  Object.keys(games).forEach(async (name) => {
      const game = await getGameByName(name);
      if (!game) {
        return;
      }

      const rating = await fetchGameRatingById(game.id);
      if (!rating) {
        return;
      }

      addGameRatings(game.id, rating, games[name]);
  });
};

chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case 'add_games_ratings':
      addGamesRatings();
      break;
    default:
      console.error(`Unknown action ${message.action}`);
      break;
  }
});
