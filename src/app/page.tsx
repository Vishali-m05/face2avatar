'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ReadyPlayerCreator from '../components/ReadyPlayerCreator';

const FaceLandmarkCanvas = dynamic(() => import('../components/FaceLandmarkCanvas'), {
  ssr: false,
});

type View = 'home' | 'creator' | 'camera';

export default function Home() {
  const [view, setView] = useState<View>('home');
  const [avatarURL, setAvatarURL] = useState<string | null>(null);

  if (view === 'creator') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
        <h2 className="text-2xl font-semibold mb-4">Customize Your Avatar</h2>
        <ReadyPlayerCreator
          width={640}
          height={480}
          handleComplete={(url) => {
            setAvatarURL(url);
            setView('home');
          }}
        />
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setView('home')}
        >
          Cancel
        </button>
      </div>
    );
  }

  if (view === 'camera') {
    if (!avatarURL) {
      setView('creator');
      return null;
    }
    return <FaceLandmarkCanvas avatarURL={avatarURL} />;
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-white p-8 bg-cover bg-center"
      style={{
        backgroundImage: `url('/bg.avif')`, // Or use a gradient if no image
      }}
    >
      <h1 className="text-6xl font-extrabold text-center mb-10 font-[Poppins] drop-shadow-lg">
        Face2Avatar
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-6xl">
        {/* Left Panel */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md shadow-2xl">
          <h2 className="text-2xl font-semibold mb-4">📸 How it works</h2>
          <ul className="list-disc list-inside text-lg space-y-3 text-white">
            <li><span className="font-bold text-yellow-300">Customize</span> your avatar</li>
            <li><span className="font-bold text-yellow-300">Start</span> your camera</li>
            <li><span className="font-bold text-yellow-300">Capture</span> your expressions</li>
          </ul>
        </div>

        {/* Right Buttons */}
        <div className="flex flex-col gap-6">
          <button
            onClick={() => setView('creator')}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-lg transition-all duration-300"
          >
            🎨 Customize Avatar
          </button>

          <button
            disabled={!avatarURL}
            onClick={() => setView('camera')}
            className={`py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg ${
              avatarURL
                ? 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            📷 Start Camera
          </button>

          <button
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-lg transition-all duration-300"
            onClick={() => alert('My Photos clicked')}
          >
            🖼️ My Photos
          </button>
        </div>
      </div>

      {avatarURL && (
        <div className="mt-12 text-center">
          <p className="text-lg">✅ Selected Avatar:</p>
          <img src={avatarURL + '.png'} alt="Avatar" className="mt-4 w-32 h-32 rounded-full mx-auto shadow-lg" />
        </div>
      )}
    </main>
  );
}
