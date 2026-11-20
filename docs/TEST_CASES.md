
# TEST CASE DOCUMENT

## Project Title
Sports Tournament Management and Team Performance Analysis System (STMS)

**Institution:** Velalar College of Engineering and Technology  
**Department:** Information Technology  
**Class:** 25IT3A  
**Academic Year:** 2026-2027

---

## 1. Introduction

Test Case Documentation is used to verify whether the Sports Tournament Management System works correctly. It helps to identify errors and check the functionality of each module.

## 2. Objective

- To verify the login functionality.
- To test team and player management.
- To verify tournament creation and match scheduling.
- To test match result entry and standings.
- To verify analytics charts and reports.
- To identify errors in the application.

## 3. Testing Environment

| Component | Technology |
|---|---|
| Frontend | React.js |
| Backend | Java, Spring Boot |
| Database | MySQL |
| Analytics | Python, Flask |
| Data Processing | Pandas |
| Charts | Plotly |
| Browser | Google Chrome |

---

## 4. Test Cases

### Module 1: Login Testing

| Test Case ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC01 | Valid Login | User should enter dashboard | Dashboard opened successfully | Pass |
| TC02 | Invalid Login | Login should be rejected | Error message displayed | Pass |

### Module 2: Dashboard Testing

| Test Case ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC03 | View Dashboard | Dashboard should display summary | Dashboard displayed correctly | Pass |
| TC04 | Verify Count | Correct counts should be displayed | Counts displayed correctly | Pass |

### Module 3: Team Management Testing

| Test Case ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC05 | Add Team | New team should be added | Team added successfully | Pass |
| TC06 | View Team | Team details should be displayed | Team details displayed | Pass |
| TC07 | Update Team | Team details should be updated | Updated details displayed | Pass |
| TC08 | Delete Team | Selected team should be deleted | Team deletion failed due to database restriction | Fail |

### Module 4: Player Management Testing

| Test Case ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC09 | Add Player | Player should be added | Player added successfully | Pass |
| TC10 | View Player | Player details should be displayed | Player details displayed | Pass |
| TC11 | Update Player | Player details should be updated | Updated details displayed | Pass |

### Module 5: Tournament Management Testing

| Test Case ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC12 | Create League Tournament | League tournament should be created | Tournament created successfully | Pass |
| TC13 | Create Knockout Tournament | Knockout tournament should be created | Tournament created successfully | Pass |
| TC14 | View Tournament | Tournament details should be displayed | Tournament details displayed | Pass |

### Module 6: Match Management Testing

| Test Case ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC15 | Schedule Match | Match should be scheduled | Match scheduled successfully | Pass |
| TC16 | View Match | Match details should be displayed | Match details displayed | Pass |

### Module 7: Result and Standings Testing

| Test Case ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC17 | Enter Match Result | Result should be saved | Result saved successfully | Pass |
| TC18 | View Standings | Points table should be updated | Points table not updated correctly | Fail |

### Module 8: Report Testing

| Test Case ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC19 | Export Match Fixtures | CSV file should be downloaded | CSV downloaded successfully | Pass |

### Module 9: Analytics Testing

| Test Case ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC20 | View Analytics | Analytics should be displayed | Analytics displayed successfully | Pass |
| TC21 | Team Points Distribution | Points chart should be displayed | Chart displayed correctly | Pass |
| TC22 | Match Results Chart | Results chart should be displayed | Chart displayed correctly | Pass |
| TC23 | Team Performance Comparison | Performance chart should be displayed | Chart displayed correctly | Pass |

### Module 10: Integration and Validation Testing

| Test Case ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC24 | Frontend-Backend Connection | Data should be retrieved | Data retrieved successfully | Pass |
| TC25 | Analytics Service Connection | Analytics data should be retrieved | Analytics data retrieved successfully | Pass |
| TC26 | Empty Form Validation | Empty form should be rejected | Empty form accepted without proper validation | Fail |

---

## 5. Test Execution Summary

| Total Test Cases | Passed | Failed |
|---|---|---|
| 26 | 23 | 3 |

## 6. Failed Test Cases

1. **TC08 - Delete Team:** Team deletion failed due to database restriction.
2. **TC18 - View Standings:** Points table was not updated correctly.
3. **TC26 - Empty Form Validation:** Empty form was accepted without proper validation.

## 7. Conclusion

The test cases are designed to verify the main functionalities of the Sports Tournament Management and Team Performance Analysis System. The sample test results show 23 passed test cases and 3 failed test cases. The identified issues should be checked and corrected to improve the system.
