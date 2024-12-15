const { Instructor } = require('../models/user')
const { department } = require('../models/department')
const session = require('../models/session')
const Assignment = require('../models/assignment')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const controller = {
  afficher_All: async (req, res) => {
    try {
      const Instructors = await Instructor.find()
      res.status(200).json(Instructors)
    } catch (error) {
      res.status(404).json({ message: 'Error in generating Instructors' })
    }
  },
  create_Instructor_with_department: async (req, res) => {
    try {
      const instructorData = req.body
      console.log(instructorData.DepartmentId)
      const Mydepartment = await department.findById(
        instructorData.DepartmentId
      )
      if (!Mydepartment) {
        console.log(Mydepartment)
        return res.status(404).json({ message: 'Department not found' })
      }
      console.log('Mydepartment : ')
      console.log(Mydepartment)

      const instructor = new Instructor(instructorData)

      const savedInstructor = await instructor.save()

      Mydepartment.instructors.push(savedInstructor._id)
      await Mydepartment.save()

      // Return a response with the saved instructor details
      return res.status(201).json({
        message: 'Instructor added successfully',
        instructor: savedInstructor
      })
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .json({ message: 'Error adding instructor to department' })
    }
  },
  get_Instructors_names_and_ids_in_department: async (req, res) => {
    const { DepartmentId } = req.body

    try {
      const result = await department
        .findById(DepartmentId)
        .populate({
          path: 'instructors',
          select: '_id NomPrenom -__t'
        })
        .select('instructors')

      if (!result) {
        return res.status(404).json({ message: 'Département non trouvé' })
      }

      return res.status(200).json({ instructors: result.instructors })
    } catch (error) {
      console.error('Error fetching instructors:', error)
      return res.status(500).json({ message: 'Erreur serveur' })
    }
  },
  update_Instructor: async (req, res) => {
    try {
      const id = req.params.id

      // Récupérer l'instructor existant
      const instructor = await Instructor.findById(id)
      if (!instructor) {
        return res.status(404).json({ message: 'Instructor not found' })
      }

      console.log('Initial instructor:', instructor)
      console.log('Initial body:', req.body)

      // Mise à jour du mot de passe uniquement si nécessaire
      if (req.body.Password && req.body.Password !== '') {
        const salt = await bcrypt.genSalt(10)
        req.body.Password = await bcrypt.hash(req.body.Password, salt)
        console.log('Password updated:', req.body.Password)
      } else {
        req.body.Password = instructor.Password // Conserver l'ancien mot de passe
      }

      console.log('DepartmentId cible:', req.body.DepartmentId) // Destination
      console.log('DepartmentId source:', instructor.DepartmentId) // Source

      if (
        req.body.DepartmentId &&
        !instructor.DepartmentId.equals(
          new mongoose.Types.ObjectId(req.body.DepartmentId)
        )
      ) {
        // Rechercher le département source
        const sourceDepartment = await department.findById(
          instructor.DepartmentId
        )
        if (!sourceDepartment) {
          throw new Error('Source Department not found')
        }

        // Rechercher le département cible
        const targetDepartment = await department.findById(
          req.body.DepartmentId
        )
        if (!targetDepartment) {
          throw new Error('Target Department not found')
        }

        // Vérifier si l'instructorId est dans le département source
        const instructorIndex = sourceDepartment.instructors.indexOf(
          instructor._id
        )
        if (instructorIndex === -1) {
          throw new Error('Instructor not found in the source department')
        }

        console.log('Before modification:')
        console.log('Source instructors:', sourceDepartment.instructors)
        console.log('Target instructors:', targetDepartment.instructors)

        // Retirer l'instructorId du département source
        sourceDepartment.instructors.splice(instructorIndex, 1)

        // Ajouter l'instructorId au département cible (évite les doublons)
        if (!targetDepartment.instructors.includes(instructor._id)) {
          targetDepartment.instructors.push(instructor._id)
          console.log('Instructor moved to target department.')
        }

        console.log('After modification:')
        console.log('Source instructors:', sourceDepartment.instructors)
        console.log('Target instructors:', targetDepartment.instructors)

        // Sauvegarder les modifications dans les deux départements
        await sourceDepartment.save()
        await targetDepartment.save()

        console.log('Instructor moved successfully!')
      } else {
        console.log(
          'Les deux Department IDs sont identiques. Aucun déplacement nécessaire.'
        )
      }

      // Mettre à jour l'instructor avec les nouvelles informations
      const update = await Instructor.updateOne({ _id: id }, req.body)

      res.status(200).json({
        message: 'Instructor updated successfully',
        Instructor: update
      })
    } catch (error) {
      res.status(500).json({
        message: 'Error in updating Instructor',
        error: error.message
      })
      console.error('Error:', error)
    }
  },
  delete_Instructor: async (req, res) => {
    try {
      const id = req.params.id

      const instructor = await Instructor.findById(id)
      if (!instructor) {
        throw new Error('instructor not found')
      }

      const sourceDepartment = await department.findById(
        instructor.DepartmentId
      )
      if (!sourceDepartment) {
        throw new Error('Department not found')
      }
      // Vérifier si l'instructorId est dans le département source
      const instructorIndex = sourceDepartment.instructors.indexOf(
        instructor._id
      )
      if (instructorIndex === -1) {
        throw new Error('Instructor not found in the source department')
      }

      sourceDepartment.instructors.splice(instructorIndex, 1)

      await sourceDepartment.save()
      const deleted = await Instructor.deleteOne({ _id: id })
      if (deleted.deletedCount === 0) {
        return res.status(404).json({ message: 'Instructor not found' })
      }

      console.log('After modification:')
      console.log('Source instructors:', sourceDepartment.instructors)

      res.status(200).json({ message: 'Instructor deleted successfully' })
    } catch (error) {
      console.log(error)
      res.status(404).json({ message: 'Error in deleting Admin' })
    }
  },
  findInstructor: async (req, res) => {
    try {
      const id = req.params.id
      const instructor = await Instructor.findById(id)

      if (!instructor) {
        return res
          .status(404)
          .json({ message: "This instructor doesn't exist" })
      }

      return res.status(200).json(instructor)
    } catch (error) {
      console.error('Error in finding instructor:', error)
      return res.status(400).json({ message: 'Error in finding instructor' })
    }
  },
  count: async (req, res) => {
    try {
      const instructors = await Instructor.countDocuments()
      res.status(200).json(instructors)
    } catch (error) {
      res.status(404).json({ message: 'Error in counting instructors' })
    }
  }
}

module.exports = controller
