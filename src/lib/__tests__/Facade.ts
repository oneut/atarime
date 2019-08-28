import * as facade from "../Facade";

test("Get object", () => {
  expect(!!facade.Link).toBeTruthy();
  expect(!!facade.Request).toBeTruthy();
  expect(!!facade.URL).toBeTruthy();
  expect(!!facade.connector).toBeTruthy();
});
