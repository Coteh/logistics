# logistics

[![CircleCI](https://circleci.com/gh/Coteh/logistics.svg?style=shield)](https://circleci.com/gh/Coteh/logistics)
[![codecov](https://codecov.io/gh/Coteh/logistics/branch/master/graph/badge.svg)](https://codecov.io/gh/Coteh/logistics)

A React application that tracks driver activities. This is an application written for a [Rose Rocket](https://www.roserocket.com/) coding challenge.

## Setup

1. Clone the repository

```
git clone https://github.com/Coteh/logistics.git
```

2. Navigate to project directory, run `yarn install` then `yarn start`, assuming you have [yarn](https://yarnpkg.com/) installed.

## Design

### Architecture

I decided to design this application as a frontend-only application for three reasons:

- Firstly, the requirements stated that persistence and authentication were not required.
- Secondly, there were no other requirements that needed a backend to fulfill.
- Lastly, the requirements made a note to "keep any extra installation requirements and external apps/services to a minimum". With no real hard requirement for a backend, and with the limited amount of time for this coding challenge, I decided to opt for only having a frontend.

Despite only having a frontend, I have designed the frontend in such a way that it can be extended to interact with a backend. The domain service methods, for instance, were written with an async interface, which will allow these methods to easily be replaced with network requests without adversely affecting calling code.

### Tests

I developed the application using a TDD (test-driven development) approach. For the two major features of the application (Dispatcher scheduling and Spreadsheet Report), I first wrote failing test cases, each representing a requirement. Then, I implemented the functionality required to pass the tests. Developing features in this manner gave me confidence that the features will work as expected when hooked up to the UI.

### Code Formatting

I also added [prettier](https://prettier.io/) to my project and added a [husky](https://github.com/typicode/husky) hook to the project which automatically formats code on every commit. I believe that this is an effective way of keeping code clean and consistent throughout the project.

## Features

- Create tasks
- Update tasks
- Delete tasks
- Conflict resolution
  - Remove conflicting tasks when adding/updating tasks
- Generate spreadsheet report as downloadable CSV

For this demo, the application is controlled as a dispatcher user and tasks for three sample users can be viewed.

### Bonus Features

Bonus features and extra improvements are outlined [here](FEATURES.md).
