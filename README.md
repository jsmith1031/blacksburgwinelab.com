# blacksburgwinelab.com
The Blacksburg Wine Lab website. Designed by Jeffrey Smith for ITEC 225 and possibly Blacksburg Wine Lab Incorporated.

-Name:       Jeffrey Smith

-Course:     ITEC 225 at Radford University

-Semester:   Fall 2019 and Spring 2020

-Email:      jsmith1031@radford.edu
# [Preview Link](https://jsmith1031.github.io/blacksburgwinelab.com/)
[https://jsmith1031.github.io/blacksburgwinelab.com/](https://jsmith1031.github.io/blacksburgwinelab.com/)
## Description 
This project is a collaboration between students in Virginia Tech Project Management and Radford Computer Science to build a website for Blacksburg Wine Lab without using templates provided by website builders. The planned backend uses the Revel API to connect to the iPads in the restaurant and send reservations from the website to the ticket printer in the Wine Lab.

## Front End
A single static page: `index.html`, `css/site.css` and `js/site.js`. No frameworks or build step. Open `index.html` in a browser to preview it.

* Opening animation built from the Wine Lab logo. It plays once per visit, can be skipped with a click, and is turned off for visitors who ask for reduced motion.
* Hours, address, phone and email match winelab.com as of November 2026. Hours are set in one place at the top of `js/site.js`.
* The reservation form checks the request against the opening hours, then opens an email to the Wine Lab. It does not book a table by itself.
* Photos in `images/photos` come from the Wine Lab's Google listing. Get the Wine Lab's permission before using them on a live site.

## Backend
SparkAda for temporary storage of reservation tickets and secure API key handling
RevelAPI suite for passing reservation tickets from BlacksburgWineLab.com to the iPad POS

## Still to do
* Connect the reservation form to the POS API
* Move reservation constraints from front end JavaScript to the backend API
* Add the email list signup form
* Show the current menus on the page instead of linking to winelab.com
