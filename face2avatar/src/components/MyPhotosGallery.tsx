'use client';

import { MediaStore } from '@/utils/mediaStore';
import { useState, useEffect } from 'react';

export default function MyPhotosGallery({ onBack }: { onBack: () => void }) {
  const [mediaItems, setMediaItems] = useState(MediaStore.getAll());

  useEffect(() => {
    setMediaItems(MediaStore.getAll());
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">📸 My Photos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mediaItems.map((item, index) => (
          <div key={index} className="bg-white/10 p-4 rounded-lg shadow-md">
            {item.type === 'image' ? (
              <img src={item.blobUrl} alt={item.name} className="w-full rounded" />
            ) : (
              <video src={item.blobUrl} controls className="w-full rounded" />
            )}
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm">{item.name}</p>
              <a
                href={item.blobUrl}
                download={item.name}
                className="text-blue-300 hover:text-blue-500 underline"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}
