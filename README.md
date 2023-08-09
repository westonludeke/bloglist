# bloglist

### About

A MERN stack app displaying a list of tech blogs.

![homepage screenshot](https://github.com/westonludeke/bloglist/blob/main/frontend/public/homepage1.png?raw=true | width=250)

### Details

The project contains a RESTful back end in Express for creating, deleting, reading, and updating the list of blogs. Certain endpoints are limited to authenticated users only. Unit and integration tests were written using Jest and SuperTest.

The frontend is build using React. Logged in users can add new blogs to the site or delete existing blogs. Unit testing of React components was done using Jest and React Testing Library. End-to-end testing of the full stack application was done using Cypress.

### Stack

* HTTP requests using Axios
* REST APIs using Node.js and Express
* MongoDB with Mongoose
* Express middleware for logging, error handling, etc.
* ESLint
* Unit testing and integration testing Express backend with Jest and SuperTest
* User authentication to frontend using JSON web tokens
* Password hasing using bcrypt
* End-to-end testing of the full stack using Cypress

### More Info

* This is the second MERN stack app I've built and is by far the most comprehensive full-stack app I've every build. The previous MERN app I built, a phonebook app, was created during the [FullStackOpen](https://fullstackopen.com/en/) program as I learned Mongo, Express, React, and Node.

* This app was built as a continuation upon the knowledge learned from the first app.

* The [app is hosted on Render](https://bloglist-fvx5.onrender.com/). Note: because the site is running on the free versions of Mongo Atlas and Render, the site may be initially slow to load. 

* The CSS is minimal as my focus wasn't on design or layout.
