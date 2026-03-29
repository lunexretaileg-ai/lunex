// ── Per-product image sets keyed by slug, then by color (lowercase, trimmed) ──
// Fallback chain: slug → color → first image in set → product.imageUrl
export const PRODUCT_IMAGES: Record<string, Record<string, string[]>> = {
  "iphone-15-pro": {
    "natural titanium": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1695048065079-549f3ea5e5d5?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1695048065078-9e4d0f5d2c6b?w=800&fit=crop&auto=format",
    ],
    "blue titanium": [
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&fit=crop&auto=format",
    ],
    default: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1574755393849-623942496936?w=800&fit=crop&auto=format",
    ],
  },
  "iphone-14-pro-max": {
    "deep purple": [
      "https://images.unsplash.com/photo-1664472896721-ec8e36c46f17?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1562928476-9cc1f8ce2e7d?w=800&fit=crop&auto=format",
    ],
    "space black": [
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&fit=crop&auto=format",
    ],
    default: [
      "https://images.unsplash.com/photo-1664472896721-ec8e36c46f17?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&fit=crop&auto=format",
    ],
  },
  "iphone-13": {
    "midnight": [
      "https://images.unsplash.com/photo-1636054803552-6a1e6c01f4e9?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1574755393849-623942496936?w=800&fit=crop&auto=format",
    ],
    "starlight": [
      "https://images.unsplash.com/photo-1591337676887-a4b1f680c622?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=800&fit=crop&auto=format",
    ],
    default: [
      "https://images.unsplash.com/photo-1636054803552-6a1e6c01f4e9?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1574755393849-623942496936?w=800&fit=crop&auto=format",
    ],
  },
  "iphone-se-3": {
    "product red": [
      "https://images.unsplash.com/photo-1581014023865-376269646c98?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1540891429849-aa76a9f46082?w=800&fit=crop&auto=format",
    ],
    "midnight": [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&fit=crop&auto=format",
    ],
    default: [
      "https://images.unsplash.com/photo-1581014023865-376269646c98?w=800&fit=crop&auto=format",
    ],
  },
  "iphone-15-pro-max-assembled-cn": {
    "titanium": [
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&fit=crop&auto=format",
    ],
    "black titanium": [
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1574755393849-623942496936?w=800&fit=crop&auto=format",
    ],
    default: [
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&fit=crop&auto=format",
    ],
  },
  "macbook-pro-14-m3": {
    "space black": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&fit=crop&auto=format",
    ],
    "silver": [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&fit=crop&auto=format",
    ],
    default: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&fit=crop&auto=format",
    ],
  },
  "macbook-air-13-m1": {
    "space gray": [
      "https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=800&fit=crop&auto=format",
    ],
    "silver": [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&fit=crop&auto=format",
    ],
    default: [
      "https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=800&fit=crop&auto=format",
    ],
  },
  "ipad-air-5": {
    "blue": [
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&fit=crop&auto=format",
    ],
    "space gray": [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=800&fit=crop&auto=format",
    ],
    default: [
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&fit=crop&auto=format",
    ],
  },
  "apple-watch-series-9": {
    "midnight": [
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&fit=crop&auto=format",
    ],
    "starlight": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1590736969955-71cc94d9dbe1?w=800&fit=crop&auto=format",
    ],
    default: [
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&fit=crop&auto=format",
    ],
  },
  "airpods-pro-2": {
    "white": [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1629367494173-c78a56567877?w=800&fit=crop&auto=format",
    ],
    default: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&fit=crop&auto=format",
    ],
  },
  "airpods-max": {
    "sky blue": [
      "https://images.unsplash.com/photo-1603357465999-241beecc2626?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=800&fit=crop&auto=format",
    ],
    default: [
      "https://images.unsplash.com/photo-1603357465999-241beecc2626?w=800&fit=crop&auto=format",
    ],
  },
};

/** Get images for the selected product + color, falling back gracefully */
export function getProductImages(slug: string, color: string | null, fallback: string): string[] {
  const bySlug = PRODUCT_IMAGES[slug];
  if (bySlug) {
    const key = (color ?? "").toLowerCase().trim();
    if (bySlug[key]) return bySlug[key];
    if (bySlug["default"]) return bySlug["default"];
  }

  // If the specific slug isn't mapped, securely fallback to category-specific images
  // This guarantees an iPhone shows an iPhone, even if the database fallback is mixed up.
  const s = slug.toLowerCase();
  if (s.includes('iphone')) {
    return [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1591337676887-a4b1f680c622?w=800&fit=crop&auto=format"
    ];
  }
  if (s.includes('macbook') || s.includes('mac')) {
    return [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=800&fit=crop&auto=format"
    ];
  }
  if (s.includes('ipad')) {
    return [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&fit=crop&auto=format"
    ];
  }
  if (s.includes('watch')) {
    return [
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&fit=crop&auto=format"
    ];
  }
  if (s.includes('airpods')) {
    return [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&fit=crop&auto=format"
    ];
  }

  return [fallback];
}
