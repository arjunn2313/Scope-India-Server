const studentModel = require("../model/studentSchema");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
// const { transporter } = require('../utils/emailVerification');
require("dotenv").config();
const bcrypt = require("bcrypt");

//REGISTER

const register = async (req, res) => {
  try {
    const { email, ...details } = req.body;

    const image = req.file ? "/uploads/" + req.file.filename : null;
    console.log(image);

    const existingUser = await studentModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: "User already exists",
      });
    }

    const password = `student@${email}`;

    // Generate Token
    const token = jwt.sign(
      { ...details, email, image, password },
      process.env.regtoken,
      { expiresIn: "1h" }
    );
    console.log({ ...details, email, image });

    // Send Confirmation Mail

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.epass,
      },
    });

    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: "Confirmation mail from scope India",
      html: `Click the following link to validate your email: http://localhost:6060/student/validate?token=${token} <br/>
      TEMPORARY PASSWORD - ${password}
      `,
    };

    try {
      const sentMailInfo = await transporter.sendMail(mailOptions);
      console.log("Email sent:", sentMailInfo.response);

      res.status(200).json({
        status: true,
        message:
          "Validation link sent to the email. Please check your inbox. A temporary password has been sent as well. Reset your password after logging in",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({
        status: false,
        message: "Error sending email",
      });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// VALIDATE

const validate = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.regtoken);
    const image = await decoded.image;
    const password = await decoded.password;
    const hashpassword = await bcrypt.hash(password, 10);
    console.log(image);

    await studentModel.create({
      ...decoded,
      image,
      isVerified: true,
      password: hashpassword,
    });

    res.redirect("http://localhost:3000/login");
  } catch (error) {
    console.error("Error during email validation:", error);
    res.redirect("http://localhost:3000/error");
  }
};

//LOGIN

const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await studentModel.findOne({ email });

    if (!user) {
      // User not found
      return res.json({
        status: true,
        message: "User not found",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.login,
        { expiresIn: "1d" }
      );

      return res.json({
        status: true,
        message: "Authentication success",
        token: token,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Password mismatch",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
    });
  }
};

//GET PROFILE

const studentProfile = (req, res) => {
  studentModel
    .findOne({ _id: req.user.id })
    .then((data) => {
      if (data) {
        res.status(200).json({
          status: true,
          data: {
            id: data._id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            dob: data.dob,
            phone: data.phone,
            gender: data.gender,
            country: data.country,
            state: data.state,
            city: data.city,
            image: data.image,
            courseid: data.courseid,
            isVerified: data.isVerified,
          },
        });
      }
    })
    .catch((error) => {
      res.status(403).json({
        status: true,
        message: error,
      });
    });
};

// GENERATE TEMPORARY PASSWORD

const generatePassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await studentModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "USER NOT FOUND",
      });
    }

    console.log(user._id);
    const id = user._id;

    const password = `reSEt1${email}`;

    const token = jwt.sign({ id, password }, process.env.regtoken, {
      expiresIn: "1h",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.epass,
      },
    });

    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: "Reset password from scope India",
      html: `Click the following link to login using temporary password: http://localhost:6060/student/forgotpassword?token=${token} <br/>
      TEMPORARY PASSWORD - ${password}`,
    };

    try {
      const sentMailInfo = await transporter.sendMail(mailOptions);
      console.log("Email sent:", sentMailInfo.response);
      return res.status(200).json({
        status: true,
        message:
          "A temporary password has been sent. Reset your password after logging in",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({
        status: false,
        message: "Error sending email",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// save temporary password

const savetemPass = async (req, res) => {
  let { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.regtoken);
    const id = await decoded.id;
    const password = await decoded.password;
    const hashpassword = await bcrypt.hash(password, 10);

    await studentModel.findByIdAndUpdate(id, { password: hashpassword });

    res.redirect("http://localhost:3000/login");
  } catch (error) {
    console.error("Error durinng login", error);
    res.redirect("http://localhost:3000/error");
  }
};
module.exports = {
  register,
  validate,
  studentLogin,
  studentProfile,
  savetemPass,
  generatePassword,
};
