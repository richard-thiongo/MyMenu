export function groupItemsByCategory(items) {
  if (!items || !Array.isArray(items)) return {};
  
  return items.reduce((acc, item) => {
    const category = item.category_name;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
}
