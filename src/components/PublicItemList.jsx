"use client";

import { useState } from "react";
import PublicMenuItemCard from "./PublicMenuItemCard";
import PublicItemModal from "./PublicItemModal";

export default function PublicItemList({ items }) {
  const [selectedItem, setSelectedItem] = useState(null);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div 
            key={item.food_id} 
            onClick={() => setSelectedItem(item)} 
            className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <PublicMenuItemCard item={item} />
          </div>
        ))}
      </div>

      <PublicItemModal 
        isOpen={!!selectedItem} 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </>
  );
}
