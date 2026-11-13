# Test cases
1. Login with admin/admin123 → successful.
2. Add team with valid details → team is listed.
3. Add player with valid team ID → player is listed.
4. Create tournament → tournament is listed.
5. Schedule two different teams in an available slot → match is saved.
6. Schedule the same team in the same date/time → request is rejected.
7. Record non-negative scores → match becomes COMPLETED.
8. Record a negative score → request is rejected.
9. Load standings → win=3, draw=1, loss=0.
10. Run Python analysis after results exist → CSV and chart files are generated.
