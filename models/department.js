const mongoose = require('mongoose')

const { Schema } = mongoose

// User Schema
const DepartmentSchema = new Schema({
  DepartmentName: {
    type: String,
    enum: [
      'Basic Web',
      'Intermediate Web',
      'Advanced Web',
      'AI',
      'Mariem Department Attention!!!!!'
    ],
    required: true
  },
  instructors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor'
    }
  ],
  sessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    }
  ],
  assignments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment'
    }
  ],
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat'
    }
  ]
})

// User model
const department = mongoose.model('department', DepartmentSchema)

module.exports = { department }
