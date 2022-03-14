## BGA meets BGG
Browser extension to display boardgames ratings from [boardgamegeek](https://boardgamegeek.com) in [boardgamearena](https://boardgamearena.com).
It uses [BGG XML API2](https://boardgamegeek.com/wiki/page/BGG_XML_API2) to fetch the data.

### Usage
Add extension (public folder only) on Firefox using `about:debugging` and on Chrome using `chrome://extensions`.

![Popup screenshot](./popup.png?raw=true "Popup screenshot")
![BGA screenshot](./bga.png?raw=true "BGA screenshot")

### Installation
Run `npm install` to install dependencies.

### Linter
Run linter with `npm run lint`.

### Limitations
The extension works pretty well but does not display the rating for all the games.
The API has its limitations, so the parameter `exact=1` is necessary to query games, but it results in some games not being found.
