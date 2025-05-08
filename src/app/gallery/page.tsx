'use client';

import { useState, useEffect } from 'react';
import type { GalleryImage } from '@/lib/types';
import { ImageCard } from '@/components/gallery/image-card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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
    // Render a loading state or null on the server
    return (
       <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
        <p className="text-xl font-heading text-muted-foreground">Loading Magical Gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-4xl font-bold font-heading text-center sm:text-left text-primary drop-shadow-md">
          Image Gallery of Wonders
        </h2>
        {galleryImages.length > 0 && (
           <Button variant="destructive" onClick={clearGallery} className="font-heading">
            <Trash2 className="mr-2 h-5 w-5" /> Clear Gallery
          </Button>
        )}
      </div>
      
      {galleryImages.length === 0 ? (
        <div className="text-center py-10 bg-card/50 rounded-lg shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 lucide lucide-gallery-thumbnails">
            <rect width="18" height="14" x="3" y="3" rx="2"/><path d="M4 21h1"/><path d="M9 21h1"/><path d="M14 21h1"/><path d="M19 21h1"/>
          </svg>
          <p className="text-2xl font-semibold font-heading text-muted-foreground">Your gallery is empty.</p>
          <p className="text-muted-foreground">Go to the Chat page and generate some images to see them here!</p>
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

    