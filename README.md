# Real-time Trivia Game

This is a test project part of the FanFest interview process and it's a simple real-time trivia game with matchmaking using web sockets for real-time communication. It consists of a (Express.js) server and a (Vue.js) web client.

It's (purposefully) partially implemented and it's up to you to complete it. The project requirements are listed below.

## Project structure

The project is a PNPM monorepo with the following structure:

```plaintext
. (root)
├── apps
│   ├── server (Express.js)
│   ├── web (Vue.js)
├── packages
│   ├── realtime (shared code, Socket.io interface, API types)
```

### Server

The server app follows a layered convention to have distinct layers: routes, controllers and services. For persistency it uses Prisma currently using the SQLite database adapter.

It has the following structure (resembling what our projects look like at FanFest):

```plaintext
apps/server
├── prisma
│   ├── schema.prisma (no need to modify)
│   ├── seed.ts (db seed file)
├── src
│   ├── constants
│   ├── middlewares (global middlewares)
│   ├── routes (routes and co-located controllers)
│   ├── services (business logic)
│   ├── utils
│   ├── app.ts (Express app)
│   ├── server.ts (entry point)
```

### Web

The web app is a Vue.js app with the following (overall) structure:

```plaintext
apps/web
├── public
├── src
│   ├── realtime (shared code for Socket.io)
│   ├── components
│   ├── views (pages)
│   ├── App.vue
│   ├── main.ts (entry point)
```

Here's where you'd need to spend most of the time at the moment.

### Realtime

The shared package contains the Socket.io interface and API types. It currently doesn't have much but should host any business logic that needs to be shared between the server and the web app as well as host the Socket.io interface types.

## Project requirements

The project should be completed in around 1-2 hours and should be built from this base.

Key features:

- Users: Missing UI
  - Persistent data: username (primary key), password.
  - Users should be able to authenticate with their username/password.
  - Users should be able to sign up.
  - A user should be necessary to play a match.
- Questions: Missing UI
  - Persistent data: question, options.
  - A user should be able to create a question (with its options)
- Match: Missing UI and business logic
  - Persistent data: winner (nullable for matches that ended in draw).
  - BL:
    - There should be a matchmaking system that matches users based on their availability.
      - If the minimum users required for a match are available, a match should start.
    - Each match should have 5 questions (assigned randomly when the match starts from the questions db model).
    - Each match should allow a maximum of 2 players.
    - Each match should have its own SocketIo ”room”.
    - Whenever a player disconnects the match ends and whoever scored the most wins.

## Project intent

The intent of this project is to see 1) how you approach a project with existing conventions and adapt to it and 2) how you approach a system that requires real-time communication given simple requirements.

You should focus on the key features. The UI must be functional and simple but doesn't need to be polished (you have Tailwind at your disposition for agility). We won't be assessing test coverage but you should aim to write the components following best-practices to enable testability.

## Installation and running

The project uses PNPM as the package manager. You can install it globally with:

```bash
npm install -g pnpm
```

Then you can install the dependencies by running (from the root of the project):

```bash
pnpm install
```

Then you can setup the environment files by copying the `.env.example` files to `.env` in both the `apps/server` and `apps/web` directories (feel free to modify them as needed).

To run both the server and the web app you can run (either from the root which will run both apps simultaneously or from the respective app directory to run them individually):

```bash
pnpm dev
```

## Submission

You should fork this repository and submit your solution as a pull request. You can also submit a zip file with the solution if you prefer and email rowin@playvici.com, adam@playvici.com and ahodzic@playvici.com.

Good luck!
