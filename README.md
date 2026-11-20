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

## 4. Software Project Estimation and Metrics

### 4.1 Lines of Code (LOC)

The size of the Sports Tournament Management and Team Performance Analysis System (STMS) is estimated using the Lines of Code (LOC) metric.

| Metric | Value |
|---|---:|
| Total Source Files | 23 |
| Total Non-Empty Lines of Code | 2,648 |
| Project Size | 2.648 KLOC |

**Major Source Files:**

| File | Approximate Lines |
|---|---:|
| App.jsx | 1,555 |
| ApiController.java | 531 |
| app.py + analyze.py | 547 |

*Note: LOC values are approximate and should be verified using the same counting method across all source files.*

### 4.2 Basic COCOMO Estimation

The Basic COCOMO model is used to estimate the development effort and time required for the project.

**Selected Mode:** Organic Mode

The Organic Mode is suitable for small software projects developed by a small team with familiar technologies and requirements.

**COCOMO Parameters:**

| Parameter | Value |
|---|---:|
| a | 2.4 |
| b | 1.05 |
| c | 2.5 |
| d | 0.38 |
| Project Size | 2.648 KLOC |

**Effort Estimation:**

Formula:

E = a × (KLOC)^b

E = 2.4 × (2.648)^1.05

**Estimated Effort = 6.7 Person-Months**

**Development Time:**

Formula:

D = c × (E)^d

D = 2.5 × (6.7)^0.38

**Estimated Development Time ≈ 5.1 Months**

**Average Team Size:**

Formula:

Average Staff = Effort / Development Time

= 6.7 / 5.1

**Average Staff ≈ 1.3 Persons**

*Note: These are theoretical estimates based on the Basic COCOMO model, not actual recorded project effort or duration.*

### 4.3 Function Point Analysis

Function Point Analysis (FPA) is used to estimate the functional size of the software based on its features.

The following values are estimated from the STMS requirements using average complexity weights.

| Function Type | Count | Average Weight | Total |
|---|---:|---:|---:|
| External Inputs (EI) | 13 | 4 | 52 |
| External Outputs (EO) | 3 | 5 | 15 |
| External Inquiries (EQ) | 6 | 4 | 24 |
| Internal Logical Files (ILF) | 9 | 10 | 90 |
| External Interface Files (EIF) | 0 | 7 | 0 |
| **Total UFP** | | | **181** |

Value Adjustment Factor (VAF) = 1.0

Adjusted Function Points:

FP = UFP × VAF

FP = 181 × 1.0

**Estimated Function Points = 181 FP**

*Note: Function point counts are approximate estimates based on the SRS and assumed average complexity. A formal FPA review may produce different values.*

### 4.4 Project Schedule

The following table represents an illustrative eight-week development schedule for STMS.

| Activities | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Requirement Elicitation and SRS | ■ | ■ | | | | | | |
| System Design and Diagrams | | ■ | ■ | | | | | |
| Increment 1 – Master Modules | | | ■ | ■ | | | | |
| Increment 2 – Matches and Results | | | | ■ | ■ | | | |
| Increment 3 – Standings and Reports | | | | | ■ | ■ | | |
| Increment 4 – Analytics | | | | | | ■ | ■ | |
| Testing and Documentation | | | | | | | ■ | ■ |

**Expected Deliverables:**

- SRS Document
- System Architecture, ER and Class Diagrams
- Team, Player and Tournament Modules
- Match Scheduling and Result Management
- Standings and CSV Report
- Analytics Charts
- Testing and Project Documentation

*Note: This is an illustrative project schedule. Update the weeks based on the actual development timeline if necessary.*

### 4.5 Earned Value Analysis (EVA)

Earned Value Analysis is a project management technique used to compare planned work with completed work.

**Illustrative Example:**

Assume the planned project duration is 8 weeks. At the end of Week 6:

- Planned Value (PV) = 6 units
- Earned Value (EV) = 5 units

**Schedule Performance Index (SPI):**

SPI = EV / PV

SPI = 5 / 6

**SPI = 0.83**

**Interpretation:**

- SPI = 1: Project is on schedule.
- SPI > 1: Project is ahead of schedule.
- SPI < 1: Project is behind schedule.

Since the SPI is 0.83, the illustrative project progress is behind the planned schedule.

## Academic Project
Department of Information Technology  
Velalar College of Engineering and Technology  
Academic Year: 2026–2027
