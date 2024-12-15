const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
  Instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true
  },
  Member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  messages: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    default: []
  },
  isGroup: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
})

// Index unique pour empêcher qu'un même `Instructor` et `Member` aient plusieurs conversations.
ChatSchema.index({ Instructor: 1, Member: 1 }, { unique: true })

// Middleware pour valider la logique des conversations privées
ChatSchema.pre('save', async function (next) {
  try {
    if (!this.isGroup) {
      // Vérifiez si le `Member` est déjà impliqué dans une autre conversation avec un autre `Instructor`
      const existingChat = await mongoose.model('Chat').findOne({
        Member: this.Member,
        _id: { $ne: this._id } // Exclut l'actuelle conversation si elle est en modification
      })

      if (existingChat) {
        return next(
          new Error(
            'Ce Member est déjà associé à une autre conversation privée avec un autre Instructor.'
          )
        )
      }
    }
    next()
  } catch (error) {
    next(error)
  }
})

const Chat = mongoose.model('Chat', ChatSchema)

module.exports = Chat
