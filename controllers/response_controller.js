const Response = require("./../models/response");
const Assignment = require("../models/assignment");

const controller = {
  // Afficher toutes les réponses
  Display_All: async (req, res) => {
    try {
      const responses = await Response.find()
        .select("Content status User_id Assignment_id createdAt") // Sélectionne les champs nécessaires, y compris createdAt
        .populate({
          path: "User_id",
          select: "NomPrenom", // Sélectionne uniquement le champ NomPrenom
        });

      // Transforme les réponses pour obtenir le format souhaité
      const formattedResponses = responses.map((response) => ({
        _id: response._id,
        Content: response.Content,
        Member: {
          _id: response.User_id._id,
          NomPrenom: response.User_id.NomPrenom,
        },
        Assignment_id: response.Assignment_id,
        status: response.status,
        createdAt: response.createdAt, // Ajoute createdAt ici
      }));

      res.status(200).json(formattedResponses);
    } catch (error) {
      res.status(500).json({
        message: "Erreur serveur lors de la récupération des réponses",
        error: error.message,
      });
    }
  },
  Display_Responses_By_Assignment_Id: async (req, res) => {
    try {
      const { Assignment_id } = req.params;
      const responses = await Response.find({ Assignment_id: Assignment_id })
        .select("Content status User_id Assignment_id createdAt") // Sélectionne les champs nécessaires, y compris createdAt
        .populate({
          path: "User_id",
          select: "NomPrenom Email", // Sélectionne uniquement le champ NomPrenom
        });

      // Transforme les réponses pour obtenir le format souhaité
      const formattedResponses = responses.map((response) => ({
        _id: response._id,
        Content: response.Content,
        Member: {
          _id: response.User_id._id,
          NomPrenom: response.User_id.NomPrenom,
          Email: response.User_id.Email,
        },
        Assignment_id: response.Assignment_id,
        status: response.status,
        createdAt: response.createdAt, // Ajoute createdAt ici
      }));

      res.status(200).json(formattedResponses);
    } catch (error) {
      res.status(500).json({
        message: "Erreur serveur lors de la récupération des réponses",
        error: error.message,
      });
    }
  },

  // Soummettre une réponse dans la partie du member
  create_Response: async (req, res) => {
    const { userId, assignmentId, content } = req.body;

    try {
      // Vérifier si l'Assignment existe avant de créer la réponse
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment non trouvé." });
      }

      // Vérifier si une réponse existe déjà pour cet utilisateur et cet assignment
      const existingResponse = await Response.findOne({
        User_id: userId,
        Assignment_id: assignmentId,
      });

      if (existingResponse) {
        return res.status(400).json({
          message:
            "L'utilisateur a déjà soumis une réponse pour cet assignment.",
        });
      }

      // Créer une nouvelle réponse
      const response = new Response({
        Content: content,
        User_id: userId,
        Assignment_id: assignmentId,
      });

      // Sauvegarder la réponse
      const savedResponse = await response.save();

      // Mettre à jour l'Assignment pour inclure cette réponse
      assignment.Responses.push(savedResponse._id); // Ajout direct dans le tableau des réponses de l'Assignment
      await assignment.save(); // Sauvegarde de l'assignement avec la nouvelle réponse

      // Retourner la réponse créée
      res.status(201).json(savedResponse);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur lors de la création de la réponse",
        error: error.message,
      });
    }
  },
  Fetch_Response_By_Assignment_And_User: async (req, res) => {
    const { assignmentId, userId } = req.query;

    try {
      const response = await Response.findOne({
        Assignment_id: assignmentId,
        User_id: userId,
      });
      if (!response) {
        return res.status(404).json({ message: "Response not found" });
      }
      return res.json(response);
    } catch (error) {
      console.error("Error fetching response:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  update_Response_By_Member: async (req, res) => {
    try {
      const id = req.params.id;
      const update = await Response.updateOne({ _id: id }, req.body);

      if (update.modifiedCount === 0) {
        return res.status(404).json({
          message: "Réponse non trouvée ou aucune modification effectuée.",
        });
      }
      res.status(200).json({ message: "Réponse mise à jour avec succès" });
    } catch (error) {
      res.status(500).json({
        message: "Erreur serveur lors de la mise à jour de la réponse",
        error: error.message,
      });
    }
  },

  update_Response_Status_By_Instructor: async (req, res) => {
    try {
      const id = req.params.id;

      // Exécuter la mise à jour avec validation
      const updatedResponse = await Response.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      // Vérifier si la réponse existe
      if (!updatedResponse) {
        return res.status(404).json({
          message: "Réponse non trouvée.",
        });
      }

      res.status(200).json({
        message: "Réponse mise à jour avec succès",
        data: updatedResponse,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur serveur lors de la mise à jour de la réponse",
        error: error.message,
      });
    }
  },

  delete_Response: async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await Response.deleteOne({ _id: id });

      if (deleted.deletedCount === 0) {
        return res.status(404).json({ message: "Réponse non trouvée" });
      }

      // Mettre à jour l'Assignment pour retirer cette réponse
      await Assignment.updateMany({}, { $pull: { Responses: id } });

      res.status(200).json({ message: "Réponse supprimée avec succès" });
    } catch (error) {
      res.status(500).json({
        message: "Erreur serveur lors de la suppression de la réponse",
        error: error.message,
      });
    }
  },

  findResponsebyId: async (req, res) => {
    try {
      const id = req.params.id;
      const response = await Response.findById(id).populate(
        "User_id Assignment_id"
      );

      if (!response) {
        return res.status(404).json({ message: "Cette réponse n'existe pas" });
      }

      return res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        message: "Erreur serveur lors de la récupération de la réponse",
        error: error.message,
      });
    }
  },

  findResponsebyUserId: async (req, res) => {
    try {
      const id = req.params.id;
      const responses = await Response.find({ User_id: id }).populate(
        "Assignment_id"
      );

      if (!responses.length) {
        return res.status(404).json({
          message: "Cet utilisateur n'a pas encore soumis de réponses",
        });
      }

      return res.status(200).json(responses);
    } catch (error) {
      res.status(500).json({
        message: "Erreur serveur lors de la récupération des réponses",
        error: error.message,
      });
    }
  },
};

module.exports = controller;
