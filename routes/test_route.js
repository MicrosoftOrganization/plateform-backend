// backend/routes/upload_route.js
const express = require('express')
const multer = require('multer')
const uploadController = require('../controllers/upload_controller') // Import du contrôleur

const route = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

/**
 * @swagger
 * /api/test/upload:
 *   post:
 *     summary: Upload a file and convert it to JSON
 *     description: Allows uploading an Excel file, which is then converted to JSON format.
 *     tags:
 *       - File Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The Excel file to upload
 *     responses:
 *       200:
 *         description: File uploaded and converted to JSON successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File uploaded and converted to JSON"
 *                 data:
 *                   type: object
 *                   description: The converted JSON data
 *       400:
 *         description: Bad request, file missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid file or no file uploaded"
 *       500:
 *         description: Server error during file conversion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error during file conversion"
 */
route.post('/upload', upload.single('file'), uploadController.uploadFile)
/**
 * @swagger
 * /api/test/save-instructor:
 *   post:
 *     summary: Save multiple instructors
 *     description: Accepts an array of instructors, validates the data, hashes the passwords, and saves them to the database.
 *     tags:
 *       - File Upload
 *     requestBody:
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
 *                   example: "John Doe"
 *                   description: The full name of the instructor
 *                 Email:
 *                   type: string
 *                   format: email
 *                   example: "johndoe@example.com"
 *                   description: The email address of the instructor
 *                 Password:
 *                   type: string
 *                   example: "securepassword"
 *                   description: The plain text password of the instructor
 *                 Adresse:
 *                   type: string
 *                   example: "123 Main St, Cityville"
 *                   description: The address of the instructor
 *                 ImageLink:
 *                   type: string
 *                   format: uri
 *                   example: "http://example.com/images/johndoe.jpg"
 *                   description: Optional image link for the instructor
 *                 DepartmentId:
 *                   type: string
 *                   example: "64d1f43b832b9b2e9c5e1234"
 *                   description: The ID of the department the instructor belongs to
 *     responses:
 *       200:
 *         description: Instructors saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "instructor saved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64d1f43b832b9b2e9c5e1234"
 *                       NomPrenom:
 *                         type: string
 *                       Email:
 *                         type: string
 *                       Adresse:
 *                         type: string
 *                       ImageLink:
 *                         type: string
 *                       DepartmentId:
 *                         type: string
 *                       Role:
 *                         type: string
 *                         example: "instructor"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid data format. Expected an array of instructors."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "An error occurred while saving instructor"
 */
route.post('/save-instructor', uploadController.saveFileInstructor)

module.exports = route
