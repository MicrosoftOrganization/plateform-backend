const mongoose = require("mongoose");

const responsesSchema = new mongoose.Schema({
  // make sure to link the assignment to the response schema
  // and that the responce is unique so that marking on the instructor's end is easier
  // the respoonse should have a status , mark
  // take in consideration providing a client chat service

  Content: {
    type: String,
    required: true,
  },
  User_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  Assignment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  status: {
    type: String,
    enum: ["AWAITING FOR REVIEW", "APPROVED", "EDITED"],
    default: "AWAITING FOR REVIEW", // Valeur par défaut
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// Assurer qu'un utilisateur ne peut soumettre qu'une seule réponse pour un assignment donné
responsesSchema.index({ User_id: 1, Assignment_id: 1 }, { unique: true });

const Response = mongoose.model("Response", responsesSchema);
module.exports = Response;
