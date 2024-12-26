const express = require("express");
const superAdminController = require("../controllers/super_admin_controller");
const {
  authenticateJWT,
  authorizeRoles,
} = require("../middlewares/VerifyToken");

const route = express.Router();
/**
 * @swagger
 * /api/super_admin/create:
 *   post:
 *     summary: Créer un nouveau admin
 *     tags:
 *       - "SuperAdmin"
 *     requestBody:
 *       description: Les informations du admin à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NomPrenom:
 *                 type: string
 *                 description: Le nom et prénom du admin
 *               Email:
 *                 type: string
 *                 format: email
 *                 description: L'adresse email du admin
 *               Password:
 *                 type: string
 *                 description: Le mot de passe du admin
 *                 minLength: 8
 *               Adresse:
 *                 type: string
 *                 description: L'adresse du admin
 *               ImageLink:
 *                 type: string
 *                 description: L'URL de l'image du admin (facultatif)
 *             required:
 *               - NomPrenom
 *               - Email
 *               - Password
 *               - Adresse
 *
 *     responses:
 *       201:
 *         description: admin créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'admin created successfully'
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
 *         description: Erreur lors de la création du admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error in creating Admin'
 *                 error:
 *                   type: string
 *                   description: Détails de l'erreur
 */
route.post("/create", superAdminController.create_Admin);
module.exports = route;
