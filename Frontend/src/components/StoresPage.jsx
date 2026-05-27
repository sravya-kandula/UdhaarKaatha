export default function StoresPage() {
  const stores = [
    {
      name: "Sri Lakshmi Kirana Store",
      image:
        "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Annapurna Hotel",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Apollo Medical Store",
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Fresh Basket Store",
      image:
        "https://images.unsplash.com/photo-1579113800032-c38bd7635818?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Sai Mini Mart",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Balaji Super Market",
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Daily Needs Store",
      image:
        "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Family Grocery",
      image:
        "https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "MedPlus Pharmacy",
      image:
        "https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Smart Retail Hub",
      image:
        "https://images.unsplash.com/photo-1481437156560-3205f6a55735?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-orange-50 px-8 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
        All Stores
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stores.map((store, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition"
          >
            <img
              src={store.image}
              alt={store.name}
              className="w-full h-56 object-cover"
            />

            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800">{store.name}</h2>

              <button className="mt-5 w-full py-2 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition">
                Open Store
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
