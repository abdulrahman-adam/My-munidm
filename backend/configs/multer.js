// import multer from "multer";

// const storage = multer.diskStorage({});
// const upload = multer({ storage });

// export { upload };


import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});


