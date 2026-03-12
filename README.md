# StudyFlow

StudyFlow is a simple study tracker web application designed to help students keep track of assignments and upcoming deadlines. Users can add assignments with a class name and due date, mark them as complete, and remove them once finished. Assignments are automatically sorted by due date so the most urgent work appears first.

The application stores all data locally in the browser using localStorage, allowing tasks to persist even after the page is refreshed.

## Live Demo

https://studyflowmidtermsite.netlify.app

## Technologies Used

- HTML
- CSS
- JavaScript
- localStorage (for persistent data)
- Vite (local development server)
- Netlify (deployment)
- Claude Code (AI-assisted development)

## Features

- Add assignments with name, class, and due date
- Display assignments in a dynamic task list
- Mark assignments complete or incomplete
- Delete assignments
- Automatically sort assignments by due date
- Persist assignments using browser localStorage

## Setup Instructions

1. Clone the repository:

git clone https://github.com/sburbank22/studyflow.git

2. Navigate into the project folder:

cd studyflow

3. Install dependencies:

npm install

4. Start the development server:

npm run dev

5. Open the local development URL shown in the terminal (usually http://localhost:5173).

## Known Bugs / Limitations

- Tasks are stored locally in the browser and will not sync across devices.
- If localStorage is manually cleared in the browser, all saved assignments will be lost.
- The application currently does not support editing existing tasks, only completing or deleting them.

## What I Learned

While building StudyFlow I learned how to use AI tools like Claude Code as part of the development process. Instead of asking AI to generate a full application at once, I used it iteratively to plan features, implement functionality, and debug issues as they appeared. For example, Claude helped me diagnose a problem where the form kept refreshing because the module script was not loading when opening the file locally. Through this process I learned how to guide AI with clear prompts, evaluate its suggestions, and combine them with my own decisions to build a working application.
