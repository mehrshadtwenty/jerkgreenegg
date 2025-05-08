'use client';

import { useState, useEffect } from 'react';
import type { GalleryImage } from '@/lib/types';
import { ImageCard } from '@/components/gallery/image-card';
import { Button } from '@/components/ui/button';
import { Trash2, GalleryHorizontalEnd } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LOCAL_STORAGE_GALLERY_KEY = 'tellMeIfAiGallery';

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    try {
      const storedImages = localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY);
      if (storedImages) {
        setGalleryImages(JSON.parse(storedImages));
      }
    } catch (error) {
      console.error("Failed to load gallery from localStorage:", error);
       toast({
        title: "Storage Error",
        description: "Could not load images from local gallery.",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  const clearGallery = () => {
    if (window.confirm("Are you sure you want to clear the entire gallery? This cannot be undone.")) {
      localStorage.removeItem(LOCAL_STORAGE_GALLERY_KEY);
      setGalleryImages([]);
      toast({ title: "Gallery Cleared", description: "All images have been removed from your local gallery."});
    }
  };

  if (!isClient) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
        <p className="text-xl font-heading text-muted-foreground">Loading Visions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-4xl font-bold font-heading text-center sm:text-left text-primary drop-shadow-md flex items-center gap-3">
          <GalleryHorizontalEnd className="h-10 w-10 text-secondary" />
          Visions of the Lamp
        </h2>
        {galleryImages.length > 0 && (
           <Button variant="destructive" onClick={clearGallery} className="font-heading">
            <Trash2 className="mr-2 h-5 w-5" /> Clear Gallery
          </Button>
        )}
      </div>
      
      {galleryImages.length === 0 ? (
        <div className="text-center py-10 bg-card/50 rounded-lg shadow-xl border border-border">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 lucide lucide-gallery-minimal">
            <path d="M3 3v18h18"/><path d="M10 10a4 4 0 1 0 8 0 4 4 0 1 0-8 0Z"/><path d="m21 21-6.5-6.5"/>
          </svg>
          <p className="text-2xl font-semibold font-heading text-muted-foreground">The Lamp's Visions are Yet Unseen</p>
          <p className="text-muted-foreground">Venture to the Chat page, ask the Lamp to "Imagine It", and discover wonders here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryImages.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
        </div>
      )}
    </div>
  );
}
