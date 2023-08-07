import axios from "axios";

describe("repair api", () => {
  it("returns hello world", async () => {
    const response = await axios.get("http://localhost:8000/repair");

    expect(response).toBe("hello world");
  });
});
