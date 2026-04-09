import Image from "next/image";
import { StarIcon } from "lucide-react";

export type HomeTestimonial = {
    name: string;
    role: string;
    company: string;
    quote: string;
    rating: number;
    avatarUrl: string;
};

type HomeTestimonialCardProps = {
    testimonial: HomeTestimonial;
};

export function HomeTestimonialCard({ testimonial }: HomeTestimonialCardProps) {
    return (
        <article className="h-full rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
                <div className="relative size-12 overflow-hidden rounded-full bg-gray-100">
                    <Image
                        src={testimonial.avatarUrl}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                    />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-xs text-gray-600">
                        {testimonial.role}, {testimonial.company}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                    <StarIcon
                        key={`${testimonial.name}-${index}`}
                        className={
                            index < testimonial.rating
                                ? "size-4 fill-amber-400 text-amber-400"
                                : "size-4 text-gray-300"
                        }
                    />
                ))}
            </div>

            <blockquote className="mt-4 text-sm leading-relaxed text-gray-700 italic">
                “{testimonial.quote}”
            </blockquote>
        </article>
    );
}
