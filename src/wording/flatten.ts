type NestedObject = {
  [key: string]: string | NestedObject;
};

export function flatten(
  object: NestedObject,
  parentKey = ""
): Record<string, string> {
  const flattenedObject: Record<string, string> = {};

  for (const [key, value] of Object.entries(object)) {
    const currentKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === "object") {
      // Recursively flatten nested keys
      Object.assign(flattenedObject, flatten(value, currentKey));
    } else {
      flattenedObject[currentKey] = value;
    }
  }

  return flattenedObject;
}
