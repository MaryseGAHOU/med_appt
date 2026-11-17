StayHealthy - Login API (Task 17)
==================================

Command:

curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maryse.gahou@stayhealthy.example","password":"Stay1234"}'

Output:

{"message":"Login successful.","token":"demo-n1927glc","user":{"id":"uhm3y6g8y","role":"patient","name":"Maryse GAHOU","email":"maryse.gahou@stayhealthy.example","phone":"+1 312 555 0142"}}
