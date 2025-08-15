# MiniTaskHub

A full-stack task management app built with:

- ASP.NET Core 9 Web API (`MiniTaskHub.Api`)
- Angular 19 frontend (`MiniTaskHub.Web`)

## Getting Started

### Backend
- Navigate to `MiniTaskHub.Api`
- Run: `dotnet run`

### Frontend
- Navigate to `MiniTaskHub.Web`
- Run: `npm install && ng serve`

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
