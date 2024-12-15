const express = require('express')
const router = express.Router() // Fixed the variable name to router instead of route
const departementController = require('../controllers/departementController')

/**
 * @swagger
 * /api/department/all:
 *   get:
 *     summary: Récupérer la liste des départements
 *     tags:
 *       - Department
 *     responses:
 *       200:
 *         description: Liste des départements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: integer
 *                     description: ID du département
 *                   Nom:
 *                     type: string
 *                     description: Nom du département
 *       404:
 *         description: Erreur lors de la récupération des départements
 */
router.get('/all', departementController.afficher_All)

/**
 * @swagger
 * /api/department/create:
 *   post:
 *     summary: Créer un nouveau département
 *     tags:
 *       - Department
 *     requestBody:
 *       description: Les informations du département à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DepartmentName:
 *                 type: string
 *                 description: Nom du département
 *     responses:
 *       201:
 *         description: Département créé avec succès
 */
router.post('/create', departementController.create_Departement)
/**
 * @swagger
 * /api/department/update/{id}:
 *   put:
 *     summary: Met à jour un département existant
 *     tags:
 *       - Department
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du département à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Les informations du département à mettre à jour
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DepartmentName:
 *                 type: string
 *                 description: Nouveau nom du département
 *     responses:
 *       200:
 *         description: Département mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 DepartmentName:
 *                   type: string
 *                   description: Nom mis à jour du département
 *                 _id:
 *                   type: string
 *                   description: Identifiant du département
 *       404:
 *         description: Département non trouvé ou aucune modification effectuée
 */
router.put('/update/:id', departementController.updateDepartement)
/**
 * @swagger
 * /api/department/delete/{id}:
 *   delete:
 *     summary: Supprime un département existant
 *     tags:
 *       - Department
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du département à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Département supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation de la suppression
 *       404:
 *         description: Département non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur indiquant que le département est introuvable
 */
router.delete('/delete/:id', departementController.deleteDepartement)
/**
 * @swagger
 * /api/department/names-ids:
 *   get:
 *     summary: Récupérer les noms et les IDs des départements
 *     tags:
 *       - Department
 *     responses:
 *       200:
 *         description: Liste des départements avec leurs noms et IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID du département
 *                   DepartmentName:
 *                     type: string
 *                     description: Nom du département
 *       500:
 *         description: Erreur lors de la récupération des départements
 */
router.get('/names-ids', departementController.get_Departments_names_and_ids)
module.exports = router
