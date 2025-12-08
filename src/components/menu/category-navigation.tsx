"use client";

interface CategoryNavigationProps {
  categories: Array<{ id: string; name: string }>;
}

export function CategoryNavigation({ categories }: CategoryNavigationProps) {
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const headerOffset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (categories.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto mt-5 pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => scrollToCategory(category.id)}
          className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 font-normal rounded-lg text-sm whitespace-nowrap transition-colors duration-200"
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
