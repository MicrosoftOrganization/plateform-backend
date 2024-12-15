const express = require('express')
const response_controller = require('../controllers/response_controller')

const route = express.Router()

/**
 * @swagger
 * /api/response/responses:
 *   get:
 *     summary: Récupère toutes les réponses
 *     tags: [Responses]
 *     responses:
 *       200:
 *         description: Une liste de toutes les réponses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Response'
 *       500:
 *         description: Erreur serveur lors de la récupération des réponses
 */
route.get('/responses', response_controller.Display_All)

/**
 * @swagger
 * /api/response/responsesByAssignment/{Assignment_id}:
 *   get:
 *     summary: Récupère toutes les réponses pour un assignement spécifique
 *     tags: [Responses]
 *     parameters:
 *       - in: path
 *         name: Assignment_id
 *         required: true
 *         description: ID de l'assignement pour lequel récupérer les réponses
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Une liste de toutes les réponses pour l'assignement spécifié
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Response'
 *       500:
 *         description: Erreur serveur lors de la récupération des réponses
 */
route.get(
  '/responsesByAssignment/:Assignment_id',
  response_controller.Display_Responses_By_Assignment_Id
)

/**
 * @swagger
 * /api/response/responses:
 *   post:
 *     summary: Créer une nouvelle réponse
 *     tags: [Responses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID de l'utilisateur
 *                 example: "6532ab12345678f1abc"
 *               assignmentId:
 *                 type: string
 *                 description: ID de l'assignement
 *                 example: "7e32ab1234bb78f1xyz"
 *               content:
 *                 type: string
 *                 description: Contenu de la réponse
 *                 example: "Voici ma réponse à l'assignement."
 *     responses:
 *       201:
 *         description: La réponse a été créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: L'utilisateur a déjà soumis une réponse pour cet assignment
 *       404:
 *         description: Assignment non trouvé
 *       500:
 *         description: Erreur serveur lors de la création de la réponse
 */
route.post('/responses', response_controller.create_Response)

/**
 * @swagger
 * /api/response/responsesByAssignmentIdAndUserId:
 *   get:
 *     summary: Récupérer une réponse par Assignment ID et User ID
 *     tags: [Responses]
 *     parameters:
 *       - in: query
 *         name: assignmentId
 *         required: true
 *         description: ID de l'assignement
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réponse trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 User_id:
 *                   type: string
 *                 Assignment_id:
 *                   type: string
 *                 Content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Réponse non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
route.get(
  '/responsesByAssignmentIdAndUserId',
  response_controller.Fetch_Response_By_Assignment_And_User
)

/**
 * @swagger
 * /api/response/update/{id}:
 *   put:
 *     summary: Mettre à jour une réponse
 *     tags: [Responses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réponse à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Content:
 *                 type: string
 *                 description: Nouveau contenu de la réponse
 *                 example: "Nouveau contenu de la réponse"
 *               status:
 *                 type: string
 *                 description: Statut de la réponse
 *                 example: "APPROVED"
 *     responses:
 *       200:
 *         description: Réponse mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Réponse mise à jour avec succès"
 *       404:
 *         description: Réponse non trouvée ou aucune modification effectuée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Réponse non trouvée ou aucune modification effectuée."
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur lors de la mise à jour de la réponse"
 *                 error:
 *                   type: string
 *                   example: "Détail de l'erreur"
 */
route.put('/update/:id', response_controller.update_Response_By_Member)
// pas encore implementer
/**
 * @swagger
 * /api/response/{id}:
 *   delete:
 *     summary: Pas encore implementer dans le front Supprimer une réponse
 *     description: Supprime une réponse en utilisant son ID et met à jour les Assignments associés pour retirer cette réponse.
 *     tags:
 *       - Responses-Pas encore implementer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID de la réponse à supprimer.
 *         schema:
 *           type: string
 *           example: "64f7c53e1fdfef0029f3e8c9"
 *     responses:
 *       200:
 *         description: Réponse supprimée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Réponse supprimée avec succès"
 *       404:
 *         description: Réponse non trouvée.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Réponse non trouvée"
 *       500:
 *         description: Erreur serveur lors de la suppression de la réponse.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur lors de la suppression de la réponse"
 *                 error:
 *                   type: string
 *                   example: "Détails de l'erreur"
 */
route.delete('/:id', response_controller.delete_Response)
/**
 * @swagger
 * /api/response/{id}:
 *   get:
 *     summary: Trouver une réponse par ID à modifier les attributs renvoyés dans la reponse
 *     description: Récupère une réponse en utilisant son ID, avec les détails des utilisateurs et des assignments associés (via la méthode populate).
 *     tags:
 *       - Responses-Pas encore implementer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID de la réponse à récupérer.
 *         schema:
 *           type: string
 *           example: "64f7c53e1fdfef0029f3e8c9"
 *     responses:
 *       200:
 *         description: Réponse trouvée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64f7c53e1fdfef0029f3e8c9"
 *                 User_id:
 *                   type: object
 *                   description: Détails de l'utilisateur associé.
 *                 Assignment_id:
 *                   type: object
 *                   description: Détails de l'assignement associé.
 *                 content:
 *                   type: string
 *                   example: "Ceci est le contenu de la réponse."
 *       404:
 *         description: Réponse non trouvée.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cette réponse n'existe pas"
 *       500:
 *         description: Erreur serveur lors de la récupération de la réponse.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur lors de la récupération de la réponse"
 *                 error:
 *                   type: string
 *                   example: "Détails de l'erreur"
 */
route.get('/:id', response_controller.findResponsebyId)

module.exports = route
