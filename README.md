# i18n-typegen

Generate TS type for your translations keys and interpolate values

## Features

- **🛠 TypeScript Definition Generator**: Generate .d.ts for your i18n function. Provide keys, pluralization and interpolation validation
- **🧘 Not intrusive**: This is a type-only code generator. You are free to use any i18n solutions, including your own. The default works well with i18n-js.

## Usage

### Installation

```bash
npm install --save-dev @betomorrow/i18n-typegen
```

### Configuration

```bash
# Generate default config file
npx i18n-typegen init
# Generate your type for keys and interpolations
npx i18n-typegen codegen
```

## Example of What it Does

Given the following JSON input:

```json
{
  "greeting": "Hello {{firstName}} {{familyName}}!",
  "duration.day.one": "1 day",
  "duration.day.other": "{{count}} days",
  "duration.day.zero": "0 day"
}
```

This package generates the following types:

```typescript
type Translations = {
  greeting: { firstName: string; familyName: string };
  "duration.day": { count: number };
  goodbye: undefined;
};
export { TranslationFunction, TranslationFunctionArgs, TranslationKeys };
```

Use these types to type your own i18n function:

```typescript
import { TranslationFunction } from "translations";

const translate: TranslationFunction = () => {};

translate("greeting", { firstName: "Harry", familyName: "Potter" }); // OK

translate("greeting", { firstName: "Henry" }); // Error
/**
    Property 'familyName' is missing in type '{ firstName: string }' but required in type '{ firstName:  string; familyName: string; }'.ts(2345)
    */

translate("goodbye"); // OK
```

## Configuration file

```json
{
  "input": {
    "format": "nested",
    "path": "./input/default.json"
  },
  "output": {
    "path": "./output/default.d.ts"
  },
  "rules": [
    {
      "//": "Add pluralization placeholders",
      "condition": { "keyEndsWith": ["zero", "one", "other"] },
      "transformer": {
        "addPlaceholder": { "name": "count", "type": ["number", "string"] },
        "removeLastPart": true
      }
    },
    {
      "//": "Add interpolation values for matched placeholders",
      "condition": { "placeholderPattern": { "prefix": "{{", "suffix": "}}" } },
      "transformer": {
        "addMatchedPlaceholder": { "type": ["string", "number"] }
      }
    }
  ],
  "extra": {
    "prettierIgnore": true,
    "eslintDisablePrettier": false
  }
}
```

- input `format` support JSON translations file with
  - `flatten` keys like `home.header.greeting`
  - nested scoped dictionnaries: `{ home: { header: { greeting: "hello" } } }`
- extra de-opt generated files from prettier or eslint prettier rule to comply with specific configurations.
  - `prettierIgnore` add `// prettier-ignore` in generated file.
  - `eslintDisablePrettier` add `/* eslint-disable prettier/prettier */` in generated file.

### Recommended Toolbox

- Tool for downloading translations from GoogleSheet: [sync-wording](https://github.com/BeTomorrow/sync-wording)
- Styling without trouble your translations on React and React-Native [styled-tagged-text](https://github.com/BeTomorrow/styled-tagged-text)
- Works great with [i18n-js](https://github.com/fnando/i18n-js)

### Example of implementation

See `docs` for complete usage of type generation with some i18n implementations

- i18n-js [docs/i18n-js.md](docs/i18n-js.md)
- custom implemetation [docs/custom.md](docs/custom.md)

## Contribution

Contributions, bug reports, feature requests, or pull requests, are very appreciated. However, please note the following:

- **Bug Reports and Feature Requests**: If you encounter a bug or have a feature request, please open an issue. Provide clear details about the problem or the requested feature.

- **Pull Requests**: Feel free to submit pull requests for bug fixes or new features.

- **Limited Support**:
  This project is shared as-is with limited ongoing support. While contributions are welcome, bear in mind that the primary focus is on personal usage. If urgent, consider forking the project.
