import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FaFacebookF,
  FaXTwitter,
  FaWhatsapp,
  FaLinkedinIn,
  FaRedditAlien,
} from "react-icons/fa6";

interface SocialShareProps {
  title: string;
}

export default function SocialShare({ title }: SocialShareProps) {
  const location = useLocation();
  const [url, setUrl] = useState("");

  useEffect(() => {
    const fullUrl = window.location.origin + location.pathname;
    setUrl(fullUrl);
  }, [location]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Share2 className="h-5 w-5" />
      </PopoverTrigger>

      <PopoverContent className="flex w-72 items-center gap-2">
        <button className="w-full justify-start" onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
        </button>
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" className="w-full justify-start">
            <FaWhatsapp />
          </Button>
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" className="w-full justify-start">
            <FaXTwitter />
          </Button>
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" className="w-full justify-start">
            <FaFacebookF />
          </Button>
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" className="w-full justify-start">
            <FaLinkedinIn />
          </Button>
        </a>

        <a
          href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" className="w-full justify-start">
            <FaRedditAlien />
          </Button>
        </a>
      </PopoverContent>
    </Popover>
  );
}
