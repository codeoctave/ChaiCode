import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ 
    storage, 
});

/*

Yeh code File Uploading ke liye hai. Jab bhi aap kisi website par apni photo, PDF, ya koi aur file upload karte hain, toh backend par use handle karne ke liye Multer library ka use hota hai.

Aasaan shabdon mein, yeh code aapke server ko bata raha hai ki "Jab koi user file bheje, toh use kahan aur kis naam se save karna hai."

Iska kaam kya hai? (Key Parts):

multer.diskStorage: Yeh server ki hard disk par files save karne ka tareeka set karta hai.

destination: Yeh batata hai ki file server ke andar kaunse folder mein jayegi. Yahan file "./public/temp" folder mein save hogi.

filename: Yeh file ka naam decide karta hai. file.originalname ka matlab hai ki user ne jis naam se file upload ki (e.g., my-photo.jpg), server par bhi wahi naam rahega.

upload variable: Isse aap apne routes (jaise /upload-profile-pic) mein use karenge taaki files handle ho saken.

Yeh kyun likha gaya hai? (Purpose):

Temporary Storage: Aksar hum files ko pehle apne local server (public/temp) par thodi der ke liye rakhte hain, phir wahan se use Cloudinary ya AWS S3 jaise cloud storage par bhej dete hain.

Organization: Yeh files ko manage karne ka ek systematic tarika hai taaki binary data (files) sahi se handle ho sake.

*/
