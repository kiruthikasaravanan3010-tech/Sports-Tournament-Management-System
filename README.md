# Sports Tournament Management System (Scenario 20)

Local MVP: React + Vite frontend, Java 21 + Spring Boot backend, MySQL database, Python analytics.

## Requirements
JDK 21, MySQL 8, Node.js 20+, Python 3.11.

## Step 1 — Database
Open MySQL Workbench, connect to your local MySQL server, open `database/schema.sql`, and execute it.
Then edit `java/src/main/resources/application.properties` and replace `CHANGE_ME` with your MySQL password.

## Step 2 — Backend
Open VS Code terminal:
```powershell
cd "D:\VS code folder\Sports-tournament-Management\java"
.\mvnw.cmd spring-boot:run
```
First run downloads Maven and Java dependencies. Backend: http://localhost:8080/api/health

## Step 3 — Frontend (second terminal)
```powershell
cd "D:\VS code folder\Sports-tournament-Management\frontend"
npm install
npm run dev
```
Open http://localhost:5173

## Demo accounts
admin/admin123, coordinator/coord123, scorer/scorer123, viewer/viewer123, analyst/analyst123.

## Step 4 — Python analytics
Copy `python/.env.example` to `python/.env`, update DB password, then:
```powershell
cd "D:\VS code folder\Sports-tournament-Management\python"
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
py analyze.py
```
Charts and CSV files are written to `outputs/`.

## Main features
Team/player management, tournament creation, match scheduling with conflict checks, result entry, automatic standings (win 3, draw 1, loss 0), CSV match report, Python analysis.

## Important project note
This is a college-project MVP. Demo login is for UI demonstration; API routes are not protected by JWT/role authorization. Do not use real passwords or deploy it for real users without adding production authentication and authorization.
