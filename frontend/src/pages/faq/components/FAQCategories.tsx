import { FAQCategory, faqCategories } from '../data/faqData';

interface FAQCategoriesProps {
  activeCategory: FAQCategory;
  onSelectCategory: (category: FAQCategory) => void;
  categoryCounts: Record<FAQCategory, number>;
}

export const FAQCategories = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}: FAQCategoriesProps) => {
  return (
    <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 mb-10 sm:mb-12">
      {faqCategories.map((cat) => {
        const isSelected = activeCategory === cat.id;
        const count = categoryCounts[cat.id as FAQCategory] || 0;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id as FAQCategory)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              isSelected
                ? 'bg-primary text-white shadow-soft-sm scale-[1.02]'
                : 'bg-background-alt hover:bg-white text-text-secondary hover:text-text-main border border-border/80'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-white text-text-secondary border border-border/60'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
