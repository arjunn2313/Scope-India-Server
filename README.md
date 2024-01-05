# SCOPE INDIA - SERVER
## Description

Aim to provide a platform for students to register, validate their accounts, and access various courses offered by the institute.

## API Endpoints

- `POST /student`: Create a request for new student registration.
- `GET /student/validate`: Validate the token and save it to the student model.
- `POST /student/login`: Student login.
- `GET /student/profile`: Get student details.
- `POST /student/updateimage`: Update student avatar.
- `POST /student/updateprofile`: Update student details.
- `POST /student/updatepassword`: Update password.
- `GET /student/pickedcourse`: Display courses that have been signed in by the student.
- `POST /student/forgotpassword`: Forgot password.

  ## Technologies Used
  - Node.js
  - Express.js
  - Mongoose
  - Bcrypt
  - multer
  - nodemailer
  - nodemon
  - jsonwebtoken
  - body-parser
  - dotenv
  - cors
  ## Installation
  - clone the repository
  1. Server - `git clone https://github.com/arjunn2313/ScopeIndia-server.git`
  2.  Client -  `https://github.com/arjunn2313/SCOPE-INDIA-Client.git`
  - Install the necessary dependencies using `npm install`
  -  Start the  server  `npm start`
   - Server start running on port `http://localhost:6060`.


