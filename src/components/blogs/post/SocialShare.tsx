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
import { toast } from "react-toastify";

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
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Share2 className="h-5 w-5" />
      </PopoverTrigger>

      <PopoverContent className="flex items-center">
        <Button variant="ghost" className="justify-start" onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
        </Button>

        <Button variant="ghost" className="justify-start" asChild>
          <a
            href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
          </a>
        </Button>

        <Button variant="ghost" className="justify-start" asChild>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter />
          </a>
        </Button>
        <Button variant="ghost" className="justify-start" asChild>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
          </a>
        </Button>
        <Button variant="ghost" className="justify-start" asChild>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn />
          </a>
        </Button>

        <Button variant="ghost" className="justify-start" asChild>
          <a
            href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaRedditAlien />
          </a>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
