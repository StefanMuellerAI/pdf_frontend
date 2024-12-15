export interface AnonymizationOption {
  id: string;
  label: string;
  description: string;
}

export interface FileUploadState {
  file: File | null;
  error: ApiError | null;
}

export interface ProcessPreferences {
  emails: boolean;
  names: boolean;
  phone_numbers: boolean;
}

export interface UploadResponse {
  task_id: string;
  message: string;
}

export interface ProcessingStatus {
  status: 'Processing' | 'Completed' | 'Failed';
  current_page?: number;
  total_pages?: number;
  error?: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: {
    suggestion?: string;
    technical_error?: string;
    filename?: string;
    current_pages?: number;
    max_pages?: number;
    [key: string]: any;
  };
}