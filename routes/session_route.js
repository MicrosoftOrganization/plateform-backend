const express = require('express')
const route = express.Router()
const SessionController = require('../controllers/session_controller')
const { Member } = require('../models/user')

/**
 * @swagger
 * /api/session/add-session-in-department:
 *   post:
 *     summary: Ajouter une session à un département
 *     description: Ajoute une nouvelle session à un département en l'associant à un instructeur avec les informations fournies dans le corps de la requête.
 *     tags:
 *       - Sessions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DepartmentId:
 *                 type: string
 *                 example: "615c1bc5e70b7e6f30f8f99c"
 *                 description: L'ID du département auquel la session sera associée
 *               InstructorId:
 *                 type: string
 *                 example: "615c1bc5e70b7e6f30f8f123"
 *                 description: L'ID de l'instructeur qui gérera la session
 *               Title:
 *                 type: string
 *                 example: "Session de mathématiques"
 *                 description: Le titre de la session
 *               Description:
 *                 type: string
 *                 example: "Cours de mathématiques pour le niveau intermédiaire"
 *                 description: La description de la session
 *               Room:
 *                 type: string
 *                 example: "M12"
 *                 description: La salle où se tiendra la session
 *               Date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-01T09:00:00Z"
 *                 description: La date et l'heure de la session
 *     responses:
 *       201:
 *         description: Session créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session added successfully"
 *                 session:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "615c1bc5e70b7e6f30f8f456"
 *                     Title:
 *                       type: string
 *                       example: "Session de mathématiques"
 *                     Description:
 *                       type: string
 *                       example: "Cours de mathématiques pour le niveau intermédiaire"
 *                     Room:
 *                       type: string
 *                       example: "M12"
 *                     Date:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-01T09:00:00Z"
 *                     Instructor:
 *                       type: string
 *                       example: "615c1bc5e70b7e6f30f8f123"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     DepartmentId:
 *                       type: string
 *                       example: "615c1bc5e70b7e6f30f8f99c"
 *       404:
 *         description: Département non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Department not found"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error adding session to department"
 */
route.post(
  '/add-session-in-department',
  SessionController.Instructor_add_Session_In_department
)
/**
 * @swagger
 * /api/session/Instructor_modify_Session_In_department:
 *   put:
 *     summary: Modifier une session
 *     description: Modifie une session existante en utilisant l'ID de la session et les nouvelles informations fournies dans le corps de la requête.
 *     tags:
 *       - Sessions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "670e4d04102fdf92da5b89b0"
 *                 description: L'ID de la session à modifier
 *               Title:
 *                 type: string
 *                 example: "Session de mathématiques avancée"
 *                 description: Le titre de la session
 *               Description:
 *                 type: string
 *                 example: "Cours de mathématiques pour le niveau avancé"
 *                 description: La description de la session
 *               Room:
 *                 type: string
 *                 example: "M12"
 *                 description: La salle de la session
 *               Date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-15T10:00:00Z"
 *                 description: Date et heure de la session
 *     responses:
 *       200:
 *         description: Session modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session updated successfully"
 *                 updatedSession:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "670e4d04102fdf92da5b89b0"
 *                     Title:
 *                       type: string
 *                       example: "Session de mathématiques avancée"
 *                     Description:
 *                       type: string
 *                       example: "Cours de mathématiques pour le niveau avancé"
 *                     Date:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-15T10:00:00Z"
 *                     Instructor:
 *                       type: string
 *                       example: "615c1bc5e70b7e6f30f8f123"
 *                     Room:
 *                       type: string
 *                       example: "M12"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-02T15:00:00Z"
 *       404:
 *         description: Session non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session not found"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating session"
 */
route.put(
  '/Instructor_modify_Session_In_department',
  SessionController.Instructor_modify_Session_In_department
)

/**
 * @swagger
 * /api/session/department/{DepartmentId}:
 *   get:
 *     summary: Récupérer les sessions par département
 *     description: Récupère toutes les sessions associées à un département spécifique en fonction de son ID.
 *     tags:
 *       - Sessions
 *     parameters:
 *       - name: DepartmentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "615c1bc5e70b7e6f30f8f99c"
 *           description: L'ID du département
 *     responses:
 *       200:
 *         description: Liste des sessions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   Title:
 *                     type: string
 *                     example: "Advanced Web Development"
 *                   Description:
 *                     type: string
 *                     example: "A deep dive into modern web development practices."
 *                   Instructor:
 *                     type: string
 *                     example: "615c1bc5e70b7e6f30f8f99c"
 *                   Date:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-03T14:00:00Z"
 *       404:
 *         description: Département non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Department not found"
 *       500:
 *         description: Erreur serveur lors de la récupération des sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving sessions"
 */
route.get(
  '/department/:DepartmentId',
  SessionController.getSessionsByDepartment
)
/**
 * @swagger
 * /api/session/{id}:
 *   delete:
 *     summary: Supprimer une session par instructeur
 *     description: Supprime une session en fonction de son ID et la retire également de la liste des sessions du département associé.
 *     tags:
 *       - Sessions
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: L'ID de la session à supprimer
 *         example: "616c1c65e70b7e6f30f8fa12"
 *     responses:
 *       200:
 *         description: Session supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "session deleted successfully"
 *       404:
 *         description: Session ou Département non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session not found"
 *       500:
 *         description: Erreur serveur lors de la suppression de la session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error in deleting session"
 */
route.delete('/:id', SessionController.delete_Session_By_Instructor)

/**
 * @swagger
 * /api/session/{instructorId}:
 *   get:
 *     summary: Pas encore implementer dans le front Récupérer les sessions par instructeur
 *     description: Récupère toutes les sessions associées à un instructeur spécifique en fonction de son ID.
 *     tags:
 *       - Sessions
 *     parameters:
 *       - name: instructorId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "615c1bc5e70b7e6f30f8f99c"
 *           description: L'ID de l'instructeur
 *     responses:
 *       200:
 *         description: Liste des sessions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   Title:
 *                     type: string
 *                     example: "Introduction to AI"
 *                   Description:
 *                     type: string
 *                     example: "Learn the basics of artificial intelligence."
 *                   Instructor:
 *                     type: string
 *                     example: "615c1bc5e70b7e6f30f8f99c"
 *                   Date:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-02T10:00:00Z"
 *       404:
 *         description: Instructeur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Instructor not found"
 *       500:
 *         description: Erreur serveur lors de la récupération des sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving sessions"
 */
route.get('/:instructorId', SessionController.getSessionsByInstructor)

module.exports = route
