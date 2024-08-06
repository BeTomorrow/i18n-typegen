### Example of my implementation over i18n-js

Package: [https://www.npmjs.com/package/i18n-js](https://www.npmjs.com/package/i18n-js)

```json
{
  "animals": {
    "one": "{{count}} animal",
    "other": "{{count}} animals",
    "zero": "No animal"
  },
  "lorem": "Culpa et aliquip proident adipisicing in."
}
```

## Usage

```ts
i18n.t("animals", { count: 2 }); // count is mandatory
i18n.t("lorem");
```

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
  unsafeTranslate: (key: string, interpolations?: Record<string, unknown>) => string;
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
  { locale: getUserLanguage() } // <- load the user language by default
) as MyCustomI18n;
// ^ Apply my custom type to enjoy static translations and interpolations check  !
```

### Default configuration for i18n-js

```json
{
  "input": {
    "format": "nested",
    "path": "./translations/en.json"
  },
  "output": {
    "path": "./translations/translations.d.ts"
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
    },
    {
      "//": "Add interpolation values for matched placeholders using percent",
      "condition": { "placeholderPattern": { "prefix": "%{", "suffix": "}" } },
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
