# StudyFlow

**Live Site:** https://studyflowmidtermsite.netlify.app  
**GitHub Repo:** https://github.com/sburbank22/studyflow  

---

## Overview

StudyFlow is a responsive study planner web application designed to help students organize and track assignments and deadlines. Users can create, manage, and complete tasks while viewing upcoming work in a clean, intuitive interface.

The application stores all data locally using localStorage, allowing tasks to persist even after refreshing the page.

---

## Features

- Add, edit, and delete assignments  
- Mark assignments as complete or incomplete  
- Persistent data using localStorage  
- Sort assignments by priority (High, Medium, Low) and due date  
- Dynamic “This Week” section showing upcoming assignments  
- Task progress summary (total, completed, remaining)  
- Responsive design for desktop and mobile  

---

## Technologies Used

- HTML  
- CSS  
- JavaScript  
- localStorage  
- Vite (local development server)  
- Netlify (deployment)  
- Claude Code (AI-assisted development)  

---

## Screenshots

<img width="1295" height="764" alt="Screenshot 2026-04-25 at 5 27 42 PM" src="https://github.com/user-attachments/assets/85575e34-34bf-410b-9e64-98a50c04c7e7" />


<img width="1294" height="762" alt="Screenshot 2026-04-25 at 5 32 48 PM" src="https://github.com/user-attachments/assets/1b4a24e0-036f-410c-b1fe-55cdd59fcfca" />

---


## Setup Instructions

Clone the repository:

git clone https://github.com/sburbank22/studyflow.git

Navigate into the project folder:

cd studyflow

Install dependencies:

npm install

Start the development server:

npm run dev

Open the local development URL shown in the terminal (usually http://localhost:5173).

---

## Known Limitations

- Tasks are stored locally and do not sync across devices  
- Clearing browser storage will remove saved assignments  
- Does not currently include user accounts or cloud storage  

---

## What I Learned

While building StudyFlow, I strengthened my skills in JavaScript, particularly with DOM manipulation, event handling, and data persistence using localStorage. I also learned how to debug issues in a real development environment, such as resolving problems with module scripts and local development servers.

This project also helped me better understand how to use AI tools like Claude Code effectively. Instead of relying on AI to generate everything at once, I used it iteratively to plan features, implement functionality, and troubleshoot issues, while still making my own decisions and adjustments throughout the process.

---

## What I Would Improve

If I continued developing StudyFlow, I would:

- Add user authentication for saving tasks across devices  
- Replace localStorage with a backend database  
- Add filtering and categorization for assignments  
- Improve the UI with more interactive elements and animations  

---

## Project Notes

This project was developed as part of an AI coding course, focusing on building, refining, and polishing a real-world application while incorporating AI-assisted development workflows.
