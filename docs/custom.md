# Custom i18n implementation

## Translations

`en.json`:

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
t("animals", { count: 2 }); // typesafe
t("lorem");
```

# Custom implementation

Since i18n-typegen is a type generator only, you have to provide your own i18n solution.

Here is a very simple example of i18n implementation that take big advantages from typing:

```ts
import type { TranslationFunction } from "translations";

const logger = LoggerManager.getInstance("[🌐 I18n]");

let currentLangData = require("translations/en.json");

export const setLanguage = (data: any) => {
  currentLangData = data;
};

const pluralizer = (count: number) => {
  switch (count) {
    case 0:
      return ["zero", "one", "other"];
    case 1:
      return ["one", "other"];
    default:
      return ["other"];
  }
};

const findPartsForData = (
  data: any,
  parts: string[],
  interpolations?: { [key: string]: string | number } | null
) => {
  for (let index = 0; index < parts.length; ++index) {
    const part = parts[index];
    if (data[part] === undefined) {
      return undefined;
    }
    data = data[part];
  }
  const count = interpolations?.count;
  if (typeof count === "number") {
    const keys = pluralizer(count);
    while (keys.length) {
      const key = keys.shift() as string;
      if (data[key] !== undefined) {
        data = data[key];
        break;
      }
    }
  }
  if (typeof data !== "string") {
    if (typeof data === "number") {
      return String(data);
    }
    return undefined;
  }
  return data;
};

const translate: TranslationFunction = (
  path: string,
  interpolations?: { [key: string]: string | number } | null
) => {
  if (path === undefined || path === null) {
    console.error(new Error("[🌐 I18n] Invalid translation key.").message);
    return "";
  }
  const parts = path.split(".");
  let translation = findPartsForData(currentLangData, parts, interpolations);
  if (translation === undefined) {
    logger.error(`[🌐 I18n] Can't find translation for "${path}"`);
    return path;
  }

  if (interpolations) {
    for (const interpolation in interpolations) {
      translation = translation.replace(
        `{{${interpolation}}}`,
        String(interpolations[interpolation])
      );
    }
  }
  return translation;
};

const unsafeTranslate = translate as (
  key: string,
  interpolations?: { [key: string]: string | number }
) => string;

export { translate as t, unsafeTranslate };
```

- `t` enforce type safety
- `unsafeTranslate` can be used for dynamic keys, when type safety can be a burden

# Configuration

```json
{
  "input": {
    "format": "nested",
    "path": "./i18n/fr.json"
  },
  "output": {
    "path": "./i18n/translations.d.ts"
  },
  "rules": [
    {
      "//": "Add pluralization placeholders",
      "condition": { "keyEndsWith": ["zero", "one", "other"] },
      "transformer": {
        "addPlaceholder": { "name": "count", "type": ["number"] },
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
