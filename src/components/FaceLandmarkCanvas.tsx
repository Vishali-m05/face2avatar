'use client';

import { useEffect, useRef, useState } from 'react';
import DrawLandmarkCanvas from './DrawLandmarkCanvas';
import AvatarCanvas from './AvatarCanvas';
import FaceLandmarkManager from '@/class/FaceLandmarkManager';

type Props = {
  avatarURL: string;
};

const FaceLandmarkCanvas = ({ avatarURL }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastVideoTimeRef = useRef(-1);
  const requestRef = useRef(0);
  const [avatarView, setAvatarView] = useState(true);
  const [videoSize, setVideoSize] = useState<{ width: number; height: number }>();
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const toggleAvatarView = () => setAvatarView((prev) => !prev);

  const animate = () => {
    if (
      videoRef.current &&
      videoRef.current.currentTime !== lastVideoTimeRef.current
    ) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      try {
        const faceLandmarkManager = FaceLandmarkManager.getInstance();
        faceLandmarkManager.detectLandmarks(videoRef.current, Date.now());
      } catch (e) {
        console.error(e);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const getUserCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setTimeout(() => {
          if (!videoRef.current) return;
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setVideoSize({
              width: videoRef.current!.offsetWidth,
              height: videoRef.current!.offsetHeight,
            });
            videoRef.current!.play();
            requestRef.current = requestAnimationFrame(animate);
          };
        }, 200);
      } catch (e) {
        console.error(e);
        alert('Failed to load webcam!');
      }
    };

    getUserCamera();
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const handleCapture = () => {
  const canvas = document.querySelector('[data-avatar-container] canvas') as HTMLCanvasElement;
  if (!canvas) return alert('Canvas not found.');

  const image = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.href = image;
  link.download = 'avatar_snapshot.png';
  link.click();
};


  const startRecording = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return alert('Canvas not found');

    const stream = canvas.captureStream(30); // 30 FPS
    const recorder = new MediaRecorder(stream);

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'avatar_recording.webm';
      a.click();
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-center gap-4 flex-wrap mb-6">
        <button
          className="bg-purple-700 hover:bg-purple-600 transition text-white px-4 py-2 rounded shadow"
          onClick={toggleAvatarView}
        >
          {avatarView ? 'Switch to Landmark View' : 'Switch to Avatar View'}
        </button>

        <button
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded shadow"
          onClick={handleCapture}
        >
          📸 Take Snapshot
        </button>

        <button
          onClick={startRecording}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow"
          disabled={recording}
        >
          🎥 Start Recording
        </button>

        <button
          onClick={stopRecording}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded shadow"
          disabled={!recording}
        >
          🛑 Stop Recording
        </button>
      </div>

      <div className="flex justify-center">
        <video
          className="w-full h-auto"
          ref={videoRef}
          loop
          muted
          autoPlay
          playsInline
        ></video>

        {videoSize && (
          <>
            {avatarView ? (
              <AvatarCanvas
                width={videoSize.width}
                height={videoSize.height}
                url={avatarURL}
              />
            ) : (
              <DrawLandmarkCanvas
                width={videoSize.width}
                height={videoSize.height}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FaceLandmarkCanvas;
