const adminSchema = require("../Models/Admin");
const studentSchema = require("../Models/Student");
const collegeSchema = require("../Models/College");
const secretKey = "collegeManagementSystem";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail", // e.g., 'gmail'
  auth: {
    user: "contact.connectcampus@gmail.com",
    pass: "zagz mqzz alyy mgrf",
  },
});
const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const check = await adminSchema.findOne({ email });
    if (check) {
      res.json({ success: false, message: "Email already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = await new adminSchema({
        username,
        email,
        password: hashedPassword,
      }).save();
      res.json({ success: true, message: "Registered successfully" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminSchema.findOne({ email });
    if (!admin) {
      console.log("Email not found");
      res.json({ success: false, message: "Invalid credential!" });
    } else {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        console.log("Password is incorrect");
        res.json({ success: false, message: "Invalid credential!" });
      } else {
        const token = jwt.sign(admin.id, secretKey);
        res.json({ success: true, message: "Login successfully", token });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const getProfile = async (req, res) => {
  try {
    const admin = await adminSchema.findById(req.admin);
    if (!admin) {
      console.log("Admin not found");
      res.json({ success: false, message: "Admin not found" });
    } else {
      res.json({
        success: true,
        message: "Profile fetched successfully",
        admin,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const getAllColleges = async (req, res) => {
  try {
    const colleges = await collegeSchema.find();
    res.json({
      success: true,
      colleges,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const updateCollegeStatus = async (req, res) => {
  try {
    const college = await collegeSchema.findById(req.params.id);
    if (!college) {
      // console.log("College not found");
      res.json({ success: false, message: "College not found" });
    } else {
      const { status } = req.body;
      const updatedCollege = {};
      updatedCollege.status = status;
      await collegeSchema.findByIdAndUpdate(
        req.params.id,
        { $set: updatedCollege },
        { new: true }
      );
      const emailSubject =
        status == "Active"
          ? "Account has been activated"
          : "Account has been Deactivated";
      const emailMessage =
        status == "Active"
          ? `Dear ${college.collegeName},\n\nYour college account has been marked as Active on our platform. We are excited to have you as a part of our community!`
          : `Dear ${college.collegeName},\n\nYour college account has been marked as Deactivated on our platform!.`;
      const mailOptions = {
        from: "contact.connectcampus@gmail.com",
        to: college?.email,
        subject: emailSubject,
        text: emailMessage,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          // console.log("Email sent: " + info.response);
          res.json({ success: true, message: "Registered successfully" });
        }
      });
      res.json({
        success: true,
        message: "College status updated",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const getAllStudents = async (req, res) => {
  try {
    const students = await studentSchema.find();
    res.json({
      success: true,
      students,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const getReport = async (req, res) => {
  try {
    const students = await studentSchema.find({ status: "Active" });
    const colleges = await collegeSchema.find({ status: "Active" });
    res.json({
      success: true,
      students: students,
      totalStudent: students.length,
      colleges: colleges,
      totalColleges: colleges.length,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const updateStudentStatus = async (req, res) => {
  try {
    const student = await studentSchema.findById(req.params.id);
    if (!student) {
      // console.log("Student not found");
      res.json({ success: false, message: "Student not found" });
    } else {
      const { status } = req.body;
      const updatedStudent = {};
      updatedStudent.status = status;
      await studentSchema.findByIdAndUpdate(
        req.params.id,
        { $set: updatedStudent },
        { new: true }
      );
      res.json({
        success: true,
        message: "Student status updated",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
module.exports = {
  Register,
  Login,
  getProfile,
  getAllColleges,
  getAllStudents,
  updateCollegeStatus,
  updateStudentStatus,
  getReport,
};
