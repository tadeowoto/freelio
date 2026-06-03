import React from "react";

type BrandKitModalHeaderProps = {
  onClose: () => void;
};

export default function BrandKitModalHeader({
  onClose,
}: BrandKitModalHeaderProps) {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-12 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-0 left-0 w-12 h-12 bg-vivid-green"></div>
        <div className="absolute top-0 left-20 w-16 h-4 bg-bubblegum-pink"></div>
        <div className="absolute top-0 right-24 w-12 h-4 bg-vivid-green opacity-90 grid grid-cols-4 gap-1 p-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/30 w-1 h-1 rounded-full"></div>
          ))}
        </div>
        <div className="absolute top-0 right-8 w-16 h-6 bg-sunny-yellow"></div>
        <div className="absolute top-6 right-0 w-8 h-8 bg-composer-blue"></div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute top-10 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-canvas-white border border-ash-gray text-graphite font-body font-medium text-lg cursor-pointer hover:bg-ash-gray/50 transition-colors z-10"
      >
        &times;
      </button>
    </>
  );
}
