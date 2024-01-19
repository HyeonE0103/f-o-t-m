import "@/styles/globals.css";
import { Metadata } from "next";
import { NextLayout, NextProvider } from "./providers";

export const metadata: Metadata = {
  title: "Next Map",
  description: "Next.js 13을 이용한 맛집 앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextProvider>
          <NextLayout>{children}</NextLayout>
        </NextProvider>
      </body>
    </html>
  );
}
