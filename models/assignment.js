const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  DueDate: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  Instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
  },
  Responses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Response",
    },
  ],
});

// Vérifie si le modèle existe déjà avant de le définir
const Assignment =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
