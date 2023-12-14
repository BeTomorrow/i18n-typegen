import { generateTemplateData } from "./generate-template-data";

describe("generateType", () => {
  it("should handle pluralization correctly", () => {
    const translations = {
      "day.one": "1 day",
      "day.other": "{{count}} days",
      "day.zero": "0 day",
    };

    const result = generateTemplateData(translations, { detectPlurial: true });

    expect(result).toHaveLength(1);

    expect(result[0]).toEqual({
      key: "day",
      interpolations: [{ name: "count", type: "number", last: true }],
    });
  });

  it("should ignore pluralization when disabled", () => {
    const translations = {
      "day.one": "1 day",
      "day.other": "{{count}} days",
      "day.zero": "0 day",
    };

    const result = generateTemplateData(translations, { detectPlurial: false });

    expect(result).toHaveLength(3);

    expect(result[0]).toEqual({
      key: "day.one",
      interpolations: [],
    });
    expect(result[1]).toEqual({
      key: "day.other",
      interpolations: [{ name: "count", type: "string", last: true }],
    });
  });

  it("should handle multiple interpolations correctly", () => {
    const translations = {
      greeting: "Hello {{firstName}} {{familyName}}",
    };

    const result = generateTemplateData(translations);

    expect(result).toHaveLength(1);

    expect(result[0]).toEqual({
      key: "greeting",
      interpolations: [
        { name: "firstName", type: "string" },
        { name: "familyName", type: "string", last: true },
      ],
    });
  });

  it("should handle mixed of pluralization and interpolations correctly", () => {
    const translations = {
      "day.one": "1 {{mood}} day",
      "day.other": "{{count}} {{moods}} days",
      "day.zero": "0 {{mood}} day",
    };

    const result = generateTemplateData(translations);

    expect(result).toHaveLength(1);

    expect(result[0]).toEqual({
      key: "day",
      interpolations: [
        { name: "mood", type: "string" },
        { name: "count", type: "number" },
        { name: "moods", type: "string", last: true },
      ],
    });
  });
});
