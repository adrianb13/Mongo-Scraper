# Mongo-Scraper

The app was created as a website scraper for news headlines that are currently trending.  The site it is scrapping is Buzzfeed.com. But this can be switched to other sites to scraper for other articles.  

The app uses Mongo & Mongoose, Express & handlebars, and Node.  All you would have to do as a user is got to the main page: https://buzz-scraper.herokuapp.com/ to begin. Once there type in the next page: https://buzz-scraper.herokuapp.com/scrape and it will scrape the page for the current headlining articles on Buzzfeed.  It will acknowleged the scraping has finished and you return back to the home page: https://buzz-scraper.herokuapp.com/.  Once there, it will load all your current news headlines.

You are also able to add personal comments/notes to each article by clicking the headline of the article and saving the comments for yourself. Once the comment is saved, if you click the headline later, it will populate your personal comment that was saved in the comment section.

The app itself is deployed on heroku so you will not need to copy and install the repository yourself to have it running.  But if you decide to make changes to the site you are scraping, the following npms modules are required: express, express-handlebars, morgan (for logging purposes in node), mongoose, axios, and cheerio (both of which are used for the scraping). 

The MVC model was used for the final product but I did leave the routing codes as comments in the server.js file for easy readibility of what is happenining on the backend of the page.

Thank you for your interest and time.
~Adrian Briones.
