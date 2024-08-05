export interface InterpolationTemplateData {
  name: string;
  type: InterpolationTypeTemplateData[];
  last?: boolean;
}

export interface InterpolationTypeTemplateData {
  value: string;
  last?: boolean;
}

export interface TranslationEntryTemplateData {
  key: string;
  interpolations: InterpolationTemplateData[];
}
