import { DataCategory } from '../types';

export const DATA_CATEGORIES: DataCategory[] = [
  {
    id: 'phone_numbers',
    label: 'Phone Numbers',
    description: 'Detect and anonymize phone numbers in various formats'
  },
  {
    id: 'first_names',
    label: 'First Names',
    description: 'Detect and anonymize first names of individuals'
  },
  {
    id: 'last_names',
    label: 'Last Names',
    description: 'Detect and anonymize last names/family names'
  },
  {
    id: 'addresses',
    label: 'Addresses',
    description: 'Detect and anonymize physical addresses'
  },
  {
    id: 'social_security_numbers',
    label: 'Social Security Numbers',
    description: 'Detect and anonymize social security numbers and equivalent IDs'
  },
  {
    id: 'dates_of_birth',
    label: 'Dates of Birth',
    description: 'Detect and anonymize dates of birth and age information'
  },
  {
    id: 'account_numbers',
    label: 'Account Numbers',
    description: 'Detect and anonymize bank account numbers and banking information'
  },
  {
    id: 'email_addresses',
    label: 'Email Addresses',
    description: 'Detect and anonymize email addresses'
  },
  {
    id: 'case_numbers',
    label: 'Case Numbers',
    description: 'Detect and anonymize legal or administrative case numbers'
  }
];