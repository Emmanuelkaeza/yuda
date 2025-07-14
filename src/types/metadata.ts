export type Metadata = {
  customFields?: Record<string, string | number | boolean>;
  notes?: string;
  tags?: string[];
  lastModifiedBy?: string;
  lastModifiedAt?: string;
};
