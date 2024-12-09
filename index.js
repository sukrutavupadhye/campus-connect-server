const express = require("express");
const connectMongoDb = require("./db");
const cors = require("cors");
connectMongoDb();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/college/", require("./Routes/collegeRoutes"));
app.use("/collegeUploads/college", express.static("./Uploads/college"));
app.use(
  "/collegeEventUploads/college",
  express.static("./Uploads/college/events")
);
app.use(
  "/collegeBlogUploads/college",
  express.static("./Uploads/college/blogs")
);
app.use(
  "/collegeCompetitionUploads/college",
  express.static("./Uploads/college/events/competitions")
);

app.use("/admin/", require("./Routes/adminRoutes"));
app.use("/adminUploads/admin", express.static("./Uploads/admin"));
app.use("/collegeUploads/admin", express.static("./Uploads/college"));
app.use("/studentUploads/admin", express.static("./Uploads/student"));

app.use("/student/", require("./Routes/studentRoutes"));
app.use("/studentUploads/student", express.static("./Uploads/student"));
app.use("/collegeUploads/student", express.static("./Uploads/college"));
app.use("/eventUploads/student", express.static("./Uploads/college/events"));
app.use("/blogUploads/college", express.static("./Uploads/college/blogs"));
app.use(
  "/CompetitionUploads/student",
  express.static("./Uploads/college/events/competitions")
);
const PORT = 7000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
