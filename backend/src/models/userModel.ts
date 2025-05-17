import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt"; //  bcrypt password security layer to hash the password. also allows us to use salt --> npm install --save-dev @types/bcrypt needed
import validator from "validator"; //npm install validator for email and password validation --> npm install --save-dev @types/validator is needed

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
}

// Adding this for static methods
interface IUserModel extends Model<IUser> {
  signup(
    firstName: string,
    lastName: string,
    birthDate: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<IUser>;
  login(email: string, password: string): Promise<IUser>;
}

const userSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Correcting the `timestamps` option.
);

// static signup method
userSchema.statics.signup = async function (
  firstName: string,
  lastName: string,
  birthDate: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  // validator for valid email and strong password
  if (!firstName || !lastName || !birthDate || !email || !password) {
    throw Error("Fields cannot remain empty.");
  }
  // check if the birthDate is not in the future date
  const inputDate = new Date(birthDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // reset time to midnight for accurate comparison.
  if (inputDate > today) {
    throw Error("Birth Date cannot be in the future.");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use.");
  }
  if (password !== confirmPassword) {
    throw Error("Passwords do not match.");
  }

  //  bcrypt password security layer to hash the password. also allows us to use salt --> npm install --save-dev @types/bcrypt needed
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    firstName,
    lastName,
    birthDate,
    email,
    password: hash,
  });

  return user;
};

// static login method

userSchema.statics.login = async function (email: string, password: string) {
  if (!email || !password) {
    throw Error("Fields cannot remain empty.");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email.");
  }

  const match = await bcrypt.compare(password, user.password); //compare comes with bcrypt
  if (!match) {
    throw Error("Incorrect password.");
  }
  return user;
};

const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;

//Test Json data ^
// {
//     "email": "admin@gmail.com",
//     "password": "test1234"
// }
// {
//     "email": "admin1@gmail.com",
//     "password": "Test!1234`"
// }
