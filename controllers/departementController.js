const { department } = require('../models/department')

const controller = {
  afficher_All: async (req, res) => {
    try {
      const alldepartment = await department.find()
      res.status(200).json(alldepartment)
    } catch (error) {
      res.status(404).json({ message: 'Error in getting all Departement' })
    }
  },
  create_Departement: async (req, res) => {
    try {
      console.log('Request body before creation:', req.body) // Log request body

      // Créer un département avec les données reçues
      const create = await department.create(req.body)

      console.log('Department created successfully:', create) // Log after successful creation
      const { DepartmentName, _id } = create

      // Retourner une réponse de succès
      res.status(201).json({
        message: 'Department created successfully',
        DepartmentName,
        _id
      })
    } catch (error) {
      // Vérifier si c'est une erreur de validation
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message)
        return res.status(400).json({
          message: 'Validation error',
          errors
        })
      }

      // Autres erreurs (génériques)
      res.status(500).json({
        message: 'Error in creating Department',
        error: error.message
      })
    }
  },
  updateDepartement: async (req, res) => {
    const id = req.params.id
    const update = await department.updateOne({ _id: id }, req.body)
    if (update.nModified === 0) {
      return res
        .status(404)
        .json({ message: 'Departement not found or no changes made' })
    }
    const DepartmentName = update.DepartmentName
    const _id = update._id
    res.status(200).json({
      message: 'department Updated successfully'
    })
  },
  deleteDepartement: async (req, res) => {
    const id = req.params.id
    const deleted = await department.deleteOne({ _id: id })
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: 'Departement not found' })
    }
    res.status(200).json({ message: 'Departement deleted successfully' })
  },
  get_Departments_names_and_ids: async (req, res) => {
    try {
      const result = await department.find().select('DepartmentName _id ')

      return res.status(200).json({ departments: result })
    } catch (error) {
      console.error('Error fetching instructors:', error)
      return res.status(500).json({ message: 'Erreur serveur' })
    }
  }
}

module.exports = controller
