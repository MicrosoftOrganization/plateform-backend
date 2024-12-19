const express = require("express");
const route = express.Router();
const MemberController = require("../controllers/member_controller");
const authenticateJWT = require("../middlewares/VerifyToken");

/**
 * @swagger
 * /api/member/all/{departmentId}:
 *   get:
 *     summary: Récupérer la liste des membres d'un département spécifique
 *     tags:
 *       - "Member"
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         description: ID du département pour lequel récupérer les membres
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des membres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID du membre
 *                   NomPrenom:
 *                     type: string
 *                     description: Nom complet du membre
 *                   DepartmentIds:
 *                     type: string
 *                     description: Département du membre
 *                   ImageLink:
 *                     type: string
 *                     description: Lien de l'image de profil du membre
 *       404:
 *         description: Aucun membre trouvé ou département non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur
 *       500:
 *         description: Erreur serveur lors de la récupération des membres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur
 *                 error:
 *                   type: string
 *                   description: Détail de l'erreur
 */
route.get("/all/:departmentId", MemberController.afficher_All);
/**
 * @swagger
 * /api/member/admin/all:
 *   get:
 *     summary: Récupérer la liste des membres d'un département spécifique
 *     tags:
 *       - "Member"
 *     responses:
 *       200:
 *         description: Liste des membres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID du membre
 *                   NomPrenom:
 *                     type: string
 *                     description: Nom complet du membre
 *                   DepartmentIds:
 *                     type: string
 *                     description: Département du membre
 *                   ImageLink:
 *                     type: string
 *                     description: Lien de l'image de profil du membre
 *       404:
 *         description: Aucun membre trouvé ou département non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur
 *       500:
 *         description: Erreur serveur lors de la récupération des membres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur
 *                 error:
 *                   type: string
 *                   description: Détail de l'erreur
 */
route.get("/admin/all", MemberController.afficher_All_For_Admin);
/**
 * @swagger
 * /api/member/get-members-names:
 *   get:
 *     summary: Récupérer les noms des membres
 *     description: Retourne une liste des noms des membres ayant le rôle "member".
 *     tags:
 *       - Member
 *     responses:
 *       200:
 *         description: Liste des noms des membres retournée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   NomPrenom:
 *                     type: string
 *                     example: "John Doe"
 *       404:
 *         description: Erreur lors de la récupération des noms des membres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error in finding members"
 */
route.get("/get-members-names", MemberController.get_members_names);
/**
 * @swagger
 * /api/member/update/{id}:
 *   put:
 *     summary: Mettre à jour un membre existant
 *     tags:
 *       - "Member"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du membre à mettre à jour
 *     requestBody:
 *       description: Les informations à mettre à jour
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Membre mis à jour avec succès
 */
route.put("/update/:id", MemberController.update_Member);
/**
 * @swagger
 * /api/member/delete/{id}:
 *   delete:
 *     summary: Supprimer un membre
 *     tags:
 *       - "Member"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du membre à supprimer
 *     responses:
 *       200:
 *         description: Membre supprimé avec succès
 */
route.delete("/delete/:id", MemberController.delete_Member);
/**
 * @swagger
 * /api/member/create:
 *   post:
 *     summary: Créer un nouveau membre
 *     description: Crée un nouveau membre avec les informations fournies dans le corps de la requête.
 *     tags:
 *       - Member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NomPrenom:
 *                 type: string
 *                 example: "John Doe"
 *                 description: Nom et prénom du membre
 *               Email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *                 description: Email unique du membre
 *               Password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *                 description: Mot de passe du membre (au moins 8 caractères)
 *               Adresse:
 *                 type: string
 *                 example: "123 rue de Paris"
 *                 description: Adresse du membre
 *               ImageLink:
 *                 type: string
 *                 example: "http://example.com/image.jpg"
 *                 description: Lien vers l'image de profil du membre (optionnel)
 *               DepartmentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "615c1bc5e70b7e6f30f8f99c"
 *                   description: ID du département auquel le membre est associé
 *                 description: Liste des départements associés au membre
 *     responses:
 *       201:
 *         description: Membre créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Member created successfully"
 *                 Member:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     NomPrenom:
 *                       type: string
 *                     Email:
 *                       type: string
 *                     Role:
 *                       type: string
 *                       example: "member"
 *                     Adresse:
 *                       type: string
 *                     ImageLink:
 *                       type: string
 *                     DepartmentIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Liste des départements associés
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Champs obligatoires manquants dans la requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       500:
 *         description: Erreur serveur lors de la création du membre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error in creating Member"
 */
route.post("/create", MemberController.create_Member);
/*remarque DepartmentIds soit string soit array string les deux fonctionnent correctement
/* Fin Members */

/**
 * @swagger
 * /api/member/create-members:
 *   post:
 *     summary: implémenter dans le superAdmin dans upload , Créer plusieurs membres
 *     tags:
 *       - "Member-SuperAdmin"
 *     requestBody:
 *       description: Les informations du membre à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NomPrenom:
 *                 type: string
 *                 description: Le nom et prénom du membre
 *               Email:
 *                 type: string
 *                 format: email
 *                 description: L'adresse email du membre
 *               Password:
 *                 type: string
 *                 description: Le mot de passe du membre
 *                 minLength: 8
 *               Adresse:
 *                 type: string
 *                 description: L'adresse du membre
 *               ImageLink:
 *                 type: string
 *                 description: L'URL de l'image du membre (facultatif)
 *               DepartmentIds:
 *                 type: string
 *                 enum: [Basic, Intermediate, Advanced]
 *                 description: Le département auquel le membre appartient
 *             required:
 *               - NomPrenom
 *               - Email
 *               - Password
 *               - Adresse
 *               - DepartmentIds
 *     responses:
 *       201:
 *         description: Membre créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Member created successfully'
 *                 Member:
 *                   $ref: '#/components/schemas/Member'
 *       400:
 *         description: Champs requis manquants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Missing required fields'
 *       500:
 *         description: Erreur lors de la création du membre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error in creating Member'
 *                 error:
 *                   type: string
 *                   description: Détails de l'erreur
 */
route.post("/create-members", MemberController.create_Members);
/**
 * @swagger
 * /api/member/upload-many-members:
 *   post:
 *     summary: Créer plusieurs membres via un fichier upload (superAdmin)
 *     tags:
 *       - Member-SuperAdmin
 *     description: Cette route permet au superAdmin de créer plusieurs membres en une seule requête.
 *     requestBody:
 *       description: Les informations des membres à créer (tableau d'objets JSON)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 NomPrenom:
 *                   type: string
 *                   description: Le nom et prénom du membre
 *                   example: "John Doe"
 *                 Email:
 *                   type: string
 *                   format: email
 *                   description: L'adresse email du membre
 *                   example: "johndoe@example.com"
 *                 Password:
 *                   type: string
 *                   description: Le mot de passe du membre (minimum 8 caractères)
 *                   minLength: 8
 *                   example: "mypassword123"
 *                 Adresse:
 *                   type: string
 *                   description: L'adresse complète du membre
 *                   example: "123 rue Exemple, Paris, France"
 *                 ImageLink:
 *                   type: string
 *                   format: uri
 *                   description: L'URL de l'image du membre (facultatif)
 *                   example: "https://example.com/images/johndoe.jpg"
 *                 DepartmentIds:
 *                   type: string
 *                   description: L'identifiant ObjectId du département du membre
 *                   example: "60f792e3ee0e13424434d371"
 *               required:
 *                 - NomPrenom
 *                 - Email
 *                 - Password
 *                 - Adresse
 *                 - DepartmentIds
 *     responses:
 *       201:
 *         description: Membres créés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Members created successfully"
 *                 Members:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Member'
 *       400:
 *         description: Champs requis manquants ou données invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *                 details:
 *                   type: string
 *                   example: "Email is required"
 *       500:
 *         description: Erreur interne lors de la création des membres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error in creating members"
 *                 error:
 *                   type: string
 *                   description: Détails de l'erreur
 *                   example: "Database connection failed"
 */
route.post("/upload-many-members", MemberController.upload_many_members);

/**
 * @swagger
 * /api/member/find/{id}:
 *   get:
 *     summary: Pas encore implémenter dans le front , Trouver un membre par ID
 *     tags:
 *       - "Member-SuperAdmin"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du membre à trouver
 *     responses:
 *       200:
 *         description: Informations du membre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 */
route.get("/find/:id", MemberController.findMember);

/**
 * @swagger
 * /api/member/count:
 *   get:
 *     summary: Pas encore implémenter dans le front , Récupérer le nombre total de membres
 *     tags:
 *       - "Member-SuperAdmin"
 *     responses:
 *       200:
 *         description: Nombre total de membres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: string
 */
route.get("/count", MemberController.count);

module.exports = route;
