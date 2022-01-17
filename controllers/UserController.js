const jwt = require("jsonwebtoken");
const User = require("./../models/UserModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    message: "success!",
    token: token,
    user: user,
  });
};

module.exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    message: "New Account Created. Please Login",
    user: newUser,
  });
});

module.exports.login = catchAsync(async (req, res, next) => {
  const { logemail, logpassword } = req.body;

  //1)Check if email and password is Not exist
  if (!logemail || !logpassword) {
    return next(new AppError("Please provide email and password!", 400));
  }
  //2)Check if user exist && password is correct
  //const user=await User.findOne({email:email});
  //or
  const email = logemail;
  const user = await User.findOne({ email });
  if (!user || !(await user.correctPassword(logpassword, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //3)if everythings ok, send token to client
  createSendToken(user, 200, res);
});
