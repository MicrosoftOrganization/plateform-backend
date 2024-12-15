const { Member } = require('../models/user')
const { Instructor } = require('../models/user')
const { department } = require('../models/department')
const session = require('../models/session')
const Assignment = require('../models/assignment')
const bcrypt = require('bcryptjs')

const controller = {
  // modifier par mariem
  afficher_All: async (req, res) => {
    try {
      const { departmentId } = req.params
      // Vérifier si le département existe
      const departmentFind = await department.findById(departmentId)
      if (!departmentFind) {
        return res.status(404).json({ message: 'Department not found' })
      }
      // Requête pour trouver les membres dans le département spécifié
      const members = await Member.find({
        DepartmentIds: departmentId
      })
        .select('NomPrenom ImageLink DepartmentIds -__t')
        .exec()

      if (!members || members.length === 0) {
        return res.status(404).json({ message: 'Aucun membre trouvé.' })
      }
      res.status(200).json(members)
    } catch (error) {
      console.error('Erreur lors de la récupération des membres:', error) // Affiche l'erreur dans la console
      res.status(500).json({
        message: 'Erreur lors de la génération des membres',
        error: error.message
      })
    }
  },

  afficher_All_For_Admin: async (req, res) => {
    try {
      // Requête pour trouver les membres dans le département spécifié
      const members = await Member.find({ Role: 'member' })
        .select(
          '_id NomPrenom Email Password Role Adresse ImageLink DepartmentIds -__t'
        )
        .exec()

      if (!members || members.length === 0) {
        return res.status(404).json({ message: 'Aucun membre trouvé.' })
      }
      res.status(200).json(members)
    } catch (error) {
      console.error('Erreur lors de la récupération des membres:', error) // Affiche l'erreur dans la console
      res.status(500).json({
        message: 'Erreur lors de la génération des membres',
        error: error.message
      })
    }
  },

  Member_get_assignments_of_his_department: async (req, res) => {
    try {
      const { departmentId } = req.params

      // Vérifiez si le département existe et peupler les assignments directement
      const departmentExists = await department
        .findById(departmentId)
        .populate({
          path: 'assignments', // Nom du champ assignments dans le modèle department
          select: 'Title Description DueDate Attachments' // Champs à peupler dans Assignment
        })

      if (!departmentExists) {
        return res.status(404).json({ message: 'Department not found' })
      }

      res.status(200).json(
        departmentExists.assignments // Renvoie les assignments peuplés
      )
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error retrieving assignments', error: error.message })
    }
  },

  create_Member: async (req, res) => {
    try {
      const { NomPrenom, Email, Password, Adresse, ImageLink, DepartmentIds } =
        req.body

      // Vérifier que les champs obligatoires sont présents
      if (!NomPrenom || !Email || !Password || !Adresse || !DepartmentIds) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      // Créer un nouvel utilisateur en tant que Member
      const newMember = new Member({
        NomPrenom,
        Email,
        Password,
        Adresse,
        ImageLink,
        DepartmentIds,
        Role: 'member' // Le rôle est explicitement défini ici
      })

      // Sauvegarder le nouveau membre
      await newMember.save()

      res
        .status(201)
        .json({ message: 'Member created successfully', Member: newMember })
    } catch (error) {
      console.error('Error creating member:', error)
      res
        .status(500)
        .json({ message: 'Error in creating Member', error: error.message })
    }
  },
  create_Members: async (req, res) => {
    try {
      const members = req.body
      for (const member of members) {
        const {
          NomPrenom,
          Email,
          Password,
          Adresse,
          ImageLink,
          DepartmentIds
        } = member
        const newMember = new Member({
          NomPrenom,
          Email,
          Password,
          Adresse,
          ImageLink,
          DepartmentIds,
          Role: 'member'
        })
        await newMember.save()
      }
      res.status(200).json('Members added successfully')
    } catch (err) {
      console.log(err)
      res.status(400).json('An error occurred')
    }
  },
  get_members_names: async (req, res) => {
    try {
      const members = await Member.find({ Role: 'member' }).select('NomPrenom')
      res.status(200).json(members)
    } catch (error) {
      console.error('Error in finding members:', error)
      res.status(404).json({ message: 'Error in finding members' })
    }
  },

  update_Member: async (req, res) => {
    try {
      const id = req.params.id

      // Récupérer le membre existant
      const member = await Member.findById(id)
      if (!member) {
        return res.status(404).json({ message: 'Member not found' })
      }
      console.log('initial member')
      console.log(member)
      console.log('initial body')
      console.log(req.body)
      if (req.body.Password == '') {
        req.body.Password = member.Password
        console.log('pass == null ')
        console.log(req.body)
      } else {
        // Si les mots de passe sont différents, crypter le nouveau mot de passe
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.Password, salt)
        req.body.Password = hashedPassword // Mettre à jour le mot de passe dans req.body
        console.log('pass hashedPassword')
        console.log(req.body)
      }

      // Mettre à jour le membre avec les nouvelles informations
      const update = await Member.updateOne({ _id: id }, req.body)

      res
        .status(200)
        .json({ message: 'Member updated successfully', member: update })
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error in updating Member', erreur: error.message })
      console.log(error)
    }
  },

  delete_Member: async (req, res) => {
    try {
      const id = req.params.id
      const deleted = await Member.deleteOne({ _id: id })
      if (deleted.deletedCount === 0) {
        return res.status(404).json({ message: 'Member not found' })
      }
      res.status(200).json({ message: 'Member deleted successfully' })
    } catch (error) {
      res.status(404).json({ message: 'Error in deleting Member' })
    }
  },

  findMember: async (req, res) => {
    try {
      const id = req.params.id
      const member = await Member.findById(id)

      if (!member) {
        return res.status(404).json({ message: "This Member doesn't exist" })
      }

      return res.status(200).json(member)
    } catch (error) {
      console.error('Error in finding Member:', error)
      return res.status(400).json({ message: 'Error in finding Member' })
    }
  },

  count: async (req, res) => {
    try {
      const Members = await Member.countDocuments()
      res.status(200).json(Members)
    } catch (error) {
      res.status(404).json({ message: 'Error in counting Members' })
    }
  }
}

module.exports = controller
