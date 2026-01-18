import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

// Configuration du stockage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Vérification du type de fichier
function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp|gif/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp|image\/gif/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images uniquement! (jpeg, jpg, png, webp, gif)"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  },
});

// Route pour upload d'une seule image
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier uploadé" });
  }
  res.json({
    message: "Image uploadée avec succès",
    image: `/${req.file.path.replace(/\\/g, "/")}`,
  });
});

// Route pour upload de plusieurs images (max 5)
router.post("/multiple", upload.array("images", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Aucun fichier uploadé" });
  }
  const imagePaths = req.files.map((file) => `/${file.path.replace(/\\/g, "/")}`);
  res.json({
    message: "Images uploadées avec succès",
    images: imagePaths,
  });
});

export default router;