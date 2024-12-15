import { Info } from 'lucide-react';
import type { AnonymizationOption } from '../types';

interface CategorySelectorProps {
  categories: AnonymizationOption[];
  selectedCategories: string[];
  onCategoryChange: (categoryId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function CategorySelector({ 
  categories, 
  selectedCategories, 
  onCategoryChange,
  onSelectAll,
  onDeselectAll
}: CategorySelectorProps) {
  const allSelected = categories.length === selectedCategories.length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Select data to anonymize</h3>
        <button
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="flex items-start space-x-3">
            <input
              type="checkbox"
              id={category.id}
              checked={selectedCategories.includes(category.id)}
              onChange={() => onCategoryChange(category.id)}
              className="mt-1 h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
            />
            <div className="flex-1">
              <label htmlFor={category.id} className="text-sm font-medium text-gray-700">
                {category.label}
              </label>
              <div className="flex items-center space-x-1">
                <Info className="h-4 w-4 text-gray-400" />
                <p className="text-xs text-gray-500">{category.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}