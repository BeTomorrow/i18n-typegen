export interface InterpolationTemplateData {
  name: string;
  type: "string" | "number";
}

export interface WordingEntryTemplateData {
  key: string;
  interpolations: InterpolationTemplateData[];
}
