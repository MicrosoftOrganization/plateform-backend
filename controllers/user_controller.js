const { User } = require("../models/user.js");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

const controller = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Recherche de l'utilisateur
      const user = await User.findOne({ Email: email });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Vérification du mot de passe
      const isMatch = await bcrypt.compare(password, user.Password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Génération du token JWT
      const token = jwt.sign(
        { id: user._id, role: user.Role },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      // Filtrer les informations selon le rôle
      let filteredUser;
      if (user.Role == "member") {
        filteredUser = {
          id: user._id,
          email: user.Email,
          role: user.Role,
          nomPrenom: user.NomPrenom,
          adresse: user.Adresse,
          imageLink: user.ImageLink,
          DepartmentIds: user.DepartmentIds,
        };
      } else if (user.Role == "instructor") {
        filteredUser = {
          id: user._id,
          email: user.Email,
          role: user.Role,
          nomPrenom: user.NomPrenom,
          adresse: user.Adresse,
          imageLink: user.ImageLink,
          DepartmentId: user.DepartmentId,
        };
      } else {
        filteredUser = {
          id: user._id,
          email: user.Email,
          role: user.Role,
        };
      }
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        })
        .status(200)
        .json({
          message: "Login successful",
          token,
          user: filteredUser,
        });
    } catch (error) {
      console.error("Error in authentication:", error);
      res.status(500).json({ message: "Error performing authentication" });
    }
  },
  logout: (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // Set to false for local development
      sameSite: "lax", // Used SameSite=Lax for local development
    });
    res.status(200).json({ message: "Logout successful" });
  },
};

module.exports = controller;
