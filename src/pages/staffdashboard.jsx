import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Ensure your firebase.js exports db
import { 
  collection, 
  onSnapshot, 
  updateDoc, 
  doc, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import Navbar from '../components/navbar';

export default function StaffDashboard() {
  const [menuItems, setMenuItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', image: '' });
  const [editImageFile, setEditImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // State for the "Add New Product" form
  const [newItem, setNewItem] = useState({ name: '', price: '', image: '', category: 'Drinks' });
  const [newImageFile, setNewImageFile] = useState(null);

  const uploadImageToImgBB = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error('Missing VITE_IMGBB_API_KEY in your environment');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success || !data.data?.url) {
      throw new Error(data.error?.message || 'ImgBB upload failed');
    }

    return data.data.url;
  };

  // 1. Fetch items in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'menu'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(items);
    });
    return () => unsubscribe();
  }, []);

  // 2. Handle adding a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setUploading(true);
    setUploadError('');

    try {
      const image = newImageFile ? await uploadImageToImgBB(newImageFile) : newItem.image;

      await addDoc(collection(db, 'menu'), {
        ...newItem,
        image,
        price: Number(newItem.price),
        available: true,
        createdAt: serverTimestamp()
      });
      setNewItem({ name: '', price: '', image: '', category: 'Drinks' });
      setNewImageFile(null);
      form.reset();
    } catch (err) {
      console.error("Error adding product:", err);
      setUploadError(err.message || 'Could not add product');
    } finally {
      setUploading(false);
    }
  };

  // 3. Toggle Availability
  const toggleAvailability = async (id, currentStatus) => {
    const itemRef = doc(db, 'menu', id);
    await updateDoc(itemRef, { available: !currentStatus });
  };

  // 4. Start Editing
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ name: item.name, price: item.price, image: item.image || '' });
    setEditImageFile(null);
    setUploadError('');
  };

  // 5. Save Changes
  const saveEdit = async (id) => {
    const itemRef = doc(db, 'menu', id);
    setUploading(true);
    setUploadError('');

    try {
      const image = editImageFile ? await uploadImageToImgBB(editImageFile) : editForm.image;

      await updateDoc(itemRef, {
        name: editForm.name,
        price: Number(editForm.price),
        image
      });
      setEditingId(null);
      setEditImageFile(null);
    } catch (err) {
      console.error("Error updating product:", err);
      setUploadError(err.message || 'Could not update product');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 pt-12">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Staff Control Panel</h1>

        {/* --- ADD NEW PRODUCT FORM --- */}
        <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              type="text" placeholder="Product Name" required
              className="bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
              value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
            <input 
              type="number" step="0.1" placeholder="Price (dt)" required
              className="bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
              value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})}
            />
            <input 
              type="file" accept="image/*"
              className="bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}
            />
            <button disabled={uploading} className="bg-black text-white rounded-2xl font-bold hover:bg-orange-500 transition disabled:cursor-not-allowed disabled:bg-gray-400">
              {uploading ? 'Uploading...' : 'Add Item'}
            </button>
          </form>
          {uploadError && <p className="mt-4 text-sm font-bold text-red-600">{uploadError}</p>}
        </section>

        {/* --- INVENTORY LIST --- */}
        <div className="grid grid-cols-1 gap-4">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Left: Product Info or Edit Form */}
              <div className="flex items-center gap-6 w-full">
                <img src={item.image || "https://placehold.co/100"} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                
                {editingId === item.id ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                    <input 
                      className="bg-gray-50 p-2 rounded-lg border text-sm"
                      value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                    <input 
                      type="number" className="bg-gray-50 p-2 rounded-lg border text-sm"
                      value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    />
                    <input 
                      type="file" accept="image/*" className="bg-gray-50 p-2 rounded-lg border text-sm"
                      onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-black text-gray-800 capitalize">{item.name}</h3>
                    <p className="text-orange-600 font-bold">{item.price} dt</p>
                  </div>
                )}
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {editingId === item.id ? (
                  <>
                    <button onClick={() => saveEdit(item.id)} disabled={uploading} className="bg-green-500 text-white px-6 py-2 rounded-xl font-bold text-sm disabled:cursor-not-allowed disabled:bg-gray-400">
                      {uploading ? 'Uploading...' : 'Save'}
                    </button>
                    <button onClick={() => { setEditingId(null); setEditImageFile(null); }} className="text-gray-400 font-bold text-sm">Cancel</button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => toggleAvailability(item.id, item.available)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs transition ${item.available ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
                    >
                      {item.available ? 'In Stock' : 'Out of Stock'}
                    </button>
                    <button 
                      onClick={() => startEdit(item)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold text-xs hover:bg-black hover:text-white transition"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
