const collegeSchema = require("../Models/College");
const studentSchema = require("../Models/Student");
const eventSchema = require("../Models/Events");
const blogSchema = require("../Models/Blog");
const competitionSchema = require("../Models/Competition");
const registrationSchema = require("../Models/Registrations");
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
    const {
      collegeName,
      collegePlace,
      collegeWebsite,
      collegeContactNumber,
      username,
      email,
      password,
    } = req.body;
    const check = await collegeSchema.findOne({ email });
    if (check) {
      res.json({ success: false, message: "Email already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newCollege = await new collegeSchema({
        collegeName,
        collegePlace,
        collegeWebsite,
        collegeContactNumber,
        username,
        email,
        password: hashedPassword,
        status: "Inactive",
      }).save();
      const mailOptions = {
        from: "contact.connectcampus@gmail.com",
        to: email,
        subject: "College Registration Confirmation", // Subject line
        text: `Dear ${collegeName}, your college has been registered successfully on our website. Thank you for joining us!`, // Plain text body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          // console.log("Email sent: " + info.response);
          res.json({ success: true, message: "Registered successfully" });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const college = await collegeSchema.findOne({ email });
    if (!college) {
      // console.log("Email not found");
      res.json({ success: false, message: "Invalid credential!" });
    } else {
      const isMatch = await bcrypt.compare(password, college.password);
      if (!isMatch) {
        // console.log("Password is incorrect");
        res.json({ success: false, message: "Invalid credential!" });
      } else {
        if (college.status == "Active") {
          const token = jwt.sign(college.id, secretKey);
          res.json({ success: true, message: "Login successfully", token });
        } else {
          res.json({ success: false, message: "Account not verified" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const getProfile = async (req, res) => {
  try {
    const college = await collegeSchema.findById(req.college);
    if (!college) {
      console.log("College not found");
      res.json({ success: false, message: "College not found" });
    } else {
      res.json({
        success: true,
        message: "Profile fetched successfully",
        college,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const getAllStudentsToCollege = async (req, res) => {
  try {
    const students = await studentSchema.find({ college: req.college });
    res.json({
      success: true,
      students,
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
      if (status == "Blocked") {
        updatedStudent.blockedBy = "College";
      } else {
        updatedStudent.blockedBy = "";
      }
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
const createEvent = async (req, res) => {
  try {
    const {
      // college,
      title,
      youtubeLink,
      description,
      place,
      entryFees,
      eDate,
      lastDate,
      // status,
    } = req.body;
    const qrCode = req?.files[0]?.filename;
    const poster = req?.files[1]?.filename;
    const existingEvent = await eventSchema.findOne({
      title,
      college: req.college,
      eDate,
    });
    if (existingEvent) {
      res.json({ success: false, message: "Event already posted!" });
    } else {
      const newEvent = await new eventSchema({
        college: req.college,
        title,
        youtubeLink,
        poster,
        qrCode,
        description,
        place,
        entryFees,
        eDate,
        lastDate,
        status: "Active",
      }).save();
      res.json({
        success: true,
        message: "New event posted!",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const updateEvent = async (req, res) => {
  try {
    const existingEvent = await eventSchema.findById(req.params.id);
    if (!existingEvent) {
      res.json({ success: false, message: "Event not found!" });
    } else {
      const {
        title,
        youtubeLink,
        description,
        place,
        entryFees,
        eDate,
        lastDate,
        status,
      } = req.body;
      const qrCode = req?.files[0]?.filename;
      const poster = req?.files[1]?.filename;
      const updatedEvent = {};
      if (title) updatedEvent.title = title;
      if (poster) updatedEvent.poster = poster;
      if (qrCode) updatedEvent.qrCode = qrCode;
      if (youtubeLink) updatedEvent.youtubeLink = youtubeLink;
      if (description) updatedEvent.description = description;
      if (place) updatedEvent.place = place;
      if (entryFees) updatedEvent.entryFees = entryFees;
      if (eDate) updatedEvent.eDate = eDate;
      if (lastDate) updatedEvent.lastDate = lastDate;
      if (status) updatedEvent.status = status;
      if (status == "Expired") {
        const allRegistrationsForTheEvent = await registrationSchema.find({
          event: req.params.id,
        });
        // console.log(allRegistrationsForTheEvent);
        allRegistrationsForTheEvent.map(async (reg) => {
          // console.log(reg._id.toString());
          const registrationId = reg?._id?.toString();
          const updatedRegistration = {};
          updatedRegistration.bookingStatus = "Completed";
          await registrationSchema.findByIdAndUpdate(
            registrationId,
            {
              $set: updatedRegistration,
            },
            { new: true }
          );
        });
      }
      await eventSchema.findByIdAndUpdate(
        req.params.id,
        {
          $set: updatedEvent,
        },
        { new: true }
      );
      res.json({
        success: true,
        message: "Event updated!",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const getEvents = async (req, res) => {
  try {
    const collegeEvent = await eventSchema.find({ college: req.college });
    if (collegeEvent?.length == 0) {
      res.json({ success: false, message: "Events not found!!" });
    } else {
      res.json({
        success: true,
        events: collegeEvent,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const getSingleEvent = async (req, res) => {
  try {
    const collegeEvent = await eventSchema.findById(req.params.id);
    if (!collegeEvent) {
      res.json({ success: false, message: "Events not found!!" });
    } else {
      res.json({
        success: true,
        event: collegeEvent,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const createCompetition = async (req, res) => {
  try {
    const { event, title, description, rules, isGrouped, groupMembers } =
      req.body;
    const picture = req?.file?.filename;
    const existingCompetition = await competitionSchema.findOne({
      title,
      event,
      isGrouped,
    });
    if (existingCompetition) {
      res.json({ success: false, message: "Competition already posted!" });
    } else {
      const newCompetition = await new competitionSchema({
        event,
        title,
        description,
        rules,
        picture,
        isGrouped,
        groupMembers,
        status: "Active",
      }).save();
      res.json({
        success: true,
        message: "New competition posted!",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const updateCompetition = async (req, res) => {
  try {
    const existingCompetition = await competitionSchema.findById(req.params.id);
    if (!existingCompetition) {
      res.json({ success: false, message: "Competition not found!" });
    } else {
      const {
        event,
        title,
        description,
        rules,
        isGrouped,
        groupMembers,
        status,
      } = req.body;
      const picture = req?.file?.filename;
      const updatedCompetition = {};
      if (title) updatedCompetition.title = title;
      if (picture) updatedCompetition.picture = picture;
      if (description) updatedCompetition.description = description;
      if (rules) updatedCompetition.rules = rules;
      if (isGrouped) updatedCompetition.isGrouped = isGrouped;
      if (groupMembers) updatedCompetition.groupMembers = groupMembers;
      if (status) updatedCompetition.status = status;
      await competitionSchema.findByIdAndUpdate(
        req.params.id,
        {
          $set: updatedCompetition,
        },
        { new: true }
      );
      res.json({
        success: true,
        message: "Competition updated!",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const getCompetitions = async (req, res) => {
  try {
    const eventCompetition = await competitionSchema.find({
      event: req.params.eventId,
    });
    if (eventCompetition?.length == 0) {
      res.json({ success: false, message: "Competitions not found!!" });
    } else {
      res.json({
        success: true,
        competitions: eventCompetition,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const getSingleCompetition = async (req, res) => {
  try {
    const eventCompetition = await competitionSchema.findById(req.params.id);
    if (!eventCompetition) {
      res.json({ success: false, message: "Competition not found!!" });
    } else {
      res.json({
        success: true,
        competition: eventCompetition,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const getRegistrations = async (req, res) => {
  try {
    const registrations = await registrationSchema
      .find()
      .populate({
        path: "event",
      })
      .populate({
        path: "student",
      })
      .populate({
        path: "competitionData.competition", // Access the `competition` field inside `competitionData`
        model: "competition", // Specify the model explicitly if necessary
      });

    // Filter registrations where the college matches req.college
    const collegeRegistrations = registrations.filter((registration) => {
      return registration.event.college.toString() === req.college;
    });

    // Respond with the filtered registrations
    res.json({ success: true, registrations: collegeRegistrations });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};

const updateRegistration = async (req, res) => {
  try {
    const registration = await registrationSchema.findById(req.params.id);
    if (!registration) {
      res.json({ success: false, message: "Registration not found!" });
    } else {
      const studentData = await studentSchema.findById(registration.student);
      const { bookingStatus, paymentStatus } = req.body;
      const updatedRegistration = {};

      if (bookingStatus) {
        const emailSubject = `Application Status Updated`;
        const emailMessage =
          bookingStatus == "Accepted"
            ? `Dear ${studentData.username},\n\nYour registration application has been accepted by the college! Pay the registration fees through UPI to confirm your registration`
            : bookingStatus == "Confirmed"
            ? `Dear ${studentData.username},\n\nYour registration application has been confirmed by the college and invitations has been uploaded! `
            : `Dear ${studentData.username},\n\nYour registration application has been rejected by the college due to invalid participant information`;
        const mailOptions = {
          from: "contact.connectcampus@gmail.com",
          to: studentData?.email,
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
        updatedRegistration.bookingStatus = bookingStatus;
      }
      if (paymentStatus) {
        const emailSubject =
          paymentStatus == "Denied"
            ? `Payment has been denied`
            : `Payment has been verified`;
        const emailMessage =
          paymentStatus == "Denied"
            ? `Dear ${studentData.username},\n\nYour payment has been denied by the college due to invalid transaction details.\n\nPlease enter a valid transaction Id and proceed further`
            : `Dear ${studentData.username},\n\nYour payment has been verified by the college!\n\n Thank you`;
        const mailOptions = {
          from: "contact.connectcampus@gmail.com",
          to: studentData?.email,
          subject: emailSubject,
          text: emailMessage,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
            res.json({ success: true, message: "Registered successfully" });
          }
        });
        updatedRegistration.paymentStatus = paymentStatus;
      }
      await registrationSchema.findByIdAndUpdate(
        req.params.id,
        {
          $set: updatedRegistration,
        },
        { new: true }
      );
      res.json({
        success: true,
        message: "Registration updated!",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};

const postBlog = async (req, res) => {
  try {
    const { title, firstDescription, secondDescription } = req.body;
    const picture = req?.file?.filename;
    const existingEvent = await blogSchema.findOne({
      title,
      college: req.college,
    });
    if (existingEvent) {
      res.json({ success: false, message: "Blog already posted!" });
    } else {
      const newEvent = await new blogSchema({
        college: req.college,
        title,
        firstDescription,
        secondDescription,
        picture,
        status: "Public",
      }).save();
      res.json({
        success: true,
        message: "New Blog posted!",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const updateBlog = async (req, res) => {
  try {
    const existingBlog = await blogSchema.findById(req.params.id);
    if (!existingBlog) {
      res.json({ success: false, message: "Blog not found!" });
    } else {
      const { title, firstDescription, secondDescription, status } = req.body;
      const picture = req?.file?.filename;
      const updatedBlog = {};
      if (title) updatedBlog.title = title;
      if (firstDescription) updatedBlog.firstDescription = firstDescription;
      if (secondDescription) updatedBlog.secondDescription = secondDescription;
      if (picture) updatedBlog.picture = picture;
      if (status) updatedBlog.status = status;
      await blogSchema.findByIdAndUpdate(
        req.params.id,
        {
          $set: updatedBlog,
        },
        { new: true }
      );
      res.json({
        success: true,
        message: "Blog updated!",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const deleteBlog = async (req, res) => {
  try {
    const existingBlog = await blogSchema.findById(req.params.id);
    if (!existingBlog) {
      res.json({ success: false, message: "Blog not found!" });
    } else {
      await blogSchema.findByIdAndDelete(req.params.id);
      res.json({
        success: true,
        message: "Blog Deleted!",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const getBlogs = async (req, res) => {
  try {
    const collegeBlog = await blogSchema.find({ college: req.college });
    if (collegeBlog?.length == 0) {
      res.json({ success: false, message: "Blogs not found!!" });
    } else {
      res.json({
        success: true,
        blogs: collegeBlog,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const getReport = async (req, res) => {
  try {
    const events = await eventSchema.find({ college: req.college });
    const blogs = await blogSchema.find({ college: req.college });
    const registrations = await registrationSchema
      .find({ bookingStatus: "Completed", paymentStatus: "Verified" })
      .populate({
        path: "event",
      })
      .populate({
        path: "student",
      })
      .populate({
        path: "competitionData.competition", // Access the `competition` field inside `competitionData`
        model: "competition", // Specify the model explicitly if necessary
      });
    const registrations2 = await registrationSchema
      .find()
      .populate({
        path: "event",
      })
      .populate({
        path: "student",
      })
      .populate({
        path: "competitionData.competition", // Access the `competition` field inside `competitionData`
        model: "competition", // Specify the model explicitly if necessary
      });

    // Filter registrations where the college matches req.college
    const collegeRegistrations = registrations.filter((registration) => {
      return registration.event.college.toString() === req.college;
    });
    // Calculate the total amount
    const totalAmount = collegeRegistrations.reduce((sum, registration) => {
      // Convert registration.amount to a number, and default to 0 if it's invalid
      const amount = Number(registration.amount) || 0; // NaN will be treated as 0
      return sum + amount;
    }, 0);

    res.json({
      success: true,
      events: events?.length,
      blogs: blogs?.length,
      collegeRegistrations: collegeRegistrations?.length,
      totalRevenue: totalAmount,
      recentRegistrations: registrations2?.slice()?.reverse()?.slice(0, 6),
      recentEvents: events?.slice()?.reverse()?.slice(0, 6),
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
module.exports = {
  Register,
  Login,
  getProfile,
  createEvent,
  updateEvent,
  getEvents,
  getAllStudentsToCollege,
  updateStudentStatus,
  getSingleEvent,
  createCompetition,
  updateCompetition,
  getCompetitions,
  getSingleCompetition,
  getRegistrations,
  updateRegistration,
  postBlog,
  updateBlog,
  getBlogs,
  deleteBlog,
  getReport,
};
