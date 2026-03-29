import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, X, Loader2 } from "lucide-react";

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  category: string;
  deviceType: string;
  imageUrl: string;
  startingPrice: number | null;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const DEVICE_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  new:          { label: "جديد",        color: "bg-emerald-100 text-emerald-700" },
  open_box:     { label: "Open Box",    color: "bg-sky-100 text-sky-700" },
  refurbished:  { label: "مجدد",        color: "bg-blue-100 text-blue-700" },
  assembled:    { label: "تجميع",       color: "bg-purple-100 text-purple-700" },
  used:         { label: "مستعمل",      color: "bg-amber-100 text-amber-700" },
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { data: results = [], isFetching } = useQuery<SearchResult[]>({
    queryKey: ["/api/search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return [];
      const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      return res.json();
    },
    enabled: debouncedQuery.length >= 2,
  });

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setActiveIndex(-1);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      goToProduct(results[activeIndex].slug);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const goToProduct = (slug: string) => {
    navigate(`/product/${slug}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Input Row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          {isFetching
            ? <Loader2 className="w-5 h-5 text-gray-400 animate-spin shrink-0" />
            : <Search className="w-5 h-5 text-gray-400 shrink-0" />
          }
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(-1); }}
            onKeyDown={handleKeyDown}
            placeholder="ابحث عن iPhone، MacBook، iPad..."
            className="flex-1 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-2 py-0.5 ml-1"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {results.map((r, i) => {
              const badge = DEVICE_TYPE_LABELS[r.deviceType];
              return (
                <li key={r.id}>
                  <button
                    onClick={() => goToProduct(r.slug)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      i === activeIndex ? "bg-gray-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <img
                      src={r.imageUrl}
                      alt={r.name}
                      className="w-12 h-12 object-cover rounded-xl shrink-0 bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{r.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {badge && (
                          <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${badge.color}`}>
                            {badge.label}
                          </span>
                        )}
                        {r.startingPrice && (
                          <span className="text-[12px] text-gray-500">
                            يبدأ من {r.startingPrice.toLocaleString("ar-EG")} EGP
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-300 shrink-0">↵</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Empty state */}
        {debouncedQuery.length >= 2 && !isFetching && results.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            لم يتم العثور على نتائج لـ "<span className="text-gray-600">{debouncedQuery}</span>"
          </div>
        )}

        {/* Hint when empty */}
        {debouncedQuery.length < 2 && (
          <div className="px-4 py-5 text-center text-gray-400 text-sm">
            اكتب على الأقل حرفين للبدء في البحث
          </div>
        )}
      </div>
    </div>
  );
}
