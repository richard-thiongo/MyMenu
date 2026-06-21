import { FiImage } from "react-icons/fi";

export default function PublicMenuItemCard({ item }) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-border bg-surface-alt transition-all hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/10 h-full">
      {item.img_url ? (
        <div className="w-1/3 shrink-0 bg-surface-elevated flex items-center justify-center border-r border-border">
          <img src={item.img_url} alt={item.food_name} loading="lazy" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="w-1/3 shrink-0 bg-surface-elevated flex items-center justify-center border-r border-border">
           <FiImage className="h-8 w-8 text-text-muted opacity-30" />
        </div>
      )}
      
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-text line-clamp-2 pr-2">{item.food_name}</h3>
            {item.price != null && (
              <span className="font-semibold text-primary-500 shrink-0">KES {parseFloat(item.price).toFixed(2)}</span>
            )}
          </div>
          {item.description && (
            <p className="mt-1 text-sm text-text-muted line-clamp-3">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
