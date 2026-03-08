import { User, Item } from '../types';
import { generateId } from './helpers';

export const seedData = () => {
  if (localStorage.getItem('rewear_seeded')) return;

  const users: User[] = [
    {
      id: 'user_1',
      name: 'Sarah Jenkins',
      email: 'sarah@example.com',
      location: 'Cape Town, SA',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      rating: 4.8,
      bio: 'Fashion lover and sustainable shopper.',
      verifiedSeller: true,
      salesCount: 12,
      sustainabilityStats: { waterSaved: 1400, wasteSaved: 1.0, co2Saved: 5.0 }
    },
    {
      id: 'user_2',
      name: 'Marcus Chen',
      email: 'marcus@example.com',
      location: 'Johannesburg, SA',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      rating: 4.5,
      bio: 'Sneakerhead selling my collection.',
      verifiedSeller: false,
      salesCount: 3
    },
    {
      id: 'user_3',
      name: 'Elena Rodriguez',
      email: 'elena@example.com',
      location: 'Durban, SA',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      rating: 4.9,
      bio: 'Vintage finds and designer pieces.',
      verifiedSeller: true,
      salesCount: 8
    },
    {
      id: 'user_4',
      name: 'David Wilson',
      email: 'david@example.com',
      location: 'Pretoria, SA',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      rating: 4.2,
      bio: 'Casual wear and basics.',
      verifiedSeller: false,
      salesCount: 1
    },
    {
      id: 'user_5',
      name: 'Sophie Martin',
      email: 'sophie@example.com',
      location: 'Stellenbosch, SA',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      rating: 4.7,
      bio: 'Chic style.',
      verifiedSeller: false,
      salesCount: 0
    }
  ];

  const items: Item[] = [
    {
      id: generateId(),
      title: 'Vintage Levi 501 Jeans',
      description: 'Classic straight leg Levi 501s in a beautiful light wash. Great condition for their age.',
      price: 850,
      originalPrice: 1500,
      category: 'Jeans',
      brand: 'Levi\'s',
      size: 'W32 L30',
      condition: 'Good',
      color: 'Blue',
      images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80'],
      sellerId: 'user_1',
      location: 'Cape Town, SA',
      status: 'available',
      createdAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'Nike Air Jordan 1 Retro',
      description: 'Barely worn Air Jordan 1s. Original box included. Authentic.',
      price: 3500,
      originalPrice: 5000,
      category: 'Shoes',
      brand: 'Nike',
      size: 'UK 9',
      condition: 'Like New',
      color: 'Red/White',
      images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80'],
      sellerId: 'user_2',
      location: 'Johannesburg, SA',
      status: 'available',
      createdAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'Zara Floral Summer Dress',
      description: 'Beautiful light dress perfect for summer weddings or garden parties.',
      price: 450,
      originalPrice: 900,
      category: 'Dresses',
      brand: 'Zara',
      size: 'M',
      condition: 'Excellent',
      color: 'Floral',
      images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80'],
      sellerId: 'user_3',
      location: 'Durban, SA',
      status: 'available',
      createdAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'The North Face Puffer Jacket',
      description: 'Classic Nuptse 700 puffer. Very warm and in great condition.',
      price: 2200,
      originalPrice: 4500,
      category: 'Jackets',
      brand: 'The North Face',
      size: 'L',
      condition: 'Good',
      color: 'Black',
      images: ['https://images.unsplash.com/photo-1544923246-77307dd654ca?w=800&q=80'],
      sellerId: 'user_4',
      location: 'Pretoria, SA',
      status: 'available',
      createdAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'Gucci Marmont Shoulder Bag',
      description: 'Authentic Gucci bag. Minor wear on the corners but otherwise perfect.',
      price: 15000,
      originalPrice: 25000,
      category: 'Bags',
      brand: 'Gucci',
      size: 'Small',
      condition: 'Good',
      color: 'Black',
      images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'],
      sellerId: 'user_5',
      location: 'Stellenbosch, SA',
      status: 'available',
      createdAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'Adidas Ultraboost 21',
      description: 'Running shoes, super comfortable. Used for about 50km.',
      price: 1200,
      originalPrice: 3200,
      category: 'Shoes',
      brand: 'Adidas',
      size: 'UK 10',
      condition: 'Fair',
      color: 'White',
      images: ['https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80'],
      sellerId: 'user_2',
      location: 'Johannesburg, SA',
      status: 'available',
      createdAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'H&M Oversized Hoodie',
      description: 'Comfy basic hoodie in a neutral beige color.',
      price: 250,
      originalPrice: 500,
      category: 'Tops',
      brand: 'H&M',
      size: 'XL',
      condition: 'Excellent',
      color: 'Beige',
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80'],
      sellerId: 'user_1',
      location: 'Cape Town, SA',
      status: 'available',
      createdAt: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'Ray-Ban Wayfarer Sunglasses',
      description: 'Classic shades. No scratches on the lenses.',
      price: 1400,
      originalPrice: 2800,
      category: 'Accessories',
      brand: 'Ray-Ban',
      size: 'Standard',
      condition: 'Excellent',
      color: 'Black',
      images: ['https://images.unsplash.com/photo-1511499767390-90342f16b147?w=800&q=80'],
      sellerId: 'user_4',
      location: 'Pretoria, SA',
      status: 'available',
      createdAt: new Date().toISOString()
    }
  ];

  // Add more items to reach 30
  const categories = ['Dresses', 'Shoes', 'Jackets', 'Bags', 'Jeans', 'Tops', 'Accessories'];
  const brands = ['Nike', 'Zara', 'H&M', 'Adidas', 'Levi\'s', 'Gucci', 'Prada', 'ASOS'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Beige', 'Pink'];
  const conditions = ['New with tags', 'Like New', 'Excellent', 'Good', 'Fair'];
  const sizes = ['S', 'M', 'L', 'XL', 'UK 8', 'UK 10', 'UK 12'];

  for (let i = 0; i < 22; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const originalPrice = Math.floor(Math.random() * 2000) + 500;
    
    items.push({
      id: generateId(),
      title: `${brand} ${category} item`,
      description: `A lovely ${category.toLowerCase()} from ${brand}. Perfect for any occasion.`,
      price: Math.floor(originalPrice * 0.5),
      originalPrice,
      category,
      brand,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      images: [`https://picsum.photos/seed/${i + 100}/800/800`],
      sellerId: user.id,
      location: user.location,
      status: 'available',
      createdAt: new Date().toISOString()
    });
  }

  localStorage.setItem('rewear_users', JSON.stringify(users));
  localStorage.setItem('rewear_items', JSON.stringify(items));
  localStorage.setItem('rewear_seeded', 'true');
};
