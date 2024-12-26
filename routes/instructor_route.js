const express = require("express");
const route = express.Router();

const instructorController = require("../controllers/instructor_controller");
const {
  authenticateJWT,
  authorizeRoles,
} = require("../middlewares/VerifyToken");

/**
 * @swagger
 * /api/instructor/all:
 *   get:
 *     summary: Récupérer tous les instructeurs
 *     description: Renvoie une liste de tous les instructeurs disponibles dans la base de données.
 *     tags:
 *       - Instructor
 *     responses:
 *       200:
 *         description: Liste des instructeurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID unique de l'instructeur.
 *                   nom:
 *                     type: string
 *                     description: Nom de l'instructeur.
 *                   email:
 *                     type: string
 *                     description: Email de l'instructeur.
 *       404:
 *         description: Erreur lors de la récupération des instructeurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur.
 */
route.get(
  "/all",
  authenticateJWT,
  authorizeRoles("superAdmin"),
  instructorController.afficher_All
);
/**
 * @swagger
 * /api/instructor/create-with-department:
 *   post:
 *     summary: Créer un nouvel instructeur
 *     description: Crée un instructeur et l'associe à un département avec les informations fournies dans le corps de la requête.
 *     tags:
 *       - Instructor
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
 *                 description: L'ID du département auquel l'instructeur sera associé
 *               NomPrenom:
 *                 type: string
 *                 example: "John Doe"
 *                 description: Nom et prénom de l'instructeur
 *               Email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *                 description: Email unique de l'instructeur
 *               Password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *                 description: Mot de passe de l'instructeur (au moins 8 caractères)
 *               Role:
 *                 type: string
 *                 example: "instructor"
 *                 description: Le rôle de l'utilisateur (ici ce sera "instructor")
 *               Adresse:
 *                 type: string
 *                 example: "123 rue de Paris"
 *                 description: Adresse de l'instructeur
 *               ImageLink:
 *                 type: string
 *                 example: "http://example.com/image.jpg"
 *                 description: Lien vers l'image de profil de l'instructeur (optionnel)
 *     responses:
 *       201:
 *         description: Instructeur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Instructor added successfully"
 *                 instructor:
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
 *                     Adresse:
 *                       type: string
 *                     ImageLink:
 *                       type: string
 *                     DepartmentId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
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
 *                   example: "Error adding instructor to department"
 */
route.post(
  "/create-with-department",
  authenticateJWT,
  authorizeRoles("superAdmin"),
  instructorController.create_Instructor_with_department
);
/**
 * @swagger
 * /api/instructor/update/{id}:
 *   put:
 *     summary: Mettre à jour un instructeur
 *     description: Met à jour les informations d'un instructeur existant. Permet également de déplacer l'instructeur d'un département source à un département cible.
 *     tags:
 *       - Instructor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'instructeur à mettre à jour
 *         schema:
 *           type: string
 *           example: "615c1bc5e70b7e6f30f8f99c"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DepartmentId:
 *                 type: string
 *                 description: ID du nouveau département auquel l'instructeur sera associé
 *                 example: "615c1bc5e70b7e6f30f8f99d"
 *               NomPrenom:
 *                 type: string
 *                 description: Nom et prénom de l'instructeur
 *                 example: "Jane Doe"
 *               Email:
 *                 type: string
 *                 format: email
 *                 description: Adresse e-mail de l'instructeur
 *                 example: "janedoe@example.com"
 *               Password:
 *                 type: string
 *                 format: password
 *                 description: Nouveau mot de passe de l'instructeur (laissez vide pour conserver l'ancien mot de passe)
 *                 example: "newpassword123"
 *               Role:
 *                 type: string
 *                 description: Rôle de l'utilisateur
 *                 example: "instructor"
 *               Adresse:
 *                 type: string
 *                 description: Adresse de l'instructeur
 *                 example: "456 rue de Lyon"
 *               ImageLink:
 *                 type: string
 *                 description: Lien vers l'image de profil de l'instructeur
 *                 example: "http://example.com/new-image.jpg"
 *     responses:
 *       200:
 *         description: Instructeur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Instructor updated successfully"
 *                 Instructor:
 *                   type: object
 *                   properties:
 *                     acknowledged:
 *                       type: boolean
 *                       example: true
 *                     modifiedCount:
 *                       type: number
 *                       example: 1
 *                     matchedCount:
 *                       type: number
 *                       example: 1
 *       404:
 *         description: Instructeur ou département introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Instructor not found"
 *       500:
 *         description: Erreur lors de la mise à jour de l'instructeur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error in updating Instructor"
 *                 error:
 *                   type: string
 *                   example: "Source Department not found"
 */
route.put(
  "/update/:id",
  authenticateJWT,
  authorizeRoles("superAdmin"),
  instructorController.update_Instructor
);

/**
 * @swagger
 * /api/instructor/delete/{id}:
 *   delete:
 *     summary: Supprimer un instructeur
 *     description: Supprime un instructeur existant en le retirant également de son département associé.
 *     tags:
 *       - Instructor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'instructeur à supprimer
 *         schema:
 *           type: string
 *           example: "615c1bc5e70b7e6f30f8f99c"
 *     responses:
 *       200:
 *         description: Instructeur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Instructor deleted successfully"
 *       404:
 *         description: Instructeur ou département introuvable, ou erreur lors de la suppression
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Instructor not found"
 *       500:
 *         description: Erreur serveur lors de la suppression de l'instructeur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error in deleting Admin"
 */
route.delete(
  "/delete/:id",
  authenticateJWT,
  authorizeRoles("superAdmin"),
  instructorController.delete_Instructor
);

/**
 * @swagger
 * paths:
 *   /api/instructor/get-instructors-names:
 *     post:
 *       summary: "Obtenir les noms et IDs des instructeurs dans un département"
 *       description: "Cette fonction renvoie les noms et IDs des instructeurs d'un département spécifique."
 *       tags:
 *         - "Instructor"
 *       requestBody:
 *         description: "ID du département pour lequel récupérer les instructeurs"
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 DepartmentId:
 *                   type: string
 *                   description: "ID du département"
 *                   example: "670792e3ee0e13424434d371"
 *       responses:
 *         '200':
 *           description: "Liste des instructeurs dans le département"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   instructors:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: "ID de l'instructeur"
 *                           example: "64fbad8b6c598b43d788a840"
 *                         NomPrenom:
 *                           type: string
 *                           description: "Nom complet de l'instructeur"
 *                           example: "John Doe"
 *               example:
 *                 instructors:
 *                   - _id: "64fbad8b6c598b43d788a840"
 *                     NomPrenom: "John Doe"
 *                   - _id: "64fbad8b6c598b43d788a841"
 *                     NomPrenom: "Jane Smith"
 *         '404':
 *           description: "Département non trouvé"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Département non trouvé"
 *         '500':
 *           description: "Erreur serveur"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Erreur serveur"
 */
route.post(
  "/get-instructors-names",
  authenticateJWT,
  authorizeRoles("instructor", "superAdmin"),
  instructorController.get_Instructors_names_and_ids_in_department
);
/**
 * @swagger
 * /api/instructor/find/{id}:
 *   get:
 *     summary: Requete existe mais non implémenté  Récupérer un instructeur
 *     description: Récupère les détails d'un instructeur à partir de son ID.
 *     tags:
 *       - Instructor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'instructeur à rechercher
 *         schema:
 *           type: string
 *           example: "615c1bc5e70b7e6f30f8f99c"
 *     responses:
 *       200:
 *         description: Instructeur trouvé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 NomPrenom:
 *                   type: string
 *                 Email:
 *                   type: string
 *                 Role:
 *                   type: string
 *                 Adresse:
 *                   type: string
 *                 ImageLink:
 *                   type: string
 *                 DepartmentId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Instructeur introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This instructor doesn't exist"
 *       400:
 *         description: Erreur dans la recherche de l'instructeur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error in finding instructor"
 */
route.get("/find/:id", instructorController.findInstructor);

/**
 * @swagger
 * /api/instructor/count:
 *   get:
 *     summary: Requete existe mais non implémenté Compter le nombre total d'instructeurs
 *     description: Retourne le nombre total d'instructeurs dans la base de données.
 *     tags:
 *       - Instructor
 *     responses:
 *       200:
 *         description: Nombre total d'instructeurs retourné avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *               example: 42
 *       404:
 *         description: Erreur lors du comptage des instructeurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error in counting instructors"
 */
route.get("/count", instructorController.count);

module.exports = route;
