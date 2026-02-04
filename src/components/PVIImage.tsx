interface PVIImageProps {
  pviId: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function PVIImage({ pviId, alt, className, width, height }: PVIImageProps) {
  return (
    <img
      data-pvi-id={pviId}
      alt={alt}
      className={className}
      width={width}
      height={height}
      src={`https://via.placeholder.com/${width ?? 800}x${height ?? 400}?text=${encodeURIComponent(alt)}`}
    />
  );
}
