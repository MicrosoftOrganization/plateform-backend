const Assignment = require("../models/assignment");
const { department } = require("../models/department");

const assignmentController = {
  // a tester order
  Member_get_assignments_of_his_department: async (req, res) => {
    try {
      const { departmentId } = req.params;

      const departmentExists = await department
        .findById(departmentId)
        .populate({
          path: "assignments",
          select: "Title Description DueDate Attachments",
          options: { sort: { createdAt: -1 } },
        });

      if (!departmentExists) {
        return res.status(404).json({ message: "Department not found" });
      }

      res.status(200).json(
        departmentExists.assignments // Renvoie les assignments peuplés
      );
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving assignments",
        error: error.message,
      });
    }
  },

  addAssignment: async (req, res) => {
    try {
      const { departmentId } = req.params;
      const {
        Title,
        Description,
        DueDate,
        Instructor,
        Attachments,
        Responses,
      } = req.body;
      console.log(req.body);
      // Vérifier si le département existe
      const departmentFind = await department.findById(departmentId);
      if (!departmentFind) {
        return res.status(404).json({ message: "Department not found" });
      }

      // Créer le nouvel assignment
      const newAssignment = new Assignment({
        Title,
        Description,
        DueDate,
        Instructor,
        Attachments,
        Responses,
      });

      // Sauvegarder l'assignement dans la base de données
      const savedAssignment = await newAssignment.save();

      // Ajouter l'assignement à la liste des assignments du département
      departmentFind.assignments.push(savedAssignment._id);

      // Sauvegarder les modifications dans le département
      await departmentFind.save();

      // Renvoyer la réponse avec le nouvel assignment
      res.status(201).json({
        message: "Assignment added to department successfully",
        assignment: savedAssignment,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // à tester plus tard et à modifier les paramètre de la request dans le front
  deleteAssignment: async (req, res) => {
    try {
      const { assignmentId, departmentId } = req.params;
      const assignement = await Assignment.findById(assignmentId);
      if (assignement) {
        const departement = await department.findById(departmentId);
        if (!departement) {
          throw new Error("Department not found ");
        }
        console.log("dep", departement.assignments);
        departement.assignments = departement.assignments.filter(
          (Element) => Element.toString() !== assignmentId
        );
        await departement.save();
        await Assignment.deleteOne({ _id: assignmentId });
      }
      res.status(200).json({ message: "Assignment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedAssignment = await Assignment.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      res.status(200).json({
        message: "Assignment updated successfully",
        updatedAssignment,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // remarque Mariem : get assignments tejibelik les assignments mta3 ay department
  // autrement peux import il sessions

  getAssignments: async (req, res) => {
    try {
      const assignments = await Assignment.find();
      res.status(200).json(assignments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAssignmentById: async (req, res) => {
    try {
      const { id } = req.params;
      const assignment = await Assignment.findById(id);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      res.status(200).json(assignment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = assignmentController;
