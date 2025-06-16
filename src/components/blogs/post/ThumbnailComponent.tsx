interface ThumbnailComponentProps {
  featured_image: string;
  altText: string;
  className?: string;
}

export default function ThumbnailComponent({
  featured_image,
  altText,
  className = "",
}: ThumbnailComponentProps) {
  return (
    <div className={`overflow-hidden rounded-lg ${className}`}>
      <img
        src={featured_image}
        alt={altText}
        className="w-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}
