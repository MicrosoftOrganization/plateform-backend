const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

// User Schema
const UserSchema = new Schema({
  NomPrenom: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"],
  },
  Role: {
    type: String,
    enum: ["superAdmin", "member", "instructor"],
    immutable: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // attributs are not useful for now
  Adresse: {
    type: String,
    required: true,
  },
  ImageLink: {
    type: String,
  },
});

// Pre-save hook for hashing passwords
UserSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// User model
const User = mongoose.model("User", UserSchema);

// Instructor Schema
const InstructorSchema = new Schema({
  DepartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
    required: true,
  },
});

// Member Schema
const MemberSchema = new Schema({
  DepartmentIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
    },
  ],
  Responses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Response",
    },
  ],
});

// Discriminators for different user roles
const Instructor = User.discriminator("Instructor", InstructorSchema);
const SuperAdmin = User.discriminator("SuperAdmin", UserSchema);
const Member = User.discriminator("Member", MemberSchema);

module.exports = { User, Instructor, SuperAdmin, Member };
