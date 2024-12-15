const Attachement = require('../models/attachment');

const Attachement_controller = {
    Display_All: async (req, res) => {
        try {
            const Attachements = await Attachement.find();
            res.status(200).json(Attachements);
        } catch (error) {
            res.status(500).json({ message: "Server error in generating Attachements" });
        }
    },

    create_Attachement: async (req, res) => {
        try {
            const create = await Attachement.create(req.body);
            res.status(201).json({ message: "Attachement created successfully", Attachement: create });
        } catch (error) {
            res.status(500).json({ message: "Server error in creating Attachement" });
        }
    },

    update_Attachement: async (req, res) => {
        try {
            const id = req.params.id;
            const update = await Attachement.updateOne({ _id: id }, req.body);
            if (!update || update.modifiedCount === 0) {
                return res.status(404).json({ message: "Attachement not found or no changes made" });
            }
            res.status(200).json({ message: "Attachement updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server error in updating Attachement" });
        }
    },

    delete_Attachement: async (req, res) => {
        try {
            const id = req.params.id;
            const deleted = await Attachement.deleteOne({ _id: id });
            if (deleted.deletedCount === 0) {
                return res.status(404).json({ message: "Attachement not found" });
            }
            res.status(200).json({ message: "Attachement deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server error in deleting Attachement" });
        }
    },

    findAttachementbyId: async (req, res) => {
        try {
            const id = req.params.id;
            const Attachement_Result = await Attachement.findById(id);

            if (!Attachement_Result) {
                return res.status(404).json({ message: "This Attachement doesn't exist" });
            }

            return res.status(200).json(Attachement_Result);
        } catch (error) {
            res.status(500).json({ message: "Server error in finding Attachement" });
        }
    },
    
    findAttachementbyInstructorId: async (req, res) => {
        try {
            const id = req.params.id;
            const Attachement_Result = await Attachement.find({ Instructor: id });

            if (!Attachement_Result) {
                return res.status(404).json({ message: "This Attachement doesn't exist" });
            }

            return res.status(200).json(Attachement_Result);
        } catch (error) {
            res.status(500).json({ message: "Server error in finding Attachement" });
        }
    },
    
    findAttachementbySessionId: async (req, res) => {
        try {
            const id = req.params.id;
            const Attachement_Result = await Attachement.find({ Session: id });

            if (!Attachement_Result) {
                return res.status(404).json({ message: "This Attachement doesn't exist" });
            }

            return res.status(200).json(Attachement_Result);
        } catch (error) {
            res.status(500).json({ message: "Server error in finding Attachement" });
        }
    },
    
    findAttachementbyAssignemntIdAndInstructorId: async (req, res) => {
        try {
            const Assignement_id = req.params.Ass;
            const Instructor_id = req.params.Ins;
            const Attachement_Result = await Attachement.find({ Assignement: Assignement_id, Instructor: Instructor_id });

            if (!Attachement_Result) {
                return res.status(404).json({ message: "This Attachement doesn't exist" });
            }

            return res.status(200).json(Attachement_Result);
        } catch (error) {
            res.status(500).json({ message: "Server error in finding Attachement" });
        }
    },

    count: async (req, res) => {
        try {
            const Attachements = await Attachement.countDocuments();
            res.status(200).json(Attachements);
        } catch (error) {
            res.status(500).json({ message: "Server error in counting Attachements" });
        }
    },
};

module.exports = Attachement_controller;
