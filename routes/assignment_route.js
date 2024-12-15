const express = require('express')
const route = express.Router()
const assignmentController = require('../controllers/assignment_controller')

/**
 * @swagger
 * /api/assignment/department/{departmentId}:
 *   get:
 *     summary: Récupérer la liste des assignments à partir d'un department
 *     tags:
 *       - Assignment
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         description: L'ID du département
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID de la session
 *                   Assignment:
 *                     type: string
 *                     description: Détails de l'assignement de la session
 *       404:
 *         description: Département non trouvé ou erreurs lors de la récupération des assignments
 */
route.get(
  '/department/:departmentId',
  assignmentController.Member_get_assignments_of_his_department
)

/**
 * @swagger
 * /api/assignment/department/{departmentId}/addAssignment:
 *   post:
 *     summary: Ajouter un nouvel assignment à un département
 *     description: Cette route permet d'ajouter un assignment à un département spécifique via l'ID du département.
 *     tags:
 *       - Assignment
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du département auquel l'assignement sera ajouté
 *         example: "66fd5e20eac555ee63ec2d9d"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *                 description: Titre de l'Assignment
 *                 example: "Introduction to Web Development"
 *               Description:
 *                 type: string
 *                 description: Description de l'Assignment
 *                 example: "Build a simple static website using HTML, CSS, and JavaScript."
 *               DueDate:
 *                 type: string
 *                 format: date
 *                 description: Date limite de l'Assignment
 *                 example: "2024-11-30"
 *               Instructor:
 *                 type: string
 *                 description: ID de l'instructeur qui ajoute l'Assignment
 *                 example: "64fbad8b6c598b43d788a843"
 *               Attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liens vers des ressources supplémentaires
 *                 example: ["link-to-resource1", "link-to-resource2"]
 *               Responses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Soumissions des étudiants (initialement vide)
 *                 example: []
 *     responses:
 *       201:
 *         description: Assignment créé et ajouté au département avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Assignment created successfully"
 *                 assignment:
 *                   $ref: '#/components/schemas/Assignment'
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
 *         description: Erreur lors de la création de l'Assignment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
route.post(
  '/department/:departmentId/addAssignment',
  assignmentController.addAssignment
)

/**
 * @swagger
 * /api/assignment/updateAssignment/{id}:
 *   put:
 *     summary: Met à jour un assignment par ID
 *     description: Permet de modifier les détails d'un assignment existant.
 *     tags: [Assignment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'assignment à mettre à jour
 *         schema:
 *           type: string
 *       - in: body
 *         name: body
 *         required: true
 *         description: Détails de l'assignment mis à jour
 *         schema:
 *           type: object
 *           properties:
 *             Title:
 *               type: string
 *               example: "Titre modifié de l'Assignment"
 *             Description:
 *               type: string
 *               example: "Nouvelle description de l'Assignment"
 *             DueDate:
 *               type: string
 *               format: date-time
 *               example: "2024-12-10T10:00:00Z"
 *             Instructor:
 *               type: string
 *               example: "Nom de l'instructeur"
 *             Responses:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Réponse 1", "Réponse 2"]
 *     responses:
 *       200:
 *         description: Assignment mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Assignment updated successfully"
 *                 updatedAssignment:
 *                   $ref: '#/definitions/Assignment'
 *       404:
 *         description: Assignment introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Assignment not found"
 *       500:
 *         description: Erreur serveur
 */
route.put('/updateAssignment/:id', assignmentController.updateAssignment)

/**
 * @swagger
 * /api/assignment/delete/{id}:
 *   delete:
 *     summary: Supprime un assignement existant et met à jour le département associé
 *     tags:
 *       - Assignment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant de l'assignement à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assignement supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation de la suppression
 *       404:
 *         description: Assignement ou département non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur indiquant que l'assignement ou le département est introuvable
 *       500:
 *         description: Erreur serveur lors de la suppression de l'assignement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message détaillant l'erreur survenue
 */
route.delete('/deleteAssignment/:id', assignmentController.deleteAssignment)

/**
 * @swagger
 * /api/assignment/getAssignments:
 *   get:
 *     summary: Récupérer la liste des assignments
 *     tags:
 *       - Assignment
 *     responses:
 *       200:
 *         description: Liste des assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *
 *       404:
 *         description: Erreur lors de la récupération des membres
 */
route.get('/getAssignments', assignmentController.getAssignments)

/**
 * @swagger
 * /api/assignment/getAssignmentById/{id}:
 *   get:
 *     summary: Pas encore implémenté , Récupère un assignment par ID
 *     description: Permet de récupérer un assignment spécifique grâce à son ID.
 *     tags:
 *       - Assignment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'assignment à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assignment récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: Assignment introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Assignment not found"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
route.get('/getAssignmentById/:id', assignmentController.getAssignmentById)

module.exports = route
