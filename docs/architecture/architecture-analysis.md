# Architecture Analysis Report

VoiceThread · Sprint 2 · Team deliverable (B1)

## 1. What the architecture must support

VoiceThread is an application which allows users to post voice messages and reply to them using voice responses so that the discussion forms a tree. The system architecture should satisfy the requirements of the application listed in `docs/requirements.md`.

| Driver | Source | What it means for the architecture |
|---|---|---|
All modifications are validated by teh server| NFR-04, FR-11 | Logins and ownership are validated before any modification or deletion. |
| Server-side validations | FR-10 | Duration (30 seconds to 5 minutes), file size (up to 10MB) and format (WebM, Ogg, MP4) are validated even though the client browser is not performing the validation. |
| Fast loading of a whole thread | FR-15, NFR-05 | Threaded tree is loaded in one query, thread containing 100 replies loads in less than 3 seconds on the demo laptop. |
| Saves are not partial | NFR-06, FR-24 | Audio file and corresponding row in the database table will be saved as a couple, without being partially saved. |
| Easy installation and maintenance | NFR-08 | New team member is installing and running the app according to the README file in less than 15 minutes. |
| Constraints of project | Course | Demo project in local environment with just one laptop, zero budget, 6 students and one semester. |

## 2. The styles compared

We compared three styles at the level of the whole application.

### 2.1 Layered client-server

The Three-Tier Client-Server Architecture divides systems into presentation, application, and data layers, increasing scalability, maintainability, and efficiency. By separating the concerns, this model optimizes resource management and allows for independent scaling and updates, making it a popular choice for complex distributed systems.


### 2.2 MVC

Over the last few years, websites have shifted from simple HTML pages with a bit of CSS to incredibly complex applications with thousands of developers working on them at the same time. To work with these complex web applications developers use different design patterns to lay out their projects, to make the code less complex and easier to work with. The most popular of these patterns is MVC also known as Model View Controller.

### 2.3 Microservices

Microservices is an architecture where an application is divided into small, independent services that communicate over a network. Each service handles a specific function and can be developed and deployed separately.

Services can be built using different programming languages and frameworks.
Each microservice is loosely coupled and can be developed, deployed, and scaled independently.

