med_appt (StayHealthy) - Login API (Task 17)
=============================================

Command:

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maryse.gahou@stayhealthy.example","password":"Stay1234"}'

Output:

{"message":"Login successful.","authtoken":"dTQ5cTlsNG04OjE3OTQ5MTA3Nzc1NTY","user":{"id":"u49q9l4m8","role":"patient","name":"Maryse GAHOU","email":"maryse.gahou@stayhealthy.example","phone":"+1 312 555 0142"}}
