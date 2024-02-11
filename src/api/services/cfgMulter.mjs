import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Define o diretório onde os uploads serão armazenados
    console.log(req, file);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Define o nome do arquivo
  },
});

const upload = multer({ storage: storage });

export default upload;
