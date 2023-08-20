import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User(
    { username, email, password: hashedPassword },
    { __id: false }
  );
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(errorHandler(300, "User already exists"));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) throw errorHandler(404, "User not found");
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) throw errorHandler(401, "Wrong Credentials");
    const token = jwt.sign({ id: validUser._id }, process.env.SECRET, {
      expiresIn: 3600,
    });
    const { password: hashedPassword, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
