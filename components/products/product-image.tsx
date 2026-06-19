import Image from "next/image";
import Link from "next/link";

export function ProductImages({
  images,
  thumbnail,
  title,
  productId,
}: {
  images: string[];
  thumbnail: string;
  title: string;
  productId: number;
}) {
  const mainImage = images[0] ?? thumbnail;
  console.log('images:', images);


  return (
    <div>
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative mb-3">
        <Link href={`/photo/${productId}`}>
        <Image
          src={mainImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          loading="eager"
        />
        </Link>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="w-20 h-20 bg-gray-100 rounded overflow-hidden relative shrink-0"
            >
              <Image
                src={image}
                alt={`${title} ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}