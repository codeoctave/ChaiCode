import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // Get user details from frontend
  // Valdation - not empty
  // Check if user already exists: username, email
  // Check for images, Check for avatars
  // Upload them to cloudinary, avatar
  // Create user object - create entry in db
  // Remove password and refresh token field from response
  // Check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  /*
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  */

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };

/*

1. Imports (ज़रूरी चीज़ें लाना)

import { asyncHandler }...: यह एक 'wrapper' है जो try-catch लिखने की ज़रूरत को खत्म करता है। अगर कोड में कोई एरर आता है, तो यह उसे अपने आप पकड़ लेता है।

import { ApiError }...: एरर मैसेज को एक खास और प्रोफेशनल तरीके से भेजने के लिए बनाया गया टूल।

import { User }...: MongoDB का मॉडल, जिससे हम डेटाबेस में डेटा सेव या चेक करेंगे।

import { uploadOnCloudinary }...: यह एक फंक्शन है जो इमेज को इंटरनेट (Cloudinary) पर अपलोड करने में मदद करता है।

import { ApiResponse }...: सफलता (Success) का रिस्पॉन्स भेजने के लिए एक स्टैंडर्ड फॉर्मेट।

2. Logic (काम कैसे हो रहा है)

const registerUser = asyncHandler(async (req, res) => { ... })
यहाँ हम registerUser नाम का फंक्शन बना रहे हैं जो async है (क्योंकि डेटाबेस और फाइल अपलोड में समय लगता है)।

const { fullName, email, username, password } = req.body;
फ्रंटएंड (फॉर्म) से जो डेटा आया है, उसे अलग-अलग वेरिएबल्स में निकाला जा रहा है।

if ([fullName, email, username, password].some((field) => field?.trim() === "")) { ... }
चेकिंग: यह चेक कर रहा है कि कोई भी फील्ड खाली तो नहीं है। .trim() फालतू के स्पेस हटा देता है। अगर कोई खाली है, तो यह 400 Error (Bad Request) फेंक देगा।

const existedUser = User.findOne({ $or: [{ username }, { email }] });
चेक: डेटाबेस में ढूँढो कि क्या इस username या email वाला कोई यूजर पहले से मौजूद है?
if (existedUser) { throw new ApiError(409, "...") }
अगर यूजर मिल गया, तो 409 Error (Conflict) भेज दो कि भाई, यह ईमेल/यूजरनेम पहले से इस्तेमाल में है।

const avatarLocalPath = req.files?.avatar[0]?.path;
यूजर की प्रोफाइल फोटो (Avatar) का जो रास्ता (path) आपके सर्वर पर है, उसे निकालो।

const avatar = await uploadOnCloudinary(avatarLocalPath);
उस फोटो को सर्वर से उठाकर Cloudinary (बादलों वाली स्टोरेज) पर अपलोड कर दो।

const user = await User.create({ ... });
अब डेटाबेस में नया यूजर बनाओ। पासवर्ड, ईमेल और इमेज का लिंक (URL) इसमें सेव कर दो।

const createdUser = await User.findById(user._id).select("-password -refreshToken");
यूजर बनने के बाद, उसे फिर से डेटाबेस से निकालो, लेकिन इस बार password और refreshToken को छोड़ देना (सुरक्षा के लिए)।

return res.status(201).json(new ApiResponse(200, createdUser, "..."));
सब कुछ सही होने पर, यूजर को 201 (Created) स्टेटस के साथ सफलता का मैसेज और उसका डेटा वापस भेज दो।

3. Export
export { registerUser };
ताकि इस फंक्शन को आप अपनी routes वाली फाइल में इस्तेमाल कर सकें।

*/