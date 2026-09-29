'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Category {
  category_id: number;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">← Volver</Link>
          <h1 className="text-xl font-bold text-gray-800 mt-2">Categorías</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.category_id}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <h4 className="font-semibold text-gray-800">{category.name}</h4>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
