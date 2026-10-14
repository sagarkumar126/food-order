// ✅ Local Food Database — Swiggy-style Indian menu items
// 60 foods covering all major categories

export const foodDatabase = [
  // ═══════════════════════════════════════════
  // 🥗 SALADS (5 items)
  // ═══════════════════════════════════════════
  {
    name: "Garden Fresh Veg Salad",
    description: "Lettuce, green capsicum, cherry tomatoes, corn, olives, and jalapenos tossed in herbs and chili, topped with falafel shots and Thousand Island Dressing.",
    price: 219,
    category: "Salad",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
  },
  {
    name: "Veg Greek Salad",
    description: "A classic veggie salad made with lettuce, green capsicum, cherry tomatoes, broccoli, corn, olives, and jalapenos tossed in herbs and chili. Topped with Feta Cheese and Labneh Dressing.",
    price: 211,
    category: "Salad",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
  },
  {
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast, crisp romaine lettuce, parmesan cheese, croutons, and creamy Caesar dressing.",
    price: 289,
    category: "Salad",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400",
  },
  {
    name: "Fruit & Nut Salad",
    description: "Fresh seasonal fruits — apple, banana, grapes, pomegranate, orange — topped with honey, mint, and roasted nuts.",
    price: 199,
    category: "Salad",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400",
  },
  {
    name: "Paneer Tikka Salad",
    description: "Tandoori paneer cubes, onion, capsicum, cherry tomatoes, and mint chutney dressing on a bed of fresh greens.",
    price: 249,
    category: "Salad",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
  },

  // ═══════════════════════════════════════════
  // 🌯 ROLLS (6 items)
  // ═══════════════════════════════════════════
  {
    name: "Veg Spring Roll",
    description: "Crispy golden rolls stuffed with shredded cabbage, carrots, capsicum, and noodles, served with sweet chili sauce.",
    price: 149,
    category: "Rolls",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400",
  },
  {
    name: "Paneer Kathi Roll",
    description: "Soft egg paratha wrapped with spiced paneer, onions, capsicum, mint chutney, and tangy sauces.",
    price: 189,
    category: "Rolls",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1626777553635-c11f23e7f42d?w=400",
  },
  {
    name: "Chicken Kathi Roll",
    description: "Flaky paratha layered with egg, spiced chicken tikka, onions, green chutney, and tangy sauces.",
    price: 219,
    category: "Rolls",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400",
  },
  {
    name: "Egg Roll",
    description: "Classic Kolkata-style egg roll with paratha, egg, onions, cucumber, and tangy tamarind chutney.",
    price: 129,
    category: "Rolls",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1619221882220-947b3d3c8861?w=400",
  },
  {
    name: "Mushroom Roll",
    description: "Sautéed mushrooms, onions, and capsicum wrapped in a soft paratha with mint mayo.",
    price: 169,
    category: "Rolls",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=400",
  },
  {
    name: "Double Egg Chicken Roll",
    description: "Double egg paratha stuffed with juicy chicken tikka, onions, and spicy chutney.",
    price: 249,
    category: "Rolls",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400",
  },

  // ═══════════════════════════════════════════
  // 🍰 DESSERTS (6 items)
  // ═══════════════════════════════════════════
  {
    name: "Gulab Jamun (2 pcs)",
    description: "Soft, golden-brown dumplings made from khoya, soaked in warm cardamom-rose syrup.",
    price: 99,
    category: "Deserts",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400",
  },
  {
    name: "Rasmalai (2 pcs)",
    description: "Cottage cheese discs soaked in saffron-infused thickened milk, garnished with pistachios.",
    price: 129,
    category: "Deserts",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400",
  },
  {
    name: "Chocolate Brownie with Ice Cream",
    description: "Warm fudgy brownie served with vanilla ice cream and chocolate sauce.",
    price: 179,
    category: "Deserts",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
  },
  {
    name: "Gajar Ka Halwa",
    description: "Slow-cooked carrot pudding with ghee, milk, sugar, and garnished with dry fruits.",
    price: 149,
    category: "Deserts",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400",
  },
  {
    name: "Rasgulla (2 pcs)",
    description: "Spongy cottage cheese balls cooked in light sugar syrup, a Bengali classic.",
    price: 89,
    category: "Deserts",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1593702331333-8e9f9f0d3e5f?w=400",
  },
  {
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers, mascarpone cream, and cocoa.",
    price: 249,
    category: "Deserts",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
  },

  // ═══════════════════════════════════════════
  // 🥪 SANDWICH (5 items)
  // ═══════════════════════════════════════════
  {
    name: "Veg Grilled Sandwich",
    description: "Grilled sandwich with potato, cucumber, tomato, onion, and mint chutney, served with chips.",
    price: 129,
    category: "Sandwich",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400",
  },
  {
    name: "Paneer Tikka Sandwich",
    description: "Toasted sandwich filled with spiced paneer tikka, capsicum, onion, and cheese.",
    price: 169,
    category: "Sandwich",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1539252554935-80c8c2b8f9e1?w=400",
  },
  {
    name: "Chicken Club Sandwich",
    description: "Triple-decker sandwich with grilled chicken, egg, lettuce, tomato, and mayo.",
    price: 199,
    category: "Sandwich",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=400",
  },
  {
    name: "Cheese Chilli Toast",
    description: "Toasted bread topped with melted cheese, green chillies, and herbs.",
    price: 119,
    category: "Sandwich",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400",
  },
  {
    name: "Bombay Masala Sandwich",
    description: "Mumbai-style sandwich with spiced potato, chutney, onion, and sev.",
    price: 139,
    category: "Sandwich",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400",
  },

  // ═══════════════════════════════════════════
  // 🍰 CAKE (5 items)
  // ═══════════════════════════════════════════
  {
    name: "Chocolate Truffle Cake",
    description: "Rich chocolate sponge layered with dark chocolate truffle ganache.",
    price: 549,
    category: "Cake",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
  },
  {
    name: "Red Velvet Cake",
    description: "Classic red velvet sponge with cream cheese frosting and red velvet crumbs.",
    price: 599,
    category: "Cake",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1586985289906-406988974504?w=400",
  },
  {
    name: "Black Forest Cake",
    description: "Chocolate sponge with cherries, whipped cream, and chocolate shavings.",
    price: 499,
    category: "Cake",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400",
  },
  {
    name: "Butterscotch Cake",
    description: "Soft butterscotch sponge with caramel drizzle and crunchy praline.",
    price: 529,
    category: "Cake",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400",
  },
  {
    name: "Blueberry Cheesecake",
    description: "Creamy baked cheesecake with blueberry compote and biscuit base.",
    price: 649,
    category: "Cake",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400",
  },

  // ═══════════════════════════════════════════
  // 🌱 PURE VEG (6 items)
  // ═══════════════════════════════════════════
  {
    name: "Special Veg Thali",
    description: "Assorted veg curries, dal, rice, roti, salad, papad, and dessert — a complete meal.",
    price: 395,
    category: "Pure Veg",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1626500155537-8f7a9b0e4d7f?w=400",
  },
  {
    name: "Paneer Butter Masala",
    description: "Soft paneer cubes in rich, creamy tomato-butter gravy with aromatic spices.",
    price: 289,
    category: "Pure Veg",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
  },
  {
    name: "Dal Makhani",
    description: "Slow-cooked black lentils with butter, cream, and mild spices.",
    price: 249,
    category: "Pure Veg",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
  },
  {
    name: "Kadai Paneer",
    description: "Paneer cooked with capsicum, onion, and freshly ground kadai masala.",
    price: 279,
    category: "Pure Veg",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400",
  },
  {
    name: "Aloo Gobi Masala",
    description: "Classic dry curry of potato and cauliflower with turmeric and spices.",
    price: 219,
    category: "Pure Veg",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400",
  },
  {
    name: "Veg Biryani",
    description: "Fragrant basmati rice layered with mixed vegetables and aromatic spices, served with raita.",
    price: 259,
    category: "Pure Veg",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
  },

  // ═══════════════════════════════════════════
  // 🍝 PASTA (5 items)
  // ═══════════════════════════════════════════
  {
    name: "White Sauce Pasta",
    description: "Creamy béchamel sauce with penne, veggies, and herbs.",
    price: 219,
    category: "Pasta",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
  },
  {
    name: "Red Sauce Pasta",
    description: "Tangy tomato-basil sauce with penne and fresh vegetables.",
    price: 209,
    category: "Pasta",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?w=400",
  },
  {
    name: "Pink Sauce Pasta",
    description: "Blend of tomato and cream sauce with penne, olives, and herbs.",
    price: 229,
    category: "Pasta",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400",
  },
  {
    name: "Chicken Alfredo Pasta",
    description: "Creamy Alfredo sauce with grilled chicken and fettuccine.",
    price: 329,
    category: "Pasta",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400",
  },
  {
    name: "Arrabbiata Pasta",
    description: "Spicy Italian pasta with garlic, red chilli, and tomato sauce.",
    price: 219,
    category: "Pasta",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400",
  },

  // ═══════════════════════════════════════════
  // 🍜 NOODLES (6 items)
  // ═══════════════════════════════════════════
  {
    name: "Veg Hakka Noodles",
    description: "Wok-tossed noodles with cabbage, carrots, capsicum, and soy sauce.",
    price: 179,
    category: "Noodles",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400",
  },
  {
    name: "Schezwan Noodles",
    description: "Spicy Schezwan sauce tossed with noodles and crunchy vegetables.",
    price: 189,
    category: "Noodles",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400",
  },
  {
    name: "Chicken Hakka Noodles",
    description: "Noodles stir-fried with shredded chicken, veggies, and oriental sauces.",
    price: 229,
    category: "Noodles",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400",
  },
  {
    name: "Chilli Garlic Noodles",
    description: "Spicy noodles with garlic, green chillies, and soy sauce.",
    price: 179,
    category: "Noodles",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
  },
  {
    name: "Manchow Noodles",
    description: "Crispy fried noodles with spicy Manchow sauce and veggies.",
    price: 199,
    category: "Noodles",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=400",
  },
  {
    name: "Egg Noodles",
    description: "Hakka noodles with scrambled eggs and oriental spices.",
    price: 199,
    category: "Noodles",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
  },

  // ═══════════════════════════════════════════
  // 🍕 PIZZA (6 items)
  // ═══════════════════════════════════════════
  {
    name: "Margherita Pizza",
    description: "Classic pizza with mozzarella, tomato sauce, and fresh basil.",
    price: 249,
    category: "Pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
  },
  {
    name: "Farmhouse Pizza",
    description: "Loaded with onion, capsicum, mushroom, tomato, and mozzarella.",
    price: 349,
    category: "Pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
  },
  {
    name: "Peppy Paneer Pizza",
    description: "Paneer, capsicum, red paprika, and mozzarella on a crispy base.",
    price: 399,
    category: "Pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
  },
  {
    name: "Chicken Tikka Pizza",
    description: "Spiced chicken tikka, onion, capsicum, and mozzarella.",
    price: 449,
    category: "Pizza",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400",
  },
  {
    name: "Pepperoni Pizza",
    description: "Classic pepperoni with mozzarella and tomato sauce.",
    price: 499,
    category: "Pizza",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
  },
  {
    name: "Veggie Paradise Pizza",
    description: "Loaded with golden corn, black olives, capsicum, tomato, and jalapenos.",
    price: 379,
    category: "Pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400",
  },

  // ═══════════════════════════════════════════
  // 🍔 BURGER (6 items)
  // ═══════════════════════════════════════════
  {
    name: "Veg Aloo Tikki Burger",
    description: "Crispy potato tikki, onion, tomato, lettuce, and tangy sauces in a soft bun.",
    price: 99,
    category: "Burger",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
  },
  {
    name: "Paneer Zinger Burger",
    description: "Crunchy paneer patty with spicy mayo, lettuce, and cheese.",
    price: 179,
    category: "Burger",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400",
  },
  {
    name: "Chicken Zinger Burger",
    description: "Crispy chicken fillet, spicy mayo, lettuce, and cheese in a sesame bun.",
    price: 199,
    category: "Burger",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400",
  },
  {
    name: "Double Cheese Burger",
    description: "Double patty with double cheese, onion, pickles, and burger sauce.",
    price: 249,
    category: "Burger",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400",
  },
  {
    name: "Mushroom Swiss Burger",
    description: "Grilled mushroom patty with Swiss cheese, caramelized onion, and garlic aioli.",
    price: 229,
    category: "Burger",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400",
  },
  {
    name: "McAloo Tikki Style Burger",
    description: "Spiced potato patty, tomato, onion, and special sauce in a soft bun.",
    price: 79,
    category: "Burger",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1615297928064-24977384d8d6?w=400",
  },

  // ═══════════════════════════════════════════
  // 🍗 CHICKEN (5 items)
  // ═══════════════════════════════════════════
  {
    name: "Chicken Biryani",
    description: "Fragrant basmati rice layered with spiced chicken, caramelized onions, and saffron.",
    price: 299,
    category: "Chicken",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
  },
  {
    name: "Butter Chicken",
    description: "Tandoori chicken in rich, creamy tomato-butter gravy.",
    price: 349,
    category: "Chicken",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
  },
  {
    name: "Chicken 65",
    description: "Spicy, deep-fried chicken bites with curry leaves and red chillies.",
    price: 249,
    category: "Chicken",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400",
  },
  {
    name: "Tandoori Chicken (Half)",
    description: "Half chicken marinated in yogurt and spices, cooked in tandoor.",
    price: 399,
    category: "Chicken",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400",
  },
  {
    name: "Chicken Fried Rice",
    description: "Wok-tossed rice with shredded chicken, egg, and veggies.",
    price: 229,
    category: "Chicken",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
  },

  // ═══════════════════════════════════════════
  // 🥪 STARTERS & SNACKS (6 items)
  // ═══════════════════════════════════════════
  {
    name: "Paneer Tikka",
    description: "Marinated paneer cubes grilled with onion and capsicum, served with mint chutney.",
    price: 289,
    category: "Starters",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400",
  },
  {
    name: "Chicken Tikka",
    description: "Boneless chicken marinated in yogurt and spices, grilled in tandoor.",
    price: 329,
    category: "Starters",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400",
  },
  {
    name: "Veg Manchurian (Dry)",
    description: "Crispy veg balls tossed in spicy Manchurian sauce.",
    price: 199,
    category: "Starters",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1613145997970-db84a7975fbb?w=400",
  },
  {
    name: "Chilli Paneer",
    description: "Crispy paneer cubes tossed with onion, capsicum, and spicy sauce.",
    price: 249,
    category: "Starters",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400",
  },
  {
    name: "French Fries",
    description: "Crispy golden fries, salted, served with ketchup.",
    price: 99,
    category: "Starters",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400",
  },
  {
    name: "Chicken Wings (6 pcs)",
    description: "Crispy fried chicken wings tossed in spicy buffalo sauce.",
    price: 279,
    category: "Starters",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400",
  },
];

// ✅ Smart search function — name, category, description sabme dhundta hai
export const searchFood = (query) => {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();

  return foodDatabase
    .map((item) => {
      const name = item.name.toLowerCase();
      const category = item.category.toLowerCase();
      const description = item.description.toLowerCase();

      let score = 0;
      if (name === q) score += 100;
      if (name.startsWith(q)) score += 50;
      if (name.includes(q)) score += 30;
      if (category.includes(q)) score += 20;
      if (description.includes(q)) score += 10;

      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
};



