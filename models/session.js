const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Room: {
    type: String,
    required: true,
  },
  Instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
  },
  DepartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
  },
  Date: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
