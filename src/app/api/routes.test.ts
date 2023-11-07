/**
 * @jest-environment node
 */

import { createMocks } from "node-mocks-http";
import { GET } from "./route";

it("should run api test", async () => {
  const { req } = createMocks({
    method: "GET",
  });

  const response = await GET(req);

  expect(response.status).toBe(201);
  expect(await response.json()).toEqual({ hello: "world" });
});
