const express = require('express')
const controller = require('../controllers/user_controller')
const authenticateJWT = require('../middlewares/VerifyToken')

const route = express.Router()

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     nomPrenom:
 *                       type: string
 *                     adresse:
 *                       type: string
 *                     imageLink:
 *                       type: string
 *                     Departement:
 *                       type: string
 *       400:
 *         description: Validation errors
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
route.post('/login', controller.login)
/**
 * @swagger
 * /api/user/logout:
 *   get:
 *     summary: Déconnexion de l'utilisateur
 *     description: Supprime le cookie contenant le jeton d'authentification et déconnecte l'utilisateur.
 *     tags:
 *       - Authentification
 *     responses:
 *       200:
 *         description: Déconnexion réussie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       500:
 *         description: Erreur serveur lors de la déconnexion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur lors de la déconnexion"
 */
route.post('/logout', controller.logout)

module.exports = route
