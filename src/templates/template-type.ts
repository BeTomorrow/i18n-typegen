export interface InterpolationTemplateData {
  name: string;
  type: "string" | "number";
  last?: boolean;
}

export interface WordingEntryTemplateData {
  key: string;
  interpolations: InterpolationTemplateData[];
}
