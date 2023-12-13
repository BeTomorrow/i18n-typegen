import { flatten } from "./flatten";

describe("flatten function", () => {
  it("should flatten a nested object", () => {
    const nestedObject = {
      greeting: {
        en: "Hello",
        fr: "Bonjour",
        nested: {
          world: {
            en: "World",
            fr: "Monde",
          },
        },
      },
      goodbye: {
        en: "Goodbye",
        fr: "Au revoir",
      },
    };

    const expectedFlattenedObject = {
      "greeting.en": "Hello",
      "greeting.fr": "Bonjour",
      "greeting.nested.world.en": "World",
      "greeting.nested.world.fr": "Monde",
      "goodbye.en": "Goodbye",
      "goodbye.fr": "Au revoir",
    };

    const result = flatten(nestedObject);

    expect(result).toEqual(expectedFlattenedObject);
  });
});
