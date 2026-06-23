# Image Search Engine

A simple web app where you type in a keyword and it pulls back matching images from the Unsplash API. Built with just HTML, CSS, and vanilla JavaScript — no frameworks, no build tools.

This was a project I built to practice working with APIs, `fetch()`, and dynamically updating the DOM with JavaScript.

## Demo

![screenshot placeholder](images/screenshot.png)

*(add a screenshot or GIF of the app here once it's running)*

## Features

- Search for images by keyword
- Results show up in a responsive grid
- Click on an image to view a bigger version in a popup
- "Load More" button to fetch the next page of results for the same search
- Remembers your last 5 searches (using `localStorage`) so you can quickly search them again
- Shows a loading message while waiting on the API
- Shows an error message if the request fails, and a separate message if there are just no results

## Built With

- HTML5
- CSS3 (Flexbox + Grid)
- Vanilla JavaScript (fetch, async/await, localStorage)
- A small [Netlify Function](https://docs.netlify.com/functions/overview/) to keep the API key off the frontend
- [Unsplash API](https://unsplash.com/developers)


## Getting Started

### 1. Get an Unsplash API key

Go to [unsplash.com/developers](https://unsplash.com/developers), make a free account, and create a new app. You'll get an **Access Key** (you can ignore the Application ID and Secret Key — those aren't needed here).

### 2. How the API key works in this project

This project uses a small **Netlify serverless function** (`netlify/functions/search.js`) to talk to Unsplash, instead of calling Unsplash directly from the browser. That means the API key never gets exposed in the frontend code — it lives in an environment variable on Netlify's side instead.

`script.js` just calls our own function (`/.netlify/functions/search`), and that function adds the real key before forwarding the request to Unsplash.

### 3. Running it locally

You'll need the [Netlify CLI](https://docs.netlify.com/cli/get-started/) for this, since the function needs a server to run on (even locally):

```
npm install -g netlify-cli
```

Then create a real `.env` file in the project root (copy `.env.example` and rename it) and paste your access key in:

```
UNSPLASH_ACCESS_KEY=your_real_key_here
```

Then run:

```
netlify dev
```

This starts a local server that serves your HTML/CSS/JS **and** runs the function, reading the key from your `.env` file. Open the URL it gives you (usually `http://localhost:8888`).

> Note: just opening `index.html` directly in your browser won't work anymore, since there's no server to run the function. You need `netlify dev` (or a real deployment) for this to work.

### 4. Deploying it live

1. Push this project to a GitHub repo
2. Go to [netlify.com](https://netlify.com), and create a new site from your GitHub repo
3. In your site's settings, go to **Site configuration → Environment variables** and add:
   - Key: `UNSPLASH_ACCESS_KEY`
   - Value: your real access key
4. Deploy. Netlify will automatically detect `netlify.toml` and run the function for you.

Your `.env` file never gets uploaded to GitHub (it's in `.gitignore`) — the key only ever lives in Netlify's environment variable settings and inside the function itself.

## Project Structure

```
image-search-engine/
├── index.html
├── style.css
├── script.js
├── netlify.toml
├── .env.example
├── .gitignore
├── netlify/
│   └── functions/
│       └── search.js
├── images/
└── README.md
```


## Things I Learned

- How to use `fetch()` with `async/await` to call an external API
- Creating and inserting DOM elements with JavaScript instead of just writing static HTML
- Using `localStorage` to save small bits of data across page refreshes
- The difference between a request that *fails* vs. one that *works but returns nothing* — and why showing the right message for each one matters
- `event.stopPropagation()`, for stopping a click on the popup image from also triggering the "close popup" click on the background behind it
- That `.env` files only work if something (a build tool or a server) actually reads them — a plain static site can't use one on its own. This is why I added a small serverless function: it gave me somewhere to actually use an environment variable, instead of leaving the API key sitting in plain text in the frontend code.


## Possible Future Improvements

- A "Favorites" section so you can save images you like
- Skeleton loading placeholders instead of just a text message
- A dark mode toggle

## License

This project is just for learning/portfolio purposes, feel free to use it however you'd like.
