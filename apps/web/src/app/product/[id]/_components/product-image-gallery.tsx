import Image from "next/image";
import { cn } from "@/components/ui";

type ProductImageGalleryProps = {
    productName: string;
    selectedImage: string;
    galleryImages: string[];
    onSelectImage: (image: string) => void;
};

export function ProductImageGallery({
    productName,
    selectedImage,
    galleryImages,
    onSelectImage,
}: ProductImageGalleryProps) {
    return (
        <div>
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="relative aspect-square">
                    <Image
                        src={selectedImage}
                        alt={productName}
                        fill
                        sizes="(max-width: 1024px) 100vw, 48vw"
                        className="object-cover"
                    />
                </div>
            </div>

            <div className="mt-3 grid grid-cols-5 gap-2">
                {galleryImages.map((imageSrc) => {
                    const isSelected = imageSrc === selectedImage;

                    return (
                        <button
                            key={imageSrc}
                            type="button"
                            onClick={() => onSelectImage(imageSrc)}
                            className={cn(
                                "relative overflow-hidden rounded-xl border transition",
                                isSelected
                                    ? "border-success ring-2 ring-success/25"
                                    : "border-gray-200 hover:border-success/50",
                            )}
                        >
                            <div className="relative aspect-square">
                                <Image
                                    src={imageSrc}
                                    alt={productName}
                                    fill
                                    sizes="120px"
                                    className="object-cover"
                                />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
