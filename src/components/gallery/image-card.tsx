'use client';

import type { GalleryImage } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Share2, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';


interface ImageCardProps {
  image: GalleryImage;
}

export function ImageCard({ image }: ImageCardProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AI Generated Image: ${image.prompt}`,
          text: `Check out this image I generated with TellMeIf AI for the prompt: "${image.prompt}"`,
          url: image.imageUrl, // Note: This URL might be a data URI or temporary. For true sharing, it needs to be a persistent URL.
        });
        toast({ title: "Shared!", description: "Image shared successfully." });
      } catch (error) {
        console.error("Error sharing:", error);
        toast({ title: "Share Failed", description: "Could not share the image.", variant: "destructive" });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(image.imageUrl);
      toast({ title: "Link Copied!", description: "Image URL copied to clipboard." });
    }
  };
  
  const handleDownload = () => {
    // This works well for external URLs. For data URIs, it should also work.
    const link = document.createElement('a');
    link.href = image.imageUrl;
    // Sanitize prompt for filename
    const filename = image.prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'ai_image';
    link.download = `${filename}.png`; // Assuming PNG, might need to be dynamic if format varies
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Downloading...", description: "Your image will be downloaded." });
  };


  return (
    <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-card/80 flex flex-col h-full sparkle-effect">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-heading truncate" title={image.prompt}>Prompt: {image.prompt}</CardTitle>
        <CardDescription className="text-xs">
          Generated: {format(new Date(image.timestamp), "MMM d, yyyy 'at' h:mm a")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex items-center justify-center bg-black/10">
        <div className="aspect-square w-full relative">
          <Image 
            src={image.imageUrl} 
            alt={image.prompt} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            data-ai-hint="fantasy art"
          />
        </div>
      </CardContent>
      <CardFooter className="p-3 flex justify-end gap-2 bg-card/50">
        <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share image">
          <Share2 className="h-5 w-5 text-primary hover:text-accent" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download image">
          <Download className="h-5 w-5 text-primary hover:text-accent" />
        </Button>
      </CardFooter>
    </Card>
  );
}

    