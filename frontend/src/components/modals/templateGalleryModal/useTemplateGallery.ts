import { useState } from 'react';

export const useTemplateGallery = (onSelectTemplate: (template: string) => void) => {
  const [selectedCategory, setSelectedCategory] = useState('Development');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectTemplate = () => {
    onSelectTemplate(selectedCategory || 'Development');
  };

  return {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    handleSelectTemplate,
  };
};
