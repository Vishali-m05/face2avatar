export type MediaItem = {
  type: 'image' | 'video';
  blobUrl: string;
  name: string;
};

let mediaList: MediaItem[] = [];

export const MediaStore = {
  add(item: MediaItem) {
    mediaList.unshift(item); // latest first
  },
  getAll(): MediaItem[] {
    return mediaList;
  },
  clear() {
    mediaList = [];
  }
};
