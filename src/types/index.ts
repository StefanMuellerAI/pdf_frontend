export interface AnonymizationOption {
  id: string;
  label: string;
  description: string;
}

export interface FileUploadState {
  file: File | null;
  error: string | null;
}

export interface ProcessPreferences {
  emails: boolean;
  names: boolean;
  phone_numbers: boolean;
}

export interface UploadResponse {
  task_id: string;
}

export interface ProcessingStatus {
  status: 'Processing' | 'Completed';
  current_page: number;
  total_pages: number;
}