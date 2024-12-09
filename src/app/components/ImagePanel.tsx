"use client";

import Image from "next/image";

type ImagePanelProps = {
  imageUrl: string | null;
  isLoading: boolean;
};

export default function ImagePanel({ imageUrl }: ImagePanelProps) {
  return (
    <div
      style={{ flex: 1, position: "relative", width: "100%", height: "100%" }}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Generated Scene"
          fill
          style={{ objectFit: "cover" }}
          sizes="100vw"
        />
      ) : null}
    </div>
  );
}
