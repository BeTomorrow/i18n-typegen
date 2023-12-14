# i18n-typegen

Generate TS type for your translations keys and interpolate values

## Features

- **🛠 TypeScript Definition Generator**: Generate .d.ts for your i18n function. Provide keys, pluralization and interpolation validation
- **🧘 Not intrusive**: This is a type-only code generator. You are free to use any i18n solutions, including your own. The default works well with i18n-js.

## Usage

### Installation

```bash
npm install @betomorrow/i18n-typegen
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
    "format": "flatten",
    "path": "./i18n/en.json"
  },
  "output": {
    "path": "./i18n/translations.d.ts"
  }
}
```

- input `format` support JSON translations file with
  - `flatten` keys like `home.header.greeting`
  - nested scoped dictionnaries: `{ home: { header: { greeting: "hello" } } }`

### Recommended Toolbox

- Tool for downloading translations from GoogleSheet: [sync-wording](https://github.com/BeTomorrow/sync-wording)
- Styling without trouble your translations on React and React-Native [styled-tagged-text](https://github.com/BeTomorrow/styled-tagged-text)
- Works great with [i18n-js](https://github.com/fnando/i18n-js)

### Example of my implementation over i18n-js

```typescript
import { I18n } from "i18n-js";
import { TranslationFunction } from "translations";
// Import generated type from translations.d.ts

type MyCustomI18n = Omit<I18n, "t"> & {
  t: TranslationFunction;

  /**
   * Same as `t` without any type checking.
   * Should be used only when the translation key cannot be statically inferred.
   */
  unsafeTranslate: (
    key: string,
    interpolations?: Record<string, unknown>
  ) => string;
};

class MyInternationalization extends I18n {
  unsafeTranslate(key: string, interpolations?: Record<string, unknown>) {
    return this.t(key, interpolations);
  }
}

export const i18n = new MyInternationalization(
  {
    fr,
    en,
  },
  { locale: getUserLanguage() }
) as MyCustomI18n;
// ^ Apply my custom type to enjoy static translations and interpolations check  !
```

## Contribution

Contributions, bug reports, feature requests, or pull requests, are very appreciated. However, please note the following:

- **Bug Reports and Feature Requests**: If you encounter a bug or have a feature request, please open an issue. Provide clear details about the problem or the requested feature.

- **Pull Requests**: Feel free to submit pull requests for bug fixes or new features.

- **Limited Support**:
  This project is shared as-is with limited ongoing support. While contributions are welcome, bear in mind that the primary focus is on personal usage. If urgent, consider forking the project.
