import axios from "axios";

describe("trip api", () => {
  it("returns hello world", async () => {
    const response = await axios.get("http://localhost:8000/trip");

    expect(response).toBe("hello world");
  });
});
