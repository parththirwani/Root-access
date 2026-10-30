// Curated order for public navigation and the homepage explore index.
export const sectionOrder = ['writing', 'projects', 'publications', 'quotes', 'books'];
export const categoryOrder = ['lists', 'craft'];

export function orderSections<T extends { slug: string; name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aIndex = sectionOrder.indexOf(a.slug);
    const bIndex = sectionOrder.indexOf(b.slug);
    if (aIndex !== -1 || bIndex !== -1) {
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    }
    return a.name.localeCompare(b.name);
  });
}

export function orderCategories<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.name.toLowerCase());
    const bIndex = categoryOrder.indexOf(b.name.toLowerCase());
    if (aIndex !== -1 || bIndex !== -1) {
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    }
    return a.name.localeCompare(b.name);
  });
}
