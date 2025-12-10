export interface SetlistOptions {
  numbered?: boolean;
}

export interface SetlistData {
  title?: string;
  location?: string;
  date?: string;
  lines: string[];
  options?: SetlistOptions;
  locale?: string;
}


