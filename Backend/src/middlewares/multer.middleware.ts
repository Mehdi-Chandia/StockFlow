import multer from "multer";

const storage= multer.diskStorage({
    destination: function (req, file, cb) {
        cb (null, "uploads/")
    },

    filename: function (req, file, cb){
         cb(null, Date.now() + "-" + file.originalname);
    }
})

const allowed=[
    "image/png",
    "image/jpg",
    "image/webp"
]



const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {

    if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Only PNG, JPEG and WebP images are allowed"));
    }

    cb(null, true);
};


const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

export default upload;






