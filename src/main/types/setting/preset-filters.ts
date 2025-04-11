type ReplacementString = {
  target: string;
  value: string;
};

export type PresetFilters = {
  seller: string[];
  forbiddenString: string[];
  replacementString: ReplacementString[];
};
