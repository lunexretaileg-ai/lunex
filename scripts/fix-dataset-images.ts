import fs from 'fs';
import path from 'path';

const datasetPath = path.resolve(process.cwd(), 'plan/dataset.json');
const data = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const imgMap: Record<string, string> = {
  iphone: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800',
  mac: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
  ipad: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
  watch: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800',
  airpods: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800'
};

const photosMap: Record<string, {url: string, caption: string}[]> = {
  iphone: [
    { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', caption: 'Front display' },
    { url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800', caption: 'Back panel' },
    { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800', caption: 'Camera detail' }
  ],
  mac: [
    { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', caption: 'Open view' },
    { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', caption: 'Keyboard' },
    { url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800', caption: 'Ports detail' }
  ],
  ipad: [
    { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800', caption: 'Display' },
    { url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800', caption: 'Back view' },
    { url: 'https://images.unsplash.com/photo-1620826773867-a1a0d4dca7a9?w=800', caption: 'Edge profile' }
  ],
  watch: [
    { url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800', caption: 'Watch face' },
    { url: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800', caption: 'Side profile' },
    { url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800', caption: 'Band detail' }
  ],
  airpods: [
    { url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800', caption: 'Case open' },
    { url: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800', caption: 'Earbuds' },
    { url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800', caption: 'Close up' }
  ]
};

data.products.forEach((p: any) => {
  // Replace the main image url if it's the broken CDN one
  if (p.image_url.includes('cdn-apple.com')) {
    p.image_url = imgMap[p.category];
  }
  
  // Replace product photos with device-specific ones from Unsplash
  if (p.product_photos) {
    p.product_photos = photosMap[p.category].map((photo, i) => ({
      photo_id: `${p.product_id}-PH-${i+1}`,
      url: photo.url,
      caption: photo.caption,
      sort_order: i
    }));
  }
});

fs.writeFileSync(datasetPath, JSON.stringify(data, null, 2), 'utf8');
console.log('✅ Images updated successfully in dataset.json');
