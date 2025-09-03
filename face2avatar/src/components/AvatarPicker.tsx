import React from 'react';

type Props = {
  onSelect: (url: string) => void;
};

const sampleAvatars = [
  '/avatars/avatar1.glb',
  '/avatars/avatar2.glb',
  '/avatars/avatar3.glb',
];

export default function AvatarPicker({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-4">
      {sampleAvatars.map((url) => (
        <div key={url} className="cursor-pointer p-2 border rounded" onClick={() => onSelect(url)}>
          <img src={url + '.png'} alt="Avatar thumbnail" className="w-24 h-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}
