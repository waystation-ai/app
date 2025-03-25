"use client";

import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from "react";
import { ProviderIcon } from "@/components/app/ProviderIcon";

interface Provider {
  id: string;
  name: string;
  description: string;
}

interface ProvidersCarouselProps {
  providers: Provider[];
}

export function ProvidersCarousel({ providers }: ProvidersCarouselProps) {
  // Create a ref for the autoplay plugin
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );
  
  return (
    <div className="w-full my-6 relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
          containScroll: "trimSnaps"
        }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {providers.map((provider) => (
            <CarouselItem key={provider.id} className="sm:basis-1/3 md:basis-1/5 lg:basis-1/8 pl-4">
              <Link 
                href={`/connect/${provider.id}`} 
                className="flex flex-col p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-full"
              >
                <div className="flex items-center mb-2">
                  <ProviderIcon provider={provider.id} width={30} height={30} />
                  <p className="ml-2 text-md font-medium text-gray-800">{provider.name}</p>
                </div>
                <p className="text-xs text-gray-600">{provider.description}</p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-end gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 h-8 w-8" />
          <CarouselNext className="static translate-y-0 h-8 w-8" />
        </div>
      </Carousel>
    </div>
  );
}
