import "../styles/globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mediapipe facelandmarker demo using 3d avatar",
  description: "Animate 3d avatar face using mediapipe face-landmarker demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;800&display=swap" rel="stylesheet" />

      </head>
      <body
  className={`${inter.className} bg-cover bg-center bg-no-repeat min-h-screen`}
  style={{
    backgroundImage: "url('/bg.avif')", // Make sure this is placed inside /public
  }}
>
  {children}
</body>

    </html>
  );
}
