const studentSchema = require("../Models/Student");
const eventSchema = require("../Models/Events");
const competitionSchema = require("../Models/Competition");
const collegeSchema = require("../Models/College");
const registrationSchema = require("../Models/Registrations");
const blogSchema = require("../Models/Blog");
const listSchema = require("../Models/List");
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
    const { username, college, course, classYear, email, phone, password } =
      req.body;
    const check = await studentSchema.findOne({ email });
    if (check) {
      res.json({ success: false, message: "Email already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newStudent = await new studentSchema({
        username,
        college,
        course,
        classYear,
        email,
        phone,
        password: hashedPassword,
        status: "Active",
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
    const student = await studentSchema.findOne({ email });
    if (!student) {
      // console.log("Email not found");
      res.json({ success: false, message: "Invalid credential!" });
    } else {
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        // console.log("Password is incorrect");
        res.json({ success: false, message: "Invalid credential!" });
      } else {
        const token = jwt.sign(student.id, secretKey);
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
    const student = await studentSchema.findById(req.student);
    if (!student) {
      console.log("Student not found");
      res.json({ success: false, message: "Student not found" });
    } else {
      res.json({
        success: true,
        message: "Profile fetched successfully",
        student,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};

const viewColleges = async (req, res) => {
  try {
    const colleges = await collegeSchema.find({ status: "Active" });
    res.json({
      success: true,
      colleges,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};

const viewEvents = async (req, res) => {
  try {
    // Get the current date, normalized to 00:00:00 for comparison
    const today = new Date().setHours(0, 0, 0, 0); // Normalize current date to midnight

    const collegeEvent = await eventSchema
      .find({ status: "Active" })
      .populate("college");

    // Filter events based on lastDate, keeping only those that are today or in the future
    const filteredEvents = collegeEvent.filter((event) => {
      const lastDate = new Date(event.lastDate); // Convert lastDate string to Date object
      return lastDate >= today; // Only include events with a lastDate in the future or today
    });

    if (filteredEvents.length === 0) {
      res.json({ success: false, message: "No upcoming events found!" });
    } else {
      res.json({
        success: true,
        events: filteredEvents,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Some internal error!" });
  }
};

const viewSingleEventDetails = async (req, res) => {
  try {
    const event = await eventSchema.findById(req.params.id).populate("college");
    if (!event) {
      return res.json({ success: false, message: "Event not found!!" });
    } else {
      // Get the list of competitions the student is already participating in
      const list = await listSchema
        .find({ student: req.student })
        .populate("competition");
      // .select("competition");
      // console.log(list);
      // Extract competition IDs from the list
      const competitionIdsInList = list.map((entry) =>
        entry.competition._id.toString()
      );
      // console.log(competitionIdsInList);
      // Get all competitions for the event and add `isThereInList`
      const competitions = await competitionSchema.find({ event: event._id });
      const competitionsWithStatus = competitions.map((competition) => ({
        ...competition.toObject(),
        isThereInList: competitionIdsInList.includes(
          competition._id.toString()
        ),
      }));

      res.json({
        success: true,
        event,
        competitions: competitionsWithStatus,
        list,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};

const viewSingleCompetitionDetails = async (req, res) => {
  try {
    const competition = await competitionSchema
      .findById(req.params.id)
      .populate("event");
    if (!competition) {
      return res.json({ success: false, message: "Competition not found!!" });
    } else {
      res.json({
        success: true,
        competition,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const getStudentList = async (req, res) => {
  try {
    const list = await listSchema.find({ student: req.student }).populate({
      path: "competition",
      populate: {
        path: "event", // Specify the field inside competition to populate
        model: "event", // Specify the model name if necessary
      },
    });

    res.json({ success: true, list });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};

const addIntoList = async (req, res) => {
  try {
    const newList = await new listSchema({
      competition: req.params.id,
      student: req.student,
    }).save();
    res.json({ success: true, message: "Competition added!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const removeFromList = async (req, res) => {
  try {
    const listItem = await listSchema.findOne({
      student: req.student,
      competition: req.params.id,
    });
    if (!listItem) {
      res.json({ success: false, message: "Competition does not exists!" });
    } else {
      await listSchema.findByIdAndDelete(listItem?._id);
      res.json({ success: true, message: "Competition removed!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const student = req.student; // Assuming `req.student` contains the student ID

    // Group competitions by event._id
    const groupedEvents = req.body.reduce((acc, item) => {
      const eventId = String(item.event._id);

      if (!acc[eventId]) {
        acc[eventId] = {
          event: item.event,
          competitionData: [],
        };
      }

      acc[eventId].competitionData.push({
        competition: item.competition,
        participants: item.participants,
      });

      return acc;
    }, {});

    // Process each unique event and store in the database

    const insertData = await Promise.all(
      Object.values(groupedEvents).map(async (eventGroup) => {
        const { event, competitionData } = eventGroup;
        // Check if a registration already exists for this student and event
        let registration = await registrationSchema.findOne({
          student,
          event: event._id,
        });

        const studentData = await studentSchema.findById(req.student);
        if (registration) {
          // Update existing registration by adding new competitions
          registration.competitionData.push(...competitionData);
          registration.amount = event.entryFees; // Update if necessary
          registration.bookingStatus = "Booked";
          await registration.save();
          const emailSubject = `Registration for the event`;
          const emailMessage = `Dear ${studentData.username},\n\nYour registration application has been updated!`;
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
        } else {
          // Create a new registration
          registration = await new registrationSchema({
            event: event._id,
            student,
            competitionData,
            amount: event.entryFees,
            paymentStatus: "Pending",
            bookingStatus: "Booked",
          }).save();
          const emailSubject = `Registration for the event`;
          const emailMessage = `Dear ${studentData.username},\n\nYour registration application has been sent to the college!`;
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
        }

        return registration;
      })
    );
    // req.body.map(async (item) => {
    //   const lists = await listSchema.find({ competition: item?.competition });
    //   lists.map(async (list) =>{
    //     await listSchema.findByIdAndDelete(list._id);
    //   })
    // });
    await Promise.all(
      req.body.map(async (item) => {
        const lists = await listSchema.find({ competition: item?.competition });
        await Promise.all(
          lists.map((list) => listSchema.findByIdAndDelete(list._id))
        );
      })
    );
    res.json({
      success: true,
      message: "Registrations processed!",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "An internal error occurred." });
  }
};

const getStudentRegistrations = async (req, res) => {
  try {
    const registrations = await registrationSchema
      .find({ student: req.student })
      .populate({
        path: "event",
        populate: {
          path: "college", // Populate the `college` field inside the `event`
          model: "college", // Specify the model for `college` explicitly, if necessary
        },
      })
      .populate({
        path: "competitionData.competition", // Access the `competition` field inside `competitionData`
        model: "competition", // Specify the model explicitly if necessary
      });

    res.json({ success: true, registrations });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const updateRegistration = async (req, res) => {
  try {
    const registration = await registrationSchema.findById(req.params.id);
    if (!registration) {
      res.json({ success: false, message: "Registration not found!" });
    } else {
      const studentData = await studentSchema.findById(req.student);
      const { transactionId, paymentStatus, feedback, ratings } = req.body;
      const updatedRegistration = {};
      if (ratings) updatedRegistration.ratings = ratings;
      if (feedback) updatedRegistration.feedback = feedback;
      if (transactionId) updatedRegistration.transactionId = transactionId;
      if (paymentStatus) {
        if (paymentStatus == "Initiated") {
          const emailSubject = `Payment Initiated for the registration`;
          const emailMessage = `Dear ${studentData.username},\n\nYour registration payment information has been sent to the college!Please wait till college verifies your transaction `;
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
        }
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

const viewAllBlogs = async (req, res) => {
  try {
    const Blogs = await blogSchema
      .find({ status: "Public" })
      .populate("college");
    if (Blogs?.length == 0) {
      res.json({ success: false, message: "Blogs not found!!" });
    } else {
      res.json({
        success: true,
        blogs: Blogs,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some internal error!" });
  }
};
const singleBlog = async (req, res) => {
  try {
    const existingBlog = await blogSchema
      .findById(req.params.id)
      .populate("college");
    if (!existingBlog) {
      res.json({ success: false, message: "Blog not found!" });
    } else {
      const allBlogs = await blogSchema
        .find({ status: "Public", college: existingBlog?.college?._id })
        .populate("college");
      const otherBlogs = await allBlogs.filter(
        (blog) => blog?._id.toString() != req.params.id
      );
      res.json({
        success: true,
        singleBlog: existingBlog,
        otherBlogs: otherBlogs,
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
  viewColleges,
  viewEvents,
  viewSingleEventDetails,
  addIntoList,
  removeFromList,
  getStudentList,
  registerForEvent,
  viewSingleCompetitionDetails,
  getStudentRegistrations,
  updateRegistration,
  singleBlog,
  viewAllBlogs,
};
