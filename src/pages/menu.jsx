import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import Navbar from "../components/navbar";
import Foodcard from "../components/foodcard";

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Create the query
    // NOTE: If the menu is empty, check your browser console (F12). 
    // You might need to click a link to create a 'Firestore Index' for orderBy.
    const q = query(
      collection(db, "menu"), 
      where("available", "==", true),
      orderBy("createdAt", "desc")
    );
    
    // 2. Setup the real-time listener
    const unsub = onSnapshot(q, (snapshot) => {
      const foodData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFoods(foodData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching menu:", error);
      // If there's a permission error or index error, stop loading so 
      // the app doesn't hang forever.
      setLoading(false);
    });

    return () => unsub();
  }, []); // Empty dependency array means this runs for everyone on page load

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-2">
            The <span className="text-orange-500">Cafe</span> Menu
          </h1>
          <p className="text-gray-500 font-medium italic">Freshly brewed and prepared daily.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400 font-bold animate-pulse">Waking up the baristas...</p>
          </div>
        ) : (
          <>
            {foods.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-inner">
                <p className="text-gray-400 text-lg">No items are currently visible.</p>
                <p className="text-gray-300 text-sm">Check Firestore Rules or "available" toggle.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {foods.map((food) => (
                  <Foodcard key={food.id} food={food} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="mt-20 text-center text-gray-400 text-xs tracking-widest uppercase">
        <p>© {new Date().getFullYear()} Razrouz Cafe • Open until 11 PM</p>
      </footer>
    </div>
  );
}