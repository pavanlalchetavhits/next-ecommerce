import dotenv from 'dotenv';
dotenv.config();

const CATEGORY_PRODUCTS: Record<string, any[]> = {
  Electronics: [
    {
      name: 'Quantum 4K Ultra Studio Monitor 27"',
      price: 28999,
      comparePrice: 34999,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Resolution', value: '3840 x 2160 (4K UHD)' }, { key: 'Refresh Rate', value: '144Hz' }],
    },
    {
      name: 'Mechanix RGB Mechanical Keyboard',
      price: 3899,
      comparePrice: 4999,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Switches', value: 'Tactile Hot-Swappable' }, { key: 'Backlight', value: 'RGB Customs' }],
    },
    {
      name: 'AeroGlide Ergonomic Wireless Mouse',
      price: 1499,
      comparePrice: 1999,
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Sensor', value: '26K DPI Optical' }, { key: 'Weight', value: '58 grams' }],
    },
    {
      name: 'AeroCharge 20000mAh MagSafe Power Bank',
      price: 2499,
      comparePrice: 3299,
      image: 'https://images.unsplash.com/photo-1609592424089-98a96d1945db?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Capacity', value: '20,000 mAh' }, { key: 'Fast Charge', value: '65W USB-C PD' }],
    },
    {
      name: 'SoundWave Boom Portable Bluetooth Speaker',
      price: 3299,
      comparePrice: 4299,
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Output', value: '40W Bass Stereo' }, { key: 'Battery', value: '24 Hours' }],
    },
    {
      name: 'UltraTab Pro 11" IPS Android Tablet',
      price: 18999,
      comparePrice: 22999,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'RAM', value: '8GB' }, { key: 'Storage', value: '256GB SSD' }],
    },
    {
      name: 'CyberCam 4K Studio Streaming Webcam',
      price: 4599,
      comparePrice: 5999,
      image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Resolution', value: '4K Ultra HD 60fps' }, { key: 'Mic', value: 'Dual Noise-Canceling' }],
    },
    {
      name: 'HyperCharge 100W GaN 4-Port Fast Charger',
      price: 2999,
      comparePrice: 3999,
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Total Power', value: '100W GaN III' }, { key: 'Ports', value: '3x USB-C, 1x USB-A' }],
    },
    {
      name: 'SonicBuds Pro Active ANC Earbuds',
      price: 4999,
      comparePrice: 6999,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'ANC', value: '45dB Hybrid ANC' }, { key: 'Playtime', value: '38 Hours' }],
    },
    {
      name: 'PortHub 7-in-1 Aluminum USB-C Dock',
      price: 1999,
      comparePrice: 2799,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'HDMI Output', value: '4K 60Hz' }, { key: 'Power Delivery', value: '100W Pass-through' }],
    },
  ],

  'Apparel & Fashion': [
    {
      name: 'Apex Ultra Smartwatch Metallic Titanium',
      price: 7999,
      comparePrice: 10999,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Dial Material', value: 'Aerospace Grade Titanium' }, { key: 'Strap', value: 'Italian Leather' }],
    },
    {
      name: 'Urban Flex Waterproof Bomber Jacket',
      price: 3499,
      comparePrice: 4999,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Material', value: 'Waterproof Polyester' }, { key: 'Fit', value: 'Modern Slim Fit' }],
    },
    {
      name: 'Classic Aviator UV400 Sunglasses',
      price: 1299,
      comparePrice: 1999,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'UV Protection', value: '100% UV400 Polarized' }, { key: 'Frame', value: 'Stainless Alloy' }],
    },
    {
      name: 'Nomad Leather Crossbody Messenger Bag',
      price: 2999,
      comparePrice: 4299,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Leather', value: 'Top Grain Genuine Leather' }, { key: 'Compartments', value: 'Laptop + Tablet' }],
    },
    {
      name: 'UltraLite Breathable Cushion Sneakers',
      price: 2799,
      comparePrice: 3899,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Sole', value: 'Responsive EVA Foam' }, { key: 'Upper', value: 'Breathable Flyknit Mesh' }],
    },
    {
      name: 'Apex Minimalist RFID Blocking Wallet',
      price: 999,
      comparePrice: 1499,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Capacity', value: '10 Cards + Money Clip' }, { key: 'Security', value: 'RFID Shielding' }],
    },
    {
      name: 'All-Weather Tactical Hooded Windbreaker',
      price: 2499,
      comparePrice: 3499,
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Feature', value: 'Windproof & Rain Resistant' }, { key: 'Pockets', value: '6 Tactical Zip Pockets' }],
    },
    {
      name: 'Vintage Canvas Weekend Duffle Bag',
      price: 2199,
      comparePrice: 2999,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Capacity', value: '45 Liters' }, { key: 'Straps', value: 'Adjustable Padded Shoulder' }],
    },
    {
      name: 'Seamless Athletic Performance Hoodie',
      price: 1899,
      comparePrice: 2499,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Fabric', value: 'Cotton Blend Stretch' }, { key: 'Fit', value: 'Athletic Cut' }],
    },
    {
      name: 'Premium Automatic Skeleton Dial Watch',
      price: 8999,
      comparePrice: 12999,
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Movement', value: '21-Jewel Automatic' }, { key: 'Glass', value: 'Sapphire Crystal' }],
    },
  ],

  'Home & Kitchen': [
    {
      name: 'LumixSmart Ambient RGB Desk Light Bar',
      price: 1899,
      comparePrice: 2499,
      image: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Control', value: 'Smart App & Voice' }, { key: 'Power', value: 'USB Type-C' }],
    },
    {
      name: 'Vision360 2K Smart Home Security Camera',
      price: 2799,
      comparePrice: 3599,
      image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Resolution', value: '2K QHD 1440p' }, { key: 'Night Vision', value: 'Color Night Vision' }],
    },
    {
      name: 'Precision Barista Espresso Coffee Maker',
      price: 9999,
      comparePrice: 13999,
      image: 'https://images.unsplash.com/photo-1517668808822-9eaa03afd2af?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Pressure', value: '20-Bar Italian Pump' }, { key: 'Capacity', value: '1.5L Water Tank' }],
    },
    {
      name: 'AeroPure HEPA Air Purifier Pro',
      price: 6499,
      comparePrice: 8499,
      image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Filter', value: 'True H13 HEPA' }, { key: 'Coverage', value: '450 Sq. Ft.' }],
    },
    {
      name: 'Smart Touchless Motion Sensor Trash Can',
      price: 1999,
      comparePrice: 2799,
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Capacity', value: '13 Gallon / 50L' }, { key: 'Sensor', value: '0.1s Fast Infrared' }],
    },
    {
      name: 'ThermoChef Digital Air Fryer XL 5.5L',
      price: 4999,
      comparePrice: 6999,
      image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Technology', value: '360° Rapid Hot Air' }, { key: 'Presets', value: '8 One-Touch Cooking Modes' }],
    },
    {
      name: 'Smart Robot Vacuum Cleaner with Mop',
      price: 14999,
      comparePrice: 19999,
      image: 'https://images.unsplash.com/photo-1563161499-7303170e11ba?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Suction', value: '4000Pa Turbo' }, { key: 'Mapping', value: 'LiDAR Laser Navigation' }],
    },
    {
      name: 'ChefCut 6-Piece High-Carbon Japanese Knife Set',
      price: 3299,
      comparePrice: 4599,
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Steel', value: 'High Carbon 7CR17 Stainless' }, { key: 'Block', value: 'Natural Pakkawood' }],
    },
    {
      name: 'HydroGlow Smart Temperature Display Water Bottle',
      price: 899,
      comparePrice: 1299,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Insulation', value: '24hr Cold / 12hr Hot' }, { key: 'Display', value: 'LED Touch Screen' }],
    },
    {
      name: 'UltraClean Cordless Handheld Vacuum',
      price: 2299,
      comparePrice: 3199,
      image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Suction', value: '12000Pa Cyclone' }, { key: 'Weight', value: '650 grams' }],
    },
  ],

  'Beauty & Personal Care': [
    {
      name: 'SonicClean Electric Rechargeable Toothbrush',
      price: 1699,
      comparePrice: 2299,
      image: 'https://images.unsplash.com/photo-1559591937-e58af100c6ba?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Vibrations', value: '40,000 Sonic Strokes/min' }, { key: 'Battery', value: '60 Days Single Charge' }],
    },
    {
      name: 'AirGlide Ionic Hair Dryer & Styler Pro',
      price: 2999,
      comparePrice: 3999,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Motor', value: '1800W Brushless Motor' }, { key: 'Ionic Tech', value: 'Negative Ion Anti-Frizz' }],
    },
    {
      name: 'Precision Waterproof Body & Beard Trimmer',
      price: 1499,
      comparePrice: 1999,
      image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Blades', value: 'Self-Sharpening Titanium' }, { key: 'Waterproof', value: 'IPX7 Washable' }],
    },
    {
      name: 'GlowPulse Microcurrent Facial Massager',
      price: 2199,
      comparePrice: 2999,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Modes', value: 'Microcurrent + Red LED Therapy' }, { key: 'Function', value: 'Skin Lifting & Toning' }],
    },
    {
      name: 'HydroMist Nano Portable Facial Steamer',
      price: 1199,
      comparePrice: 1699,
      image: 'https://images.unsplash.com/photo-1512290900676-26c2a48f913e?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Steam Type', value: 'Ionic Nano Steam' }, { key: 'Tank', value: '100ml Water Capacity' }],
    },
    {
      name: 'Thermal Ceramic Hair Straightener Brush',
      price: 1899,
      comparePrice: 2499,
      image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Heating', value: '30s MCH Fast Heating' }, { key: 'Temp Range', value: '130°C - 230°C' }],
    },
    {
      name: 'Deep Tissue Percussion Muscle Massage Gun',
      price: 2999,
      comparePrice: 4299,
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Speed Levels', value: '30 Adjustable Speeds' }, { key: 'Heads', value: '6 Interchangeable Attachments' }],
    },
    {
      name: 'Sonic Exfoliating Silicone Facial Cleanser',
      price: 999,
      comparePrice: 1499,
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Material', value: 'Medical Grade Silicone' }, { key: 'Pulsations', value: '8000 Sonic Pulses/min' }],
    },
    {
      name: 'UltraLight UV LED Gel Nail Lamp 48W',
      price: 1299,
      comparePrice: 1799,
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'LED Beads', value: '30 Dual Light LEDs' }, { key: 'Timer', value: '10s, 30s, 60s, 99s' }],
    },
    {
      name: 'Digital Infrared Skin Moisture Analyzer',
      price: 799,
      comparePrice: 1199,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Sensor', value: 'Bio-Electric Impedance' }, { key: 'Display', value: 'Backlit LCD Screen' }],
    },
  ],

  'Sports & Outdoors': [
    {
      name: 'NovaFit Fitness Tracker Watch Pulse Pro',
      price: 2199,
      comparePrice: 2999,
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Sports Modes', value: '120+ Active Tracking Modes' }, { key: 'Display', value: '1.1" Curved AMOLED' }],
    },
    {
      name: 'FlexGrip Adjustable Dumbbell Set (24kg)',
      price: 8999,
      comparePrice: 11999,
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Weight Range', value: '2.5kg to 24kg per Dumbbell' }, { key: 'Dial System', value: '15 Weight Adjustments' }],
    },
    {
      name: 'ProForm Non-Slip Eco Yoga Mat (6mm)',
      price: 1199,
      comparePrice: 1699,
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Material', value: 'Eco TPE Biodegradable' }, { key: 'Thickness', value: '6mm High Density' }],
    },
    {
      name: 'AeroJump Smart Bluetooth Counting Jump Rope',
      price: 999,
      comparePrice: 1499,
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Display', value: 'HD LED Jump Counter' }, { key: 'Cable', value: 'Steel Wire PVC Coated' }],
    },
    {
      name: 'TrailBlazer 30L Waterproof Hiking Backpack',
      price: 2499,
      comparePrice: 3499,
      image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Capacity', value: '30 Liters' }, { key: 'Feature', value: 'Built-in Rain Cover' }],
    },
    {
      name: 'HydroFlask Double-Wall Insulated Bottle 1L',
      price: 1299,
      comparePrice: 1799,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Material', value: '18/8 Pro Grade Stainless Steel' }, { key: 'Insulation', value: '24 hrs Cold / 12 hrs Hot' }],
    },
    {
      name: 'FlexBand Heavy-Duty Resistance Bands Set',
      price: 799,
      comparePrice: 1199,
      image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Levels', value: '5 Latex Resistance Bands (10-50 lbs)' }, { key: 'Extras', value: 'Door Anchor & Handles' }],
    },
    {
      name: 'Apex Speed Agility Training Ladder Kit',
      price: 1399,
      comparePrice: 1899,
      image: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Ladder Length', value: '6 Meters / 12 Rungs' }, { key: 'Includes', value: '12 Cones + Running Parachute' }],
    },
    {
      name: 'ProFit Foam Roller for Muscle Recovery',
      price: 899,
      comparePrice: 1299,
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Grid Pattern', value: '3D Deep Tissue Trigger Points' }, { key: 'Length', value: '45cm' }],
    },
    {
      name: 'UltraGrip Padded Gym Workout Gloves',
      price: 599,
      comparePrice: 899,
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
      specs: [{ key: 'Padding', value: 'Silicone Anti-Slip Palm Padding' }, { key: 'Wrist Support', value: 'Integrated Wrist Wraps' }],
    },
  ],
};

async function seedProductsAccurate() {
  console.log('Connecting to database...');
  const { default: db } = await import('../lib/db');
  const { createProduct } = await import('../services/product.service');
  const { getCategories, createCategory } = await import('../services/category.service');

  // 1. Fetch categories
  let categories: any = await getCategories();
  const categoryNamesInDB = Array.isArray(categories) ? categories.map((c) => c.name) : [];
  console.log('Existing DB Categories:', categoryNamesInDB);

  // Map category names to IDs
  const categoryMap: Record<string, number> = {};
  for (const c of categories) {
    categoryMap[c.name] = Number(c.id);
  }

  // Clear existing product tables
  console.log('Clearing existing product & image tables...');
  try {
    await db.query('SET FOREIGN_KEY_CHECKS = 0;');
    await db.query('TRUNCATE TABLE product_images;');
    await db.query('TRUNCATE TABLE products;');
    await db.query('SET FOREIGN_KEY_CHECKS = 1;');
  } catch (e) {
    await db.query('DELETE FROM product_images;');
    await db.query('DELETE FROM products;');
  }

  console.log('Seeding 50 products accurately mapped into 5 database categories...');

  let count = 0;
  let skuNumber = 1001;

  for (const [catName, productList] of Object.entries(CATEGORY_PRODUCTS)) {
    const catId = categoryMap[catName];
    if (!catId) {
      console.warn(`Category "${catName}" not found in DB! Skipping...`);
      continue;
    }

    for (const item of productList) {
      const slug = `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${skuNumber}`;
      const sku = `SKU-NC-${skuNumber}`;
      const isFeatured = count % 4 === 0;

      const productPayload: any = {
        category_id: catId,
        name: item.name,
        slug: slug,
        sku: sku,
        price: item.price,
        compare_at_price: item.comparePrice,
        short_description: `<p>Experience top quality with <strong>${item.name}</strong>. Certified authentic for ${catName}.</p>`,
        description: `<p>The <strong>${item.name}</strong> is designed to offer exceptional reliability and style in the ${catName} collection. Engineered with premium materials and ergonomic craftsmanship.</p><ul><li>Authentic ${catName} guarantee</li><li>Full manufacturer warranty</li><li>Fast express delivery</li></ul>`,
        care_instructions: 'Clean with a soft dry cloth. Store in a cool dry place.',
        shipping_info: 'Pan-India express shipping available. Dispatched within 24 hours in eco-friendly packaging.',
        specifications: item.specs,
        faq: [
          { question: 'What is covered under the warranty?', answer: '12-month manufacturer warranty covering hardware defects.' },
          { question: 'Is express delivery available?', answer: 'Yes, 2-4 business day delivery across all PIN codes.' },
        ],
        status: 'active',
        featured: isFeatured,
        images: [
          {
            image_url: item.image,
            alt_text: item.name,
            is_primary: true,
            sort_order: 1,
          },
        ],
      };

      try {
        await createProduct(productPayload);
        count++;
        console.log(`[${count}/50] [${catName}] -> ${item.name} (SKU: ${sku})`);
      } catch (err: any) {
        console.error(`Failed to create product ${item.name}:`, err.message || err);
      }

      skuNumber++;
    }
  }

  console.log(`\n🎉 Successfully seeded ${count} products accurately mapped across all 5 database categories!`);
  process.exit(0);
}

seedProductsAccurate();
