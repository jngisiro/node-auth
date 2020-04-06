import loginValidator from "../../../server/validators/login";
import Response from "../../utils/response";

describe("The login validator", () => {
  it("Should call the next function when validator succeeds", async () => {
    // Mock request
    const req = {
      body: {
        email: "test@user.com",
        password: "password",
      },
    };

    // Mock Response
    const res = {};

    // Mock next function
    const next = jest.fn();

    await loginValidator(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("Should return a 422 if validation fails", async () => {
    // Mock request object
    const req = {
      body: {
        password: "password",
      },
    };

    // Mock next function
    const next = jest.fn();

    // Mock response
    const res = new Response();

    const statusSpy = jest.spyOn(res, "status");

    const jsonSpy = jest.spyOn(res, "json");

    await loginValidator(req, res, next);

    expect(statusSpy).toHaveBeenCalledWith(422);

    expect(jsonSpy).toHaveBeenCalled();
  });
});
