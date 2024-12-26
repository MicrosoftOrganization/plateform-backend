// const express = require("express");
// const controller = require("../controllers/chat_controller");
// const {
//   authenticateJWT,
//   authorizeRoles,
// } = require("../middlewares/VerifyToken");

// const route = express.Router();
// /**
//  * @swagger
//  * /api/chats/:
//  *   post:
//  *     summary: Créer une conversation privée
//  *     description: Cette route permet de créer une conversation privée entre deux participants. Si la conversation existe déjà, elle est renvoyée.
//  *     tags:
//  *       - Chats
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               Instructor:
//  *                 type: string
//  *                 description: ID du premier participant
//  *                 example: 67479d55664b9e57631c0fc3
//  *               Member:
//  *                 type: string
//  *                 description: ID du deuxième participant
//  *                 example: 67437f91ce3f5141713ef557
//  *               DepartmentId:
//  *                 type: string
//  *                 description: ID du Department
//  *                 example: 670ae2f9684fce305e8e8348
//  *     responses:
//  *       200:
//  *         description: Conversation existante ou créée avec succès
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Nouvelle conversation créée.
//  *                 chat:
//  *                   type: object
//  *                   description: Les détails de la conversation
//  *       400:
//  *         description: Erreur de validation ou autre problème
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Les deux participants sont requis.
//  */

// route.post(
//   "/",
//   authenticateJWT,
//   authorizeRoles("instructor", "superAdmin"),
//   controller.addChat
// );
// /**
//  * @swagger
//  * /api/chats/{instructorId}:
//  *   get:
//  *     summary: "Récupérer les conversations par ID de l'instructeur"
//  *     description: "Cette route permet de récupérer toutes les conversations associées à un instructeur donné."
//  *     tags:
//  *       - Chats
//  *     operationId: "getChatsByInstructorId"
//  *     parameters:
//  *       - name: "instructorId"
//  *         in: "path"
//  *         description: "ID de l'instructeur pour lequel récupérer les conversations"
//  *         required: true
//  *         type: "string"
//  *     responses:
//  *       200:
//  *         description: "Conversations récupérées avec succès"
//  *         schema:
//  *           type: "object"
//  *           properties:
//  *             message:
//  *               type: "string"
//  *               example: "Conversations récupérées avec succès."
//  *             chats:
//  *               type: "array"
//  *               items:
//  *                 type: "object"
//  *                 properties:
//  *                   _id:
//  *                     type: "string"
//  *                     example: "634567890abcf134567890cd"
//  *                   Instructor:
//  *                     type: "object"
//  *                     properties:
//  *                       _id:
//  *                         type: "string"
//  *                         example: "67479d55664b9e57631c0fc3"
//  *                       name:
//  *                         type: "string"
//  *                         example: "John Doe"
//  *                   Member:
//  *                     type: "object"
//  *                     properties:
//  *                       _id:
//  *                         type: "string"
//  *                         example: "67437f91ce3f5141713ef557"
//  *                       name:
//  *                         type: "string"
//  *                         example: "Jane Smith"
//  *                   isGroup:
//  *                     type: "boolean"
//  *                     example: false
//  *       404:
//  *         description: "Aucune conversation trouvée pour cet instructeur"
//  *         schema:
//  *           type: "object"
//  *           properties:
//  *             message:
//  *               type: "string"
//  *               example: "Aucune conversation trouvée."
//  *       500:
//  *         description: "Erreur serveur interne"
//  *         schema:
//  *           type: "object"
//  *           properties:
//  *             message:
//  *               type: "string"
//  *               example: "Erreur serveur."
//  *             error:
//  *               type: "string"
//  *               example: "Erreur lors de la récupération des chats : <message d'erreur>"
//  */
// route.get(
//   "/:instructorId",
//   authenticateJWT,
//   authorizeRoles("instructor", "superAdmin"),
//   controller.getChatsByInstructorId
// );
// /**
//  * @swagger
//  * /api/chats/addMessage:
//  *   post:
//  *     tags:
//  *       - Messages
//  *     summary: Ajouter un nouveau message
//  *     description: Crée un nouveau message et l'ajoute au chat correspondant.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               senderId:
//  *                 type: string
//  *                 description: ID de l'expéditeur (Instructor).
//  *               text:
//  *                 type: string
//  *                 description: Contenu du message.
//  *               chatId:
//  *                 type: string
//  *                 description: ID du chat où le message sera ajouté.
//  *             required:
//  *               - senderId
//  *               - text
//  *               - chatId
//  *           examples:
//  *             Exemple 1:
//  *               value:
//  *                 senderId: "647abc123def456789ghijkl"
//  *                 text: "Bonjour, ceci est un message test."
//  *                 chatId: "123abc456def789ghi012jkl"
//  *     responses:
//  *       201:
//  *         description: Message créé avec succès.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Message créé avec succès."
//  *                 savedMessage:
//  *                   type: object
//  *                   properties:
//  *                     _id:
//  *                       type: string
//  *                     chat:
//  *                       type: string
//  *                     sender:
//  *                       type: string
//  *                     text:
//  *                       type: string
//  *                     createdAt:
//  *                       type: string
//  *                       format: date-time
//  *                     updatedAt:
//  *                       type: string
//  *                       format: date-time
//  *       404:
//  *         description: Chat ou expéditeur introuvable.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *             examples:
//  *               Chat introuvable:
//  *                 value:
//  *                   message: "Chat introuvable."
//  *               Expéditeur introuvable:
//  *                 value:
//  *                   message: "Expéditeur introuvable."
//  *       500:
//  *         description: Erreur serveur.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Erreur serveur."
//  *                 error:
//  *                   type: string
//  */
// route.post(
//   "/addMessage",
//   authenticateJWT,
//   authorizeRoles("instructor", "superAdmin"),
//   controller.addMessage
// );

// /**
//  * @swagger
//  * /api/chats/getChat/{chatId}:
//  *   get:
//  *     summary: "Récupérer les messages par ID du chat"
//  *     description: "Cette route permet de récupérer tous les messages associés à un chat spécifique."
//  *     tags:
//  *       - Chats
//  *     operationId: "getMessagesByChatId"
//  *     parameters:
//  *       - name: "chatId"
//  *         in: "path"
//  *         description: "ID du chat pour lequel récupérer les messages"
//  *         required: true
//  *         schema:
//  *           type: "string"
//  *           example: "634567890abcf134567890cd"
//  *     responses:
//  *       200:
//  *         description: "Messages récupérés avec succès"
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: "object"
//  *               properties:
//  *                 message:
//  *                   type: "string"
//  *                   example: "Messages récupérés avec succès."
//  *                 chat:
//  *                   type: "object"
//  *                   properties:
//  *                     _id:
//  *                       type: "string"
//  *                       example: "634567890abcf134567890cd"
//  *                     Instructor:
//  *                       type: "object"
//  *                       properties:
//  *                         _id:
//  *                           type: "string"
//  *                           example: "67479d55664b9e57631c0fc3"
//  *                         NomPrenom:
//  *                           type: "string"
//  *                           example: "John Doe"
//  *                         Email:
//  *                           type: "string"
//  *                           example: "john.doe@example.com"
//  *                     Member:
//  *                       type: "object"
//  *                       properties:
//  *                         _id:
//  *                           type: "string"
//  *                           example: "67437f91ce3f5141713ef557"
//  *                         NomPrenom:
//  *                           type: "string"
//  *                           example: "Jane Smith"
//  *                         Email:
//  *                           type: "string"
//  *                           example: "jane.smith@example.com"
//  *                     messages:
//  *                       type: "array"
//  *                       items:
//  *                         type: "object"
//  *                         properties:
//  *                           content:
//  *                             type: "string"
//  *                             example: "Bonjour, comment allez-vous ?"
//  *                           sender:
//  *                             type: "object"
//  *                             properties:
//  *                               _id:
//  *                                 type: "string"
//  *                                 example: "67479d55664b9e57631c0fc3"
//  *                               NomPrenom:
//  *                                 type: "string"
//  *                                 example: "John Doe"
//  *                               Email:
//  *                                 type: "string"
//  *                                 example: "john.doe@example.com"
//  *                           timestamp:
//  *                             type: "string"
//  *                             format: "date-time"
//  *                             example: "2024-12-04T10:15:30.000Z"
//  *       404:
//  *         description: "Chat introuvable"
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: "object"
//  *               properties:
//  *                 message:
//  *                   type: "string"
//  *                   example: "Chat introuvable."
//  *       500:
//  *         description: "Erreur serveur interne"
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: "object"
//  *               properties:
//  *                 message:
//  *                   type: "string"
//  *                   example: "Erreur serveur."
//  *                 error:
//  *                   type: "string"
//  *                   example: "Erreur lors de la récupération des messages : <message d'erreur>"
//  */
// route.get(
//   "/getChat/:chatId",
//   authenticateJWT,
//   authorizeRoles("instructor", "superAdmin"),
//   controller.getMessagesByChatId
// );

// /**
//  * @swagger
//  * /api/chats/addMessageByAdmin:
//  *   post:
//  *     tags:
//  *       - Messages
//  *     summary: Ajouter un message par un administrateur
//  *     description: Crée un nouveau message et l'ajoute à la conversation correspondante. Permet également aux administrateurs d'ajouter des messages.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               senderId:
//  *                 type: string
//  *                 description: ID de l'expéditeur (Instructor, Member ou administrateur).
//  *               text:
//  *                 type: string
//  *                 description: Contenu du message.
//  *               chatId:
//  *                 type: string
//  *                 description: ID du chat où le message sera ajouté.
//  *               isAdmin:
//  *                 type: boolean
//  *                 description: Indique si l'expéditeur est un administrateur.
//  *             required:
//  *               - senderId
//  *               - text
//  *               - chatId
//  *               - isAdmin
//  *           examples:
//  *             Exemple 1:
//  *               value:
//  *                 senderId: "647abc123def456789ghijkl"
//  *                 text: "Bonjour, ceci est un message ajouté par un administrateur."
//  *                 chatId: "123abc456def789ghi012jkl"
//  *                 isAdmin: true
//  *             Exemple 2:
//  *               value:
//  *                 senderId: "647abc123def456789mnopqr"
//  *                 text: "Message envoyé par un utilisateur classique."
//  *                 chatId: "123abc456def789ghi012stu"
//  *                 isAdmin: false
//  *     responses:
//  *       201:
//  *         description: Message ajouté avec succès.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Message ajouté avec succès."
//  *                 savedMessage:
//  *                   type: object
//  *                   properties:
//  *                     _id:
//  *                       type: string
//  *                       example: "647abc123def456789ghijkl"
//  *                     chat:
//  *                       type: string
//  *                       example: "123abc456def789ghi012jkl"
//  *                     sender:
//  *                       type: string
//  *                       example: "647abc123def456789mnopqr"
//  *                     text:
//  *                       type: string
//  *                       example: "Bonjour, ceci est un message test."
//  *                     createdAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: "2024-12-06T12:34:56.789Z"
//  *                     updatedAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: "2024-12-06T12:34:56.789Z"
//  *       404:
//  *         description: Chat ou expéditeur introuvable.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Chat introuvable."
//  *             examples:
//  *               Chat introuvable:
//  *                 value:
//  *                   message: "Chat introuvable."
//  *               Expéditeur introuvable:
//  *                 value:
//  *                   message: "Expéditeur introuvable."
//  *       403:
//  *         description: Accès interdit.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Le sender ne fait pas partie de ce chat ou n'est pas un administrateur."
//  *       500:
//  *         description: Erreur serveur.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Erreur serveur."
//  *                 error:
//  *                   type: string
//  *                   example: "Détail de l'erreur."
//  */
// route.post(
//   "/addMessageByAdmin",
//   authenticateJWT,
//   authorizeRoles("superAdmin"),
//   controller.addMessageByAdmin
// );

// module.exports = route;
