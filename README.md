# MiniTaskHub

A full-stack task management app built with:

- ASP.NET Core 9 Web API (`MiniTaskHub.Api`)
- Angular 19 frontend (`MiniTaskHub.Web`)

## Folder Structure
```
MiniTaskHub/ 
├── MiniTaskHub.sln # Solution file 
├── MiniTaskHub.Api/ # .NET Web API
├── MiniTaskHub.Core/ # domain business
├── MiniTaskHub.Infrastructure/ # Logic implementation, db connection 
└── MiniTaskHub.Web/ # Angular frontend
└── MiniTaskHub.Tests/ # Unit Tests
```

## Getting Started

### Backend
- Navigate to `MiniTaskHub.Api`
- Run: `dotnet run`

### Frontend
- Navigate to `MiniTaskHub.Web`
- Run: `npm install && ng serve`

## MiniTaskHub.Web Details

This project is the web frontend for MiniTaskHub, a simple task management application. It is built with Angular and provides a user-friendly interface for managing tasks.

### Features

-   **Authentication:** Users can register and log in to the application.
-   **Task Management:** Authenticated users can create, view, update, and delete tasks.
-   **Task Filtering and Sorting:** Users can filter and sort their tasks based on different criteria.

### Technologies

-   [Angular](https://angular.io/): A platform for building mobile and desktop web applications.
-   [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript.
-   [SCSS](https://sass-lang.com/): A preprocessor scripting language that is interpreted or compiled into Cascading Style Sheets (CSS).

### Project Structure

The project is organized into the following main directories:

-   `src/app/core`: Contains core services (e.g., `AuthService`, `TaskService`), interceptors, and guards.
-   `src/app/features`: Contains the main features of the application, such as `auth` and `tasks`.
-   `src/app/layout`: Contains layout components like the header, footer, and main layout.
-   `src/app/shared`: Contains shared components, directives, and pipes that are used across multiple features.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).