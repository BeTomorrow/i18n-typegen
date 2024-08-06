export function intersection<T>(current: Set<T>, other: Set<T>) {
  const result = new Set<T>();

  if (current.size > other.size) {
    for (const it of current) {
      if (other.has(it)) {
        result.add(it);
      }
    }
  } else {
    for (const it of other) {
      if (current.has(it)) {
        result.add(it);
      }
    }
  }

  return result;
}
