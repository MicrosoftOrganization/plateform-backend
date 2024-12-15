const { SuperAdmin } = require('../models/user')
const { Instructor } = require('../models/user')
const { department } = require('../models/department')
const session = require('../models/session')
const Assignment = require('../models/assignment')

const controller = {
  create_Admin: async (req, res) => {
    try {
      const { NomPrenom, Email, Password, Adresse, ImageLink } = req.body

      if (!NomPrenom || !Email || !Password || !Adresse) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      // Créer un nouvel utilisateur en tant que Member
      const newMember = new SuperAdmin({
        NomPrenom,
        Email,
        Password,
        Adresse,
        ImageLink,
        createdAt: Date.now(),
        Role: 'superAdmin'
      })
      await newMember.save()
      res.status(201).json({
        message: 'Super Admin created successfully',
        Member: newMember
      })
    } catch (error) {
      console.error('Error creating Super Admin:', error)
      res.status(500).json({
        message: 'Error in creating Super Admin',
        error: error.message
      })
    }
  }
}
module.exports = controller
