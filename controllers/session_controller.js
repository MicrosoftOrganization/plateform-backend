const { department } = require("../models/department");
const { Instructor } = require("../models/user");
const session = require("../models/session");
const { parse, add, format } = require("date-fns");

const controller = {
  //  faire avec postman
  getLastSessionByDepartment: async (req, res) => {
    try {
      const { departmentId } = req.params;

      // Rechercher la dernière session dans le département
      const lastSession = await session
        .findOne({ DepartmentId: departmentId })
        .populate({
          path: "Instructor",
          select: "NomPrenom Email -__t -_id", // Sélectionner uniquement NomPrenom et Email pour l'instructeur
        })
        .populate({
          path: "DepartmentId",
          select: "DepartmentName", // Sélectionner uniquement DepartmentName pour le département
        })
        .sort({ createdAt: -1 })
        .limit(1);

      if (!lastSession) {
        return res.status(200).json({
          session: {},
        });
      }

      res.status(200).json({
        session: lastSession,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving the last session",
        error: error.message,
      });
    }
  },

  Instructor_add_Session_In_department: async (req, res) => {
    try {
      const {
        DepartmentId,
        InstructorId,
        Date: sessionDate,
        Description,
        Title,
        Room,
      } = req.body;

      // Vérifiez que le département existe
      const Mydepartment = await department.findById(DepartmentId); // Correction de 'department' en 'Department'
      if (!Mydepartment) {
        return res.status(404).json({ message: "Department not found" });
      }
      const id_instr = await Instructor.findOne({ NomPrenom: InstructorId })
        .populate("_id")
        .exec();
      console.log(id_instr);
      // Parse la date en objet Date
      const parsedDate = parse(sessionDate, "dd/MM/yyyy HH:mm:ss", new Date());
      console.log("parsedDate", parsedDate);

      // Vérifie si la date est valide
      if (isNaN(parsedDate.getTime())) {
        console.error("Date invalide");
        return; // Retourner ou envoyer un message d'erreur
      } else {
        console.log("Date valide");
      }

      // Format de la date ajoutée pour l'affichage
      const formattedDate = format(parsedDate, "dd/MM/yyyy HH:mm:ss");
      console.log("formattedDate après ajout d'1 heure", formattedDate);

      const newSession = new session({
        Date: formattedDate,
        Description: Description,
        Title: Title,
        Instructor: id_instr,
        Room: Room,
        DepartmentId: DepartmentId,
      });

      const savedSession = await newSession.save();

      // Optionnel : Ajouter l'instructeur au tableau des instructeurs du département (si vous avez un champ 'instructors' dans le modèle de département)
      Mydepartment.sessions.push(savedSession._id); // Ajoute l'instructeur dans le département
      await Mydepartment.save(); // Sauvegarde les changements dans le département

      res.status(201).json({ message: "Session added successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  Instructor_modify_Session_In_department: async (req, res) => {
    try {
      const {
        Title,
        Description,
        Date,
        Room,
        Instructor: InstructorName,
        sessionId,
      } = req.body;

      const existingSession = await session.findById(sessionId);
      if (!existingSession) {
        return res.status(404).json({ message: "Session not found" });
      }

      console.log("Initial session:", existingSession);
      console.log("Request body:", req.body);

      const id_instr = await Instructor.findOne({ NomPrenom: InstructorName })
        .populate("_id")
        .exec();
      console.log(id_instr);

      const sessionData = {
        Title,
        Description,
        Date: Date,
        Room,
        instructorId: id_instr,
      };

      const update = await session.updateOne({ _id: sessionId }, sessionData);

      if (update.nModified === 0) {
        return res
          .status(404)
          .json({ message: "No changes were made to the session" });
      }

      res.status(200).json({
        message: "Session updated successfully",
        session: sessionData, // Renvoie les nouvelles données de la session
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error in updating session", error: error.message });
      console.error(error);
    }
  },

  getSessionsByInstructor: async (req, res) => {
    try {
      const { instructorId } = req.params;

      // Vérifiez si l'instructeur existe
      const instructorExists = await Instructor.findById(instructorId);
      if (!instructorExists) {
        return res.status(404).json({ message: "Instructor not found" });
      }

      // Trouvez toutes les sessions liées à cet instructeur
      const sessions = await session.find({ Instructor: instructorId });

      res.status(200).json(sessions);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving sessions", error: error.message });
    }
  },

  // à tester selon l'order
  getSessionsByDepartment: async (req, res) => {
    try {
      const { DepartmentId } = req.params;
      console.log(DepartmentId);

      const departmentExists = await department.findById(DepartmentId);
      if (!departmentExists) {
        return res.status(404).json({ message: "Department not found" });
      }

      const sessions = await session
        .find({
          _id: { $in: departmentExists.sessions },
        })
        .populate({
          path: "Instructor",
          select: "NomPrenom -_id -__t",
          options: { sort: { createdAt: -1 } },
        })
        .sort({ createdAt: -1 })
        .exec();

      // Modifier la structure des données pour correspondre à ce qui est demandé
      const formattedSessions = sessions.map((session) => ({
        _id: session._id,
        Title: session.Title,
        Description: session.Description,
        Instructor: session.Instructor.NomPrenom, // Récupérer le nom de l'instructeur
        Date: session.Date,
        Room: session.Room,
      }));

      res.status(200).json(formattedSessions);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving sessions", error: error.message });
    }
  },

  delete_Session_By_Instructor: async (req, res) => {
    try {
      const id = req.params.id;
      const MySession = await session.findById(id);
      if (!MySession) {
        return res.status(404).json({ message: "Session not found" });
      }
      const Mydepartment = await department.findById(MySession.DepartmentId);
      if (!Mydepartment) {
        return res.status(404).json({ message: "Department not found" });
      }
      Mydepartment.sessions.pop(MySession._id);
      await Mydepartment.save(); // Sauvegarde les changements dans le département

      const deleted = await session.deleteOne({ _id: id });
      if (deleted.deletedCount === 0) {
        return res.status(404).json({ message: "session not found" });
      }
      res.status(200).json({ message: "session deleted successfully" });
    } catch (error) {
      res.status(404).json({ message: "Error in deleting session" });
    }
  },

  getSessionsForAdmin: async (req, res) => {
    try {
      const sessions = await session
        .find()
        .populate({
          path: "Instructor",
          select: "NomPrenom -_id -__t",
          options: { sort: { createdAt: -1 } },
        })
        .exec();

      const formattedSessions = sessions.map((session) => ({
        _id: session._id,
        Title: session.Title,
        Description: session.Description,
        Instructor: session.Instructor.NomPrenom,
        Date: session.Date,
        Room: session.Room,
      }));

      res.status(200).json(formattedSessions);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving sessions", error: error.message });
    }
  },
};

module.exports = controller;
