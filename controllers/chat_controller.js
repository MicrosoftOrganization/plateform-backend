const Chat = require('../models/chat')
const { department } = require('../models/department')
const { User, SuperAdmin } = require('../models/user')
const { Instructor } = require('../models/user')
const Message = require('../models/message')
const mongoose = require('mongoose')

const controller = {
  addChat: async (req, res) => {
    try {
      console.log('Début de la création de chat')
      const { Instructor, Member, DepartmentId } = req.body

      // Vérifiez que le département existe
      const Mydepartment = await department.findById(DepartmentId)
      if (!Mydepartment) {
        return res.status(404).json({ message: 'Département introuvable.' })
      }

      // Validation des participants
      if (!Instructor || !Member) {
        return res
          .status(400)
          .json({ message: 'Les deux participants sont requis.' })
      }

      // Vérifiez que les participants existent
      const user1 = await User.findById(Instructor)
      const user2 = await User.findById(Member)
      if (!user1 || !user2) {
        return res
          .status(404)
          .json({ message: 'Un ou plusieurs participants sont introuvables.' })
      }

      // Trier les participants pour garantir un ordre cohérent
      const members = [Instructor, Member]
      console.log(members)

      // Vérifier si une conversation entre les deux participants existe déjà
      let chat = await Chat.findOne({
        Instructor: Instructor,
        Member: Member,
        isGroup: false
      })

      if (chat) {
        return res
          .status(200)
          .json({ message: 'Conversation existante.', chat })
      }

      // Créer une nouvelle conversation
      chat = new Chat({
        Instructor: Instructor,
        Member: Member,
        isGroup: false
      })
      const savedChat = await chat.save()

      // Ajouter le chat au département
      Mydepartment.chats.push(savedChat._id)
      await Mydepartment.save()

      res.status(200).json({ message: 'Nouvelle conversation créée.', chat })
    } catch (error) {
      console.error('Erreur lors de la création de chat :', error)
      res.status(500).json({ message: 'Erreur serveur.', error: error.message })
    }
  },
  getChatsByInstructorId: async (req, res) => {
    try {
      const { instructorId } = req.params

      // Vérifiez que l'instructeur existe
      const instructor = await User.findById(instructorId)
      if (!instructor) {
        return res.status(404).json({ message: 'Instructeur introuvable.' })
      }

      // Récupérez les chats associés à cet instructeur
      const chats = await Chat.find({
        Instructor: instructorId
      })
        .populate('Instructor', 'NomPrenom Email -__t') // Populate pour l'instructeur
        .populate('Member', 'NomPrenom Email -__t') // Populate pour le membre
        .select('_id')

      if (!chats || chats.length === 0) {
        return res.status(404).json({ message: 'Aucune conversation trouvée.' })
      }

      res
        .status(200)
        .json({ message: 'Conversations récupérées avec succès.', chats })
    } catch (error) {
      console.error('Erreur lors de la récupération des chats :', error)
      res.status(500).json({ message: 'Erreur serveur.', error: error.message })
    }
  },
  getMessagesByChatId: async (req, res) => {
    try {
      const { chatId } = req.params

      // Récupérez le chat avec les messages associés
      const chat = await Chat.findById(chatId).populate('messages')

      if (!chat) {
        return res.status(404).json({ message: 'Chat introuvable.' })
      }
      res.status(200).json({
        messages: chat.messages
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des messages :', error)
      res.status(500).json({ message: 'Erreur serveur.', error: error.message })
    }
  },

  addMessage: async (req, res) => {
    try {
      const { senderId, text, chatId } = req.body

      const sender = await User.findById(senderId)
      console.log(senderId)
      if (!sender) {
        console.log(sender)
        return res.status(404).json({ message: 'Expéditeur introuvable.' })
      }
      // Récupérer le chat et vérifier qu'il existe
      const chat = await Chat.findById(chatId).populate([
        'Instructor',
        'Member'
      ])
      if (!chat) {
        return res.status(404).json({ message: 'Chat introuvable.' })
      }

      // Vérifier si le sender est soit un instructor, soit un member dans le chat
      const isSenderInstructor = chat.Instructor._id.toString() === senderId
      const isSenderMember = chat.Member._id.toString() === senderId
      console.log('isSenderInstructor')
      console.log(isSenderInstructor)
      console.log(chat.Instructor._id.toString())
      console.log(senderId)
      console.log('isSenderMember')
      console.log(isSenderMember)
      console.log(chat.Member._id.toString())
      console.log(senderId)
      if (!isSenderInstructor && !isSenderMember) {
        return res
          .status(403)
          .json({ message: 'Le sender ne fait pas partie de ce chat.' })
      }

      // Créer le message avec une référence complète au chat
      const newMessage = new Message({
        chat: chat._id,
        sender: sender._id,
        text: text
      })

      // Sauvegarder le message dans la base de données
      const savedMessage = await newMessage.save()

      // Ajouter le message au chat (relation dans les deux sens)
      chat.messages.push(savedMessage._id)
      await chat.save()

      // Retourner le message ajouté
      res.status(201).json({
        savedMessage
      })
    } catch (error) {
      console.error('Erreur lors de la création du message :', error)
      res.status(500).json({ message: 'Erreur serveur.', error: error.message })
    }
  },

  addMessageByAdmin: async (req, res) => {
    try {
      const { senderId, text, chatId, isAdmin } = req.body

      const sender = await User.findById(senderId)
      verify = true
      if (!sender) {
        return res.status(404).json({ message: 'Expéditeur introuvable.' })
      }
      if (sender.constructor.schema === SuperAdmin.schema) {
        verify = true
      } else {
        verify = false
      }

      const chat = await Chat.findById(chatId).populate([
        'Instructor',
        'Member'
      ])
      if (!chat) {
        return res.status(404).json({ message: 'Chat introuvable.' })
      }

      if (isAdmin == false || verify == false) {
        return res.status(403).json({
          message:
            "Le sender ne fait pas partie de ce chat ou n'est pas un administrateur."
        })
      }

      const newMessage = new Message({
        chat: chat._id,
        sender: sender._id,
        text: text
      })

      const savedMessage = await newMessage.save()

      chat.messages.push(savedMessage._id)
      chat.lastMessageAt = new Date()
      await chat.save()

      return res.status(201).json({
        message: 'Message ajouté avec succès.',
        savedMessage
      })
    } catch (error) {
      console.error('Erreur lors de la création du message :', error)
      return res
        .status(500)
        .json({ message: 'Erreur serveur.', error: error.message })
    }
  }
}

module.exports = controller
