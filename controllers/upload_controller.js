
const xlsx = require('xlsx')
const { Member } = require('../models/user')
const { Instructor } = require('../models/user')
const bcrypt = require('bcryptjs')
exports.uploadFile = (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' })
    const sheet_name_list = workbook.SheetNames

    const jsonData = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    )

    console.log(jsonData)

    res.json(jsonData)
  } catch (error) {
    console.error('Erreur lors de la conversion du fichier:', error)
    res.status(500).send('Erreur lors de la conversion du fichier')
  }
   }
 
exports.saveFileInstructor = async (req, res) => {
    try {
    const instructors = req.body; 
    if (!Array.isArray(instructors)) {
      return res.status(400).json("Invalid data format. Expected an array of instructors.");
    }
    for (const instructor of instructors) {
      if (!instructor.NomPrenom || !instructor.Email || !instructor.Password || !instructor.Adresse) {
        return res.status(400).json("Missing required fields in instructor data.");
      }
    }
    const savedInstructor = await Instructor.insertMany(
      await Promise.all(instructors.map(async instructor => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(instructor.Password, salt);
        return {
          NomPrenom: instructor.NomPrenom,
          Email: instructor.Email,
          Password: hashedPassword,
          Adresse: instructor.Adresse,
          ImageLink: instructor.ImageLink,
          DepartmentId: instructor.DepartmentId,
          Role: 'instructor'
        };
      }))
    );
    console.log(savedInstructor)
    res.status(200).json({ message: "instructor saved successfully", data: savedInstructor });
  } catch (error) {
    console.log('Error saving instructor:', error);
    res.status(500).json("An error occurred while saving instructor");
  }
}
// export.saveFileMember = async (req, res) => {

// }
