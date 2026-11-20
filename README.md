# Sports Tournament Management and Team Performance Analysis System

## About the Project
The Sports Tournament Management System (STMS) is a web-based application developed to manage college sports tournaments and analyze team performance.

## Technologies Used
- Frontend: React.js, JavaScript, HTML, CSS, Vite
- Backend: Java 21, Spring Boot
- Database: MySQL 8
- Analytics: Python, Flask, Pandas
- Data Visualization: Plotly.js

## Main Features
- Administrator Login and Logout
- Dashboard
- Team Management
- Player Management
- Tournament Management
- Match Scheduling
- Match Result Recording
- Tournament Standings
- Match Report Export (CSV)
- Team Performance Analytics
- Interactive Pie and Bar Charts

## Project Architecture
- React Frontend
- Java Spring Boot REST API
- MySQL Database
- Python Flask Analytics Service

## Project Documentation
- Software Requirements Specification (SRS)
- Use Case Diagram
- Class Diagram
- Overall System Architecture

## Project Structure
- frontend/ – React application
- java/ – Spring Boot backend
- python/ – Python analytics service
- database/ – SQL files
- docs/ – SRS and diagrams
- outputs/ – Application screenshots

## How to Run
1. Start MySQL and configure the database.
2. Start the Java Spring Boot backend.
3. Start the Python Flask analytics service.
4. Start the React frontend using npm run dev.

   
## Project Code Statistics

Line of Code. From the repository README: 23 source files, 2,648 non-empty lines (2.648 KLOC); App.jsx ≈ 1,555, ApiController.java ≈ 531, Flask app.py + analyze.py ≈ 547 lines.
Basic COCOMO (organic mode, a = 2.4, b = 1.05, c = 2.5, d = 0.38). Effort E = 2.4 × (2.648)^1.05 ≈ 6.7 person-months; development time D = 2.5 × (6.7)^0.38 ≈ 5.1 months; average staff = E / D ≈ 1.3 persons. The organic mode fits a small, well-understood application built by a small team.
Function Point (approximate, average complexity, VAF = 1.0). External inputs 13 × 4 = 52; external outputs 3 × 5 = 15; external inquiries 6 × 4 = 24; internal logical files 9 × 10 = 90; external interface files 0 → UFP ≈ 181 FP. Counts are estimated from the SRS (CRUD operations, standings/CSV/analytics outputs, dashboard and list queries, nine tables).
4.3 Project schedule
Task	W1	W2	W3	W4	W5	W6	W7	W8	Output
Elicitation and SRS	■	■							SRS
Design (architecture, ER, class)		■	■						Diagrams
Increment 1 – masters			■	■					Code
Increment 2 – matches, results				■	■				Code
Increment 3 – standings, report					■	■			Code
Increment 4 – analytics						■	■		Charts
Testing and documentation							■	■	Report
Earned Value (illustration). If the planned budget at completion is 8 weeks and 6 weeks of work are planned for week 6 with 5 completed, then PV = 6, EV = 5, SPI = EV/PV = 0.83 (behind schedule) – tracked the same way each week.



## Academic Project
Department of Information Technology  
Velalar College of Engineering and Technology  
Academic Year: 2026–2027
