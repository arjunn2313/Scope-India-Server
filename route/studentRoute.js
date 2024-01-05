const router = require("express").Router();
const profile = require("../common/middleware");
const {
  register,
  validate,
  studentLogin,
  studentProfile,
  savetemPass,
  generatePassword,
} = require("../controllers/studentContoller");
const studentModel = require("../model/studentSchema");
const multer = require("multer");
const verifyEmail = require("../utils/emailVerification");
const upload = multer({ storage: profile });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyUser = require("../common/studentVerification");
const { Router } = require("express");
const courseModel = require("../model/courseSchema");
const nodemailer = require("nodemailer");

// CREATE
router.post("/", upload.single("image"), register);

// validate
router.get("/validate", validate);

// LOGIN

router.post("/login", studentLogin);

//  GET PROFILE

router.get("/profile", verifyUser, studentProfile);

//  UPDATE IMAGE

router.post(
  "/updateimage",
  verifyUser,
  upload.single("image"),
  async (req, res) => {
    const image = req.file ? "/uploads/" + req.file.filename : null;

    try {
      await studentModel.findOneAndUpdate(
        { _id: req.user.id },
        { $set: { image } },
        { new: true }
      );

      res.json({
        status: true,
        message: "Updated",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "INTERNAL SERVER ERROR",
      });
    }
  }
);

//  UPDATE PROFILE

router.post("/updateprofile", verifyUser, async (req, res) => {
  const { ...details } = req.body;

  try {
    const updatedUser = await studentModel.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { ...details } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.json({
      status: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "INTERNAL SERVER ERROR",
    });
  }
});

//UPDATE PASSWORD

router.post("/updatepassword", verifyUser, async (req, res) => {
  try {
    let { currentpassword, newpassword } = req.body;

    const user = await studentModel.findOne({ _id: req.user.id });

    if (!user) {
      return res.json({
        status: false,
        message: "USER NOT FOUND",
      });
    }

    const passMatch = await bcrypt.compare(currentpassword, user.password);

    if (passMatch) {
      const hashpassword = await bcrypt.hash(newpassword, 10);

      await studentModel.findByIdAndUpdate(req.user.id, {
        password: hashpassword,
      });

      return res.status(200).json({
        status: true,
        message: "PASSWORD UPDATED",
      });
    } else {
      return res.json({
        status: false,
        message: "Current Password is incorrect",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// signup to students

router.post("/pickedcourse/:id", verifyUser, async (req, res) => {
  try {
    const courseId = req.params.id;
    console.log(courseId);

    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({
        status: false,
        message: "Course not found",
      });
    }

    const updatedStudent = await studentModel.findByIdAndUpdate(
      req.user.id,
      {
        $push: { courseid: course },
      },
      { new: true }
    );

    res.json({
      status: true,
      result: updatedStudent.courseid,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

//Fetch signed in course

router.get("/pickedcourse", verifyUser, async (req, res) => {
  try {
    const student = await studentModel
      .findById(req.user.id)
      .populate("courseid");

    if (!student) {
      res.status(404).json({
        status: false,
        message: "user not found",
      });
    }

    const courseDetails = student.courseid;

    res.json({
      status: true,
      result: courseDetails,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// FORGOT PASSWORD

router.post("/forgotpassword", generatePassword);

// SAVE VALIDATE & TEMPORARY PASSWORD

router.get("/forgotpassword", savetemPass);

module.exports = router;
