import { generateType } from "./generate-type";

describe("generateType", () => {
  it("should handle pluralization correctly", () => {
    const translations = {
      "day.one": "1 day",
      "day.other": "{{count}} days",
      "day.zero": "0 day",
    };

    const result = generateType(translations);

    expect(result).toHaveLength(1);

    expect(result[0]).toEqual({
      key: "day",
      interpolations: [{ name: "count", type: "number" }],
    });
  });

  it("should handle multiple interpolations correctly", () => {
    const translations = {
      greeting: "Hello {{firstName}} {{familyName}}",
    };

    const result = generateType(translations);

    expect(result).toHaveLength(1);

    expect(result[0]).toEqual({
      key: "greeting",
      interpolations: [
        { name: "firstName", type: "string" },
        { name: "familyName", type: "string" },
      ],
    });
  });
});
