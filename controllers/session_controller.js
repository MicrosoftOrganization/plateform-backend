const { department } = require('../models/department')
const { Instructor } = require('../models/user')
const session = require('../models/session')

const controller = {
  Instructor_add_Session_In_department: async (req, res) => {
    try {
      const { DepartmentId, InstructorId, Date, Description, Title, Room } =
        req.body

      // Vérifiez que le département existe
      const Mydepartment = await department.findById(DepartmentId) // Correction de 'department' en 'Department'
      if (!Mydepartment) {
        return res.status(404).json({ message: 'Department not found' })
      }

      const newSession = new session({
        Date: Date,
        Description: Description,
        Title: Title,
        Instructor: InstructorId,
        Room: Room,
        DepartmentId: DepartmentId
      })

      const savedSession = await newSession.save()

      // Optionnel : Ajouter l'instructeur au tableau des instructeurs du département (si vous avez un champ 'instructors' dans le modèle de département)
      Mydepartment.sessions.push(savedSession._id) // Ajoute l'instructeur dans le département
      await Mydepartment.save() // Sauvegarde les changements dans le département

      res.status(201).json({ message: 'Session added successfully' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  Instructor_modify_Session_In_department: async (req, res) => {
    try {
      const { Title, Description, Date, Room, Instructor, sessionId } = req.body

      // Récupérer la session existante
      const existingSession = await session.findById(sessionId)
      if (!existingSession) {
        return res.status(404).json({ message: 'Session not found' })
      }

      console.log('Initial session:', existingSession)
      console.log('Request body:', req.body)

      // Créer un objet avec les nouvelles valeurs pour la mise à jour
      const sessionData = {
        Title,
        Description,
        Date: Date, // Assurez-vous que la date est au format Date
        Room,
        instructorId: Instructor // Renommer Instructor en instructorId
      }

      // Mettre à jour la session avec les nouvelles informations
      const update = await session.updateOne({ _id: sessionId }, sessionData)

      if (update.nModified === 0) {
        return res
          .status(404)
          .json({ message: 'No changes were made to the session' })
      }

      res.status(200).json({
        message: 'Session updated successfully',
        session: sessionData // Renvoie les nouvelles données de la session
      })
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error in updating session', error: error.message })
      console.error(error)
    }
  },

  getSessionsByInstructor: async (req, res) => {
    try {
      const { instructorId } = req.params

      // Vérifiez si l'instructeur existe
      const instructorExists = await Instructor.findById(instructorId)
      if (!instructorExists) {
        return res.status(404).json({ message: 'Instructor not found' })
      }

      // Trouvez toutes les sessions liées à cet instructeur
      const sessions = await session.find({ Instructor: instructorId })

      res.status(200).json(sessions)
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error retrieving sessions', error: error.message })
    }
  },

  getSessionsByDepartment: async (req, res) => {
    try {
      const { DepartmentId } = req.params
      console.log(DepartmentId)
      // Vérifiez si le département existe
      const departmentExists = await department.findById(DepartmentId)
      if (!departmentExists) {
        return res.status(404).json({ message: 'Department not found' })
      }

      const sessions = await session
        .find({
          _id: { $in: departmentExists.sessions }
        })
        .populate({
          path: 'Instructor',
          select: 'NomPrenom -_id -__t'
        })
        .exec()

      // Modifier la structure des données pour correspondre à ce qui est demandé
      const formattedSessions = sessions.map(session => ({
        _id: session._id,
        Title: session.Title,
        Description: session.Description,
        Instructor: session.Instructor.NomPrenom, // Récupérer le nom de l'instructeur
        Date: session.Date,
        Room: session.Room
      }))

      res.status(200).json(formattedSessions)
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error retrieving sessions', error: error.message })
    }
  },

  delete_Session_By_Instructor: async (req, res) => {
    try {
      const id = req.params.id
      const MySession = await session.findById(id)
      if (!MySession) {
        return res.status(404).json({ message: 'Session not found' })
      }
      const Mydepartment = await department.findById(MySession.DepartmentId)
      if (!Mydepartment) {
        return res.status(404).json({ message: 'Department not found' })
      }
      Mydepartment.sessions.pop(MySession._id)
      await Mydepartment.save() // Sauvegarde les changements dans le département

      const deleted = await session.deleteOne({ _id: id })
      if (deleted.deletedCount === 0) {
        return res.status(404).json({ message: 'session not found' })
      }
      res.status(200).json({ message: 'session deleted successfully' })
    } catch (error) {
      res.status(404).json({ message: 'Error in deleting session' })
    }
  }
}

module.exports = controller
