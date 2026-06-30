var mealkits = [
  {
    title: "Classic Beef Bulgogi",
    includes: "Sweet Soy-Marinated Beef & Sautéed Glass Noodles",
    description: "Tender, thinly sliced beef in a savory pear-infused soy sauce with spring onions.",
    category: "Premium",
    price: 22.99,
    cookingTime: 15,
    servings: 2,
    imageUrl: "/images/bulgogi.jpg",
    featuredMealKit: true
  },
  {
    title: "Spicy Rice Cakes (Tteokbokki)",
    includes: "Chewy Rice Cakes, Fish Cakes & Hard-Boiled Eggs",
    description: "The ultimate Korean street food featuring a sweet and addictive gochujang chili sauce.",
    category: "Classic",
    price: 14.50,
    cookingTime: 10,
    servings: 2,
    imageUrl: "/images/tteokbokki.jpg",
    featuredMealKit: true
  },
  {
    title: "Bibimbap Harvest Bowl",
    includes: "Assorted Seasoned Vegetables & Signature Gochujang Sauce",
    description: "A colorful, nutritious bowl of rice topped with sautéed roots and fresh greens.",
    category: "Classic",
    price: 18.99,
    cookingTime: 20,
    servings: 2,
    imageUrl: "/images/bibimbap.jpg",
    featuredMealKit: false
  },
  {
    title: "Spicy Pork Stir-Fry (Jeyuk Bokkeum)",
    includes: "Marinated Pork Shoulder & Fresh Lettuce Wraps",
    description: "Fire-roasted pork in a spicy ginger-garlic marinade. Perfect for a protein-packed meal.",
    category: "Premium",
    price: 19.50,
    cookingTime: 15,
    servings: 2,
    imageUrl: "/images/jeyuk.jpg",
    featuredMealKit: false
  },
  {
    title: "Kimchi Stew with Pork Belly",
    includes: "Aged Kimchi, Silken Tofu & Umami Broth Pack",
    description: "A soul-warming stew made with deeply fermented kimchi and rich pork belly.",
    category: "Classic",
    price: 17.99,
    cookingTime: 25,
    servings: 2,
    imageUrl: "/images/kimchi-stew.jpg",
    featuredMealKit: false
  },
  {
    title: "Sweet & Savory Braised Pork Ribs",
    includes: "Tender Ribs, Root Vegetables & Chestnut Garnish",
    description: "Succulent pork ribs slow-braised in a rich soy and garlic reduction.",
    category: "Premium",
    price: 26.00,
    cookingTime: 45,
    servings: 2,
    imageUrl: "/images/galbijjim.jpg",
    featuredMealKit: true
  }
];

module.exports.getAllMealKits = function() {
    return mealkits;
};

module.exports.getFeaturedMealKits = function(mealkits) {
    let filtered = [];
    for (let i = 0; i < mealkits.length; i++) {
        if (mealkits[i].featuredMealKit) { 
            filtered.push(mealkits[i]);
        }
    }
    return filtered;
};

module.exports.getMealKitsByCategory = function(mealkits) {
    let catogoriedMealkits = [];

    for (let i = 0; i < mealkits.length; i++) {
        let temp = mealkits[i];
        let container = null;

        for (let j = 0; j < catogoriedMealkits.length; j++) {
            if (catogoriedMealkits[j].categoryName === temp.category) {
                container = catogoriedMealkits[j];
            }
        }

        if (container === null) {
            catogoriedMealkits.push({
                categoryName: temp.category,
                mealKits: [temp]
            });
        } else {
            container.mealKits.push(temp); 
        }
    }
    return catogoriedMealkits;
};