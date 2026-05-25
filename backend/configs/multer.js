// import multer from "multer";

// const storage = multer.diskStorage({});
// const upload = multer({ storage });

// export { upload };


import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per image (important for mobile)
  },
});

export { upload };