import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { connect, disconnect } from "../../utils/mongoose";
import User from "../../../server/models/User";
import config from "../../../server/config/index";

describe("The User model", () => {
  const user = {
    name: "Test User",
    email: "test@user.com",
    password: "password",
  };

  let newuser;

  // -------------------- SET UP ----------------------------------
  beforeAll(async () => {
    await connect();

    newuser = await User.create(user);
  });

  it("Should hash the user password before saving to the database", async () => {
    expect(bcrypt.compareSync(user.password, newuser.password)).toBe(true);
  });

  it("Should set the email confirm code for the user before saving to the database", async () => {
    expect(newuser.emailConfirmCode).toBeDefined();
    expect(newuser.emailConfirmCode).toEqual(expect.any(String));
  });

  describe("The generateToken method", () => {
    it("Should generate a valid JWT for a user", () => {
      const token = newuser.generateToken();
      const { id } = jwt.verify(token, config.jwtSecret);

      expect(id).toEqual(JSON.parse(JSON.stringify(newuser._id)));
    });
  });

  // ----------------------- CLEAN UP ---------------------------------
  afterAll(async () => {
    await disconnect();
  });
});
