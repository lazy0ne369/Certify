/**
 * CertFormFields.jsx — FSAD-PS34
 * Left-column form fields for Add/Edit Certification pages.
 * Used by CertForm.jsx. < 200 lines.
 */

import { FileText, X } from 'lucide-react';
import Input from '../ui/Button'; // Not used directly — import via parent
import { CATEGORIES } from './CertFormConfig';

const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
const inputClass = `w-full h-10 px-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700
  bg-white dark:bg-gray-900 text-gray-900 dark:text-white
  placeholder-gray-400 dark:placeholder-gray-500
  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`;
const errClass = 'text-xs text-red-500 dark:text-red-400 mt-1';

export { labelClass, inputClass, errClass };
