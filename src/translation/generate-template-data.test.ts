import { generateTemplateData } from "./generate-template-data";

const mockConfig = { input: {} as any, output: {} as any, rules: [] };
describe("generateType", () => {
  it("should handle pluralization correctly", () => {
    const translations = {
      "day.one": "1 day",
      "day.other": "{{count}} days",
      "day.zero": "0 day",
    };

    const result = generateTemplateData(translations, {
      ...mockConfig,
      rules: [
        {
          condition: { keyEndsWith: ["one", "other", "zero"] },
          transformer: {
            addPlaceholder: { name: "count", type: ["number"] },
            removeLastPart: true,
          },
        },
      ],
    });

    expect(result).toHaveLength(1);

    expect(result[0]).toMatchObject({
      key: "day",
      interpolations: [{ name: "count", type: [{ value: "number" }] }],
    });
  });

  it("should ignore pluralization when disabled", () => {
    const translations = {
      "day.one": "1 day",
      "day.other": "{{count}} days",
      "day.zero": "0 day",
    };

    const result = generateTemplateData(translations, mockConfig);

    expect(result).toHaveLength(3);

    expect(result[0]).toMatchObject({
      key: "day.one",
      interpolations: [],
    });
    expect(result[1]).toMatchObject({
      key: "day.other",
      interpolations: [],
    });
  });

  it("should handle multiple interpolations correctly", () => {
    const translations = {
      greeting: "Hello {{firstName}} {{familyName}}",
    };

    const result = generateTemplateData(translations, {
      ...mockConfig,
      rules: [
        {
          condition: { placeholderPattern: { prefix: "{{", suffix: "}}" } },
          transformer: { addMatchedPlaceholder: { type: ["string", "number"] } },
        },
      ],
    });

    expect(result).toHaveLength(1);

    expect(result[0]).toMatchObject({
      key: "greeting",
      interpolations: [
        {
          name: "firstName",
          type: [{ value: "string" }, { value: "number" }],
        },
        {
          name: "familyName",
          type: [{ value: "string" }, { value: "number" }],
        },
      ],
    });
  });

  it("should handle mixed of pluralization and interpolations correctly", () => {
    const translations = {
      "day.one": "1 {{mood}} day",
      "day.other": "{{count}} {{moods}} days",
      "day.zero": "0 {{mood}} day",
    };

    const rules = [
      {
        condition: { placeholderPattern: { prefix: "{{", suffix: "}}" } },
        transformer: { addMatchedPlaceholder: { type: ["string"] } },
      },
      {
        condition: { keyEndsWith: ["one", "other", "zero"] },
        transformer: { addPlaceholder: { name: "count", type: ["number"] }, removeLastPart: true },
      },
    ];

    const result = generateTemplateData(translations, { ...mockConfig, rules });

    expect(result).toHaveLength(1);

    expect(result[0]).toMatchObject({
      key: "day",
      interpolations: [
        { name: "count", type: [{ value: "number" }, { value: "string" }] },
        { name: "mood", type: [{ value: "string" }] },
        { name: "moods", type: [{ value: "string" }] },
      ],
    });
  });

  it("should handle ", () => {
    const translations = {
      "greeting.man": "Hello Mr {{name}}!",
      "greeting.woman": "Hello Ms {{name}}!",
      "greeting.neutral": "Hello {{name}}!",
    };

    const rules = [
      {
        condition: { placeholderPattern: { prefix: "{{", suffix: "}}" } },
        transformer: { addMatchedPlaceholder: { type: ["string"] } },
      },
      {
        condition: { keyEndsWith: ["man", "woman", "neutral"] },
        transformer: { addPlaceholder: { name: "gender", type: ["string"] }, removeLastPart: true },
      },
    ];

    const result = generateTemplateData(translations, { ...mockConfig, rules });

    expect(result).toHaveLength(1);

    expect(result[0]).toMatchObject({
      key: "greeting",
      interpolations: [
        { name: "gender", type: [{ value: "string" }] },
        { name: "name", type: [{ value: "string" }] },
      ],
    });
  });
});
