# FlowUrl - Full-Stack URL Shortener & Analytics

A lightweight, production-ready URL shortener platform built using the MERN stack. Users can submit long, complex URLs to receive highly compressed, URL-safe short-code aliases, alongside persistent system tracking to capture performance usage metrics.

## Tech Stack
- **Frontend:** React (Vite), Axios, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose Object Mapping)
- **Code Generation:** Nanoid (Secure, URL-safe random string generator)

## Features
- **Instant Generation:** Converts long destinations into unique 6-character aliases.
- **HTTP 302 Redirection Engine:** Wildcard backend interception routing to parse codes and forward users smoothly.
- **Analytics Counter:** Increments and saves a click database metrics counter on every forward request event.
- **Input Validation:** Strict regex matching preventing broken paths or malformed link payloads.