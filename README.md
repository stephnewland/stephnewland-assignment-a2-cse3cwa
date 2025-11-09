# Assignment 1 & 2 – CSE3CWA/CSE5006

## Student Details

| Detail             | Value         |
| :----------------- | :------------ |
| **Name**           | Steph Newland |
| **Student Number** | 21993608      |

---

## Overview

This project is a **Next.js** web application designed to generate and provide **standalone HTML5 + JavaScript** code for accessible interactive components, primarily for deployment within the **Moodle LMS** environment.

Building upon the initial front-end architecture from Assignment 1, **Assignment 2** pivots to implement the **Court Room** feature, integrating **backend services** with **APIs**, a **database**, **Dockerization**, and comprehensive **testing** and **instrumentation**. The core application remains dedicated to generating copy-pasteable HTML + JS code in the Tab Generator.

---

## Features Implemented

### Assignment 1: Front-End Architecture and Tab Generator

- **Navigation:** Accessible Header with responsive Hamburger menu and dynamic Breadcrumbs.
- **Theming:** Dark/Light Theme Toggle that persists user preference.
- **Homepage:** Displays the last visited page via cookies.
- **About Page:** Contains student details and an embedded tutorial video (`demo.mp4`) to use the Code/Tab Generator.
- **Tab Generator:** Interactive Component editor that generates standalone **HTML5 + inline CSS + JS** code for accessible tabbed interfaces. The generated code is copy-pastable and runs in a blank HTML file (`Hello.html`).
- **Accessibility:** Implemented per accessibility standards (ARIA roles, keyboard navigation, focus outlines for buttons, links, and form elements).
- **Cookie Tracking:** Tracks the last visited page/menu item for navigation persistence.

| Feature              | Implemented in File(s)                                                 |
| :------------------- | :--------------------------------------------------------------------- |
| Sticky Header        | `Header.tsx` + `RootLayout` padding for main content                   |
| Sticky Breadcrumbs   | `Breadcrumbs.tsx`                                                      |
| Theme Toggle         | `Header.tsx`                                                           |
| Code Generator       | `CodeGenerator.tsx` + `CodeGeneratorWrapper.tsx`                       |
| Tab Generator        | `tabs/page.tsx`                                                        |
| Placeholder Pages    | `coding-races/page.tsx`, `court-room/page.tsx`, `escape-room/page.tsx` |
| Footer               | `Footer.tsx`                                                           |
| ARIA / Accessibility | `Header.tsx`, `Breadcrumbs.tsx`, `Tab generator` components            |
| Cookie Tracking      | `Header.tsx` (last tab), `Tracker.tsx`                                 |
| Mobile Menu          | `Header.tsx` mobile toggle (`HamburgerMenu.tsx`)                       |

### Assignment 2: Court Room Scenario, Backend, and Deployment

- **Court Room Scenario:** Implemented the Court Room feature: a coding/debugging challenge with a manual timer, a background image, and multi-stage tasks.
- **Real-time Messaging:** Simulated external pressures (**Boss, Family, Agile** messages) appear every 20-30 seconds.
- **Laws/Fines Simulation:** Critical, ignored messages (e.g., "fix alt in img1," "fix input validation") trigger a **Court Room fine/penalty** for breaking simulated laws (e.g., **Disability Act, Laws of Tort**).
- **API Integration:** Added **CRUD functionality** via APIs to manage application data (e.g., storing generated code or scenario progress).
- **Database:** Integrated a database (e.g., **Prisma/Sequelize**) to persist generated HTML output and application state using a **Save Button**.
- **Dockerization:** Application is **Dockerized** to ensure consistent deployment and execution.
- **Automated Testing:** Added **2x Tests** to auto-generate and check the HTML output for correctness (e.g., Playwright tests).
- **Instrumentation:** Application is **instrumented** for observability, allowing monitoring of performance and behavior during test runs.
- **Cloud Deployment:** Application is deployed to the **Cloud**.
- **Lambda Function:** Added a Lambda function (or equivalent serverless function) to dynamically create pages based on the stored HTML output.

| Feature                 | Implemented in File(s) (Suggested)                                           |
| :---------------------- | :--------------------------------------------------------------------------- |
| Court Room Interface    | `court-room/page.tsx` + `components/CourtRoomScenario.tsx`                   |
| Scenario Timer          | `components/Timer.tsx` integrated into the scenario component                |
| External Message Queue  | `lib/message-service.ts` + `components/MessageDisplay.tsx`                   |
| Laws/Fines Logic        | `lib/scenario-logic.ts` handles message ignored and fine activation          |
| APIs for CRUD           | `app/api/data/[...route]/route.ts` (Next.js App Router)                      |
| Database Integration    | `prisma/schema.prisma`, `lib/db.ts` (connection/query logic)                 |
| Output Save Button      | `components/SaveButton.tsx` integrates with API/Database                     |
| Docker Configuration    | `Dockerfile`, `.dockerignore`, `docker-compose.yml` (optional for DB)        |
| Automated Testing       | `tests/courtroom.spec.ts`, `tests/output.spec.ts` (e.g., Playwright)         |
| App Instrumentation     | `instrumentation.ts` (Next.js file), monitoring config                       |
| Cloud Deployment Config | Cloud configuration files (Rendor.com settings, `aws-serverless-config.yml`) |
| Lambda Function         | `serverless/generate-page.js` or `app/api/lambda/route.ts`                   |
| Ethical Survey Tracking | `components/FeedbackTracker.tsx`                                             |

---

## References Used

### IEEE References

- P. Ballard, _Sams Teach Yourself JavaScript in 24 Hours_. Indianapolis, IN, USA: Sams Publishing, 2020.
- C. Gackenheimer, _Introduction to React_. Berkeley, CA, USA: Apress, 2015.
- D. Matuszek, _Quick JavaScript_. Boca Raton, FL, USA: Chapman and Hall/CRC, 2023.
- M. Simon, _JavaScript for Web Developers: Understanding the Basics_. Berkeley, CA, USA: Apress, 2023.
- S. Hoque, _Full-Stack React Projects: Learn MERN stack development by building modern web apps using MongoDB, Express, React, and Node.js_. 2nd ed. Birmingham, UK: Packt Publishing, 2020.
- Jest Documentation, "Jest." Available: https://devdocs.io/jest/. [Accessed: Oct. 30, 2025].
- GeeksforGeeks, "JavaScript | Testing with Jest." Available: https://www.geeksforgeeks.org/javascript/testing-with-jest/. [Accessed: Oct. 30, 2025].
- Jest Documentation, "Getting Started." Available: https://jestjs.io/docs/getting-started. [Accessed: Oct. 30, 2025].
- BrowserStack, "Unit Testing of React Apps Using Jest Guide." Available: https://www.browserstack.com/guide/unit-testing-of-react-apps-using-jest. [Accessed: Oct. 30, 2025].

### AI Generated Content

- Microsoft CoPilot helped suggest what content was required to go in this README file.

### NOTE

- This project failedto merge and became corrupted at https://github.com/stephnewland/assignment-a1-p1-cse3cwa so was restarted here.
- Render.com was used for deployment as I could not fix the Vercel deployment error caused by using babel within my Jest testing services.
