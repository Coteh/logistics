# logistics

[![CircleCI](https://circleci.com/gh/Coteh/logistics.svg?style=shield)](https://circleci.com/gh/Coteh/logistics)
[![codecov](https://codecov.io/gh/Coteh/logistics/branch/master/graph/badge.svg)](https://codecov.io/gh/Coteh/logistics)

A React application that tracks driver activities. This is an application written for a [Rose Rocket](https://www.roserocket.com/) coding challenge.

**[Click here to view a live deployment](https://logisticsapp.netlify.app/)**

![Screenshot](screenshot.png 'Preview Screenshot')

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

### Calendar UI

At the start of the project, I searched for libraries such as [react-big-calendar](https://github.com/jquense/react-big-calendar), which provide user-friendly calendar UIs. However, I decided to roll my own for this coding challenge for two reasons:

- These libraries contained many features, much of which I did not need and would introduce complexity.
- They assume that real time values would be used, making them not a good fit for the discrete time values I'm using for this challenge.

I inspected the layout of `react-big-calendar` and noticed that they display events on top of the calendar as absolutely positioned divs, which inspired my implementation of the calendar entries.

Desktop UI for the calendar was prioritized for this challenge. See [Limitations](#Limitations) section for more information.

### Tests

I developed the application using a TDD (test-driven development) approach. For the two major features of the application (Dispatcher scheduling and Spreadsheet Report), I first wrote failing test cases, each representing a requirement. Then, I implemented the functionality required to pass the tests. Developing features in this manner gave me confidence that the features will work as expected when hooked up to the UI.

### Code Formatting

I also added [prettier](https://prettier.io/) to my project and added a [husky](https://github.com/typicode/husky) hook to the project which automatically formats code on every commit. I believe that this is an effective way of keeping code clean and consistent throughout the project.

## Limitations

- Calendar UI not mobile-friendly
  - The calendar is not mobile-friendly. The positioning of the calendar header will be flaky if the main page becomes scrollable.
  - Desktop usability was prioritized for this coding challenge. If I had more time, I would work on improving the mobile layout, especially for the calendar UI.
- Can't schedule between 11:01 PM-12:00 AM
  - The original requirements stated that tasks should not occur across multiple days, and I kept this in mind when I was developing the task scheduling feature. I realized too late that my discrete time system does not account for tasks ending at 12am but not necessarily being a part of the following day. If I had more time, I would update the discrete time system to account for this time period.
