# Frontend Coding Challenge: Work & Travel Job Finder

## Overview
You are a frontend developer at Work and Travel Guide, tasked to build a job search interface that will be integrated into app.workandtravelguide.org, helping international workers find employment opportunities in Australia.

## The Goal
Create an intuitive application where users can:
- Browse available job opportunities in an intuitive list view on the left, with a visualization of the map of opportunities on the right side
- Have all the information available that they require for contacting them at a glance
- Filter companies by location and industry
- Be able to mark employers that they've already contacted (does not need to be stored permanent state. It's fine if it resets when I reload the page)

## Provided Data Structure
```javascript
const company = {
  id: 'job-123',
  email: 'hr@surfshop.com',
  state: 'NSW',
  firstName: 'Sarah',
  lastName: 'Johnson',
  phoneNumber: '+61535373443',
  companyName: 'Pacific Surf Shop',
  address: '123 Campbell Parade, Bondi Beach NSW 2026',
  latitude: -33.8915,
  longitude: 151.2767,
  industry: 'Retail & Tourism'
};
```

You'll be provided with a JSON file containing job opportunities across Australia.

## Technical Stack
- React with TypeScript
- Tailwind CSS
- Openstreetmap library
- Vite

## Your own ideas
If you have more ideas beyond this spec to make the functionality better for users, please feel free to implement that!

## Submission Requirements
- GitHub repository
- Brief README with setup instructions

## Copyright / License
We will not be copying any of the code snippets you are developing here into our real production environment without prior consent from you.
Equally, the content from this coding challenge should not be distributed from you.

Good luck!