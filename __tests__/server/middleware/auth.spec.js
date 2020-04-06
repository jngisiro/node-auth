import User from "../../../server/models/User";
import authMiddleware from "../../../server/middleware/auth";
import Response from "../../utils/response";
import { connect, disconnect } from "../../utils/mongoose";

describe("The auth middleware", () => {
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
  // -------------------- END OF SET UP ----------------------------

  it("Should call the next function if authentication is successful", async () => {
    const access_token = newuser.generateToken();

    const req = {
      body: {
        access_token,
      },
    };

    const res = new Response();

    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("Should return a 401 is authentication fails", async () => {
    const access_token = newuser.generateToken();

    const req = {
      body: {
        access_token: "access_token",
      },
    };

    const res = new Response();

    const next = jest.fn();

    const statusSpy = jest.spyOn(res, "status");

    const jsonSpy = jest.spyOn(res, "json");

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(0);
    expect(statusSpy).toHaveBeenCalledWith(401);
    expect(jsonSpy).toHaveBeenCalledWith({
      message: "Unauthenticated.",
    });
  });

  // ----------------------- CLEAN UP ---------------------------------
  afterAll(async () => {
    await disconnect();
  });
});
