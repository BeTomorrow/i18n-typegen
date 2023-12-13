import { findInterpolations } from "./find-interpolation";

test("Find double bracket interpolation", () => {
  const input = "Hello {{name}} !";
  const interpolations = findInterpolations(input);
  expect(interpolations).toEqual(["name"]);
});

test("Find %{value} interpolation", () => {
  const input = "Hello %{name} !";
  const interpolations = findInterpolations(input);
  expect(interpolations).toEqual(["name"]);
});

test("Find multiple interpolations", () => {
  const input = "Hello {{firstname}} %{familyName}";
  const interpolations = findInterpolations(input);
  expect(interpolations).toEqual(["firstname", "familyName"]);
});
