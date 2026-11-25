# Blacksburg Wine Lab

A website for [Blacksburg Wine Lab](https://www.winelab.com), a wine bar, bottle shop and kitchen at 223 Gilbert Street in downtown Blacksburg, Virginia.

**[View the live preview](https://jsmith1031.github.io/blacksburgwinelab.com/)**

## About the project

This started as a collaboration between students in Virginia Tech Project Management and Radford University Computer Science: build the Wine Lab a site by hand instead of with a website-builder template, and connect its reservation form to the restaurant's point-of-sale system.

The front end is finished and described below. The point-of-sale connection is not built yet (see [Roadmap](#roadmap)).

## What's on the page

The site is a single screen. Nothing sits below it to scroll through.

| Part | What it does |
| --- | --- |
| Opening | The Wine Lab logo assembles on a dark screen, then fades to reveal the pendant lights in the same spot. Plays on every load. |
| Landing screen | A framed photo of the pendant lights with six photo orbs around it, and a line showing whether the Wine Lab is open right now. |
| Panels | Each orb, and each link in the top menu, opens one section in a panel over the landing screen: food menu, drink menu, reserve a table, private events, our story, hours and location. |

With JavaScript turned off, the same sections appear as an ordinary page below the landing screen.

## Run it locally

There is no build step and nothing to install. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

The opening animation plays on every page load. Click anywhere to skip it.

## Project layout

```
index.html           the whole page
css/site.css         styles, including the opening animation
js/site.js           navigation, open/closed status, reservation form
images/photos/       photos used on the page
images/              logo and favicon
reservation_handler  compiled binary from early Ada work on the reservation backend
```

## Updating the content

- **Hours:** edit the `HOURS` list at the top of `js/site.js`, and the hours table in the "Reserve a table" section of `index.html`. The open/closed line and the form's time checks both read from `HOURS`.
- **Address, phone, email and parking:** edit the "Hours and location" section of `index.html`. The reservation email address is also set as `RESERVATION_EMAIL` in `js/site.js`.
- **Menu items:** edit the lists in the "Food and drink" section of `index.html`.
- **Photos:** replace files in `images/photos/`, keeping the same file names, or change the `src` and `alt` text in `index.html`.
- **Colours and fonts:** change the variables at the top of `css/site.css`.

Hours and contact details match winelab.com as of November 2026.

## How reservations work today

The form checks that the date is not in the past, that the Wine Lab is open at the chosen day and time, and that the party is eight or fewer. It then opens the visitor's email app with the request addressed to the Wine Lab.

It does not book a table by itself. A reservation is only confirmed when the Wine Lab replies. The page also links to the Wine Lab's own online booking for instant confirmation.

## Roadmap

- Send reservations from the form straight to the Revel point-of-sale iPads and the ticket printer, through a small backend that keeps the API keys off the page
- Move the reservation rules from the browser to that backend
- Add a mailing list signup form
- Show the current menus on the page instead of linking out

## Photos

The photos in `images/photos/` come from the Wine Lab's Google listing, and most were taken by guests. Get permission from the Wine Lab and the photographers before using them on a public, official site.

## Credits

Designed and built by Jeffrey Smith, first for ITEC 225 at Radford University (Fall 2019 and Spring 2020).
