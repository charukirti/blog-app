import { useTheme } from "@/context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sun as SunIcon,
  Moon as MoonIcon,
  Laptop as SystemIcon,
} from "lucide-react";
import { Button } from "../ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const items = [
    { key: "light", icon: <SunIcon className="h-4 w-4" />, label: "Light" },
    { key: "dark", icon: <MoonIcon className="h-4 w-4" />, label: "Dark" },
    {
      key: "system",
      icon: <SystemIcon className="h-4 w-4" />,
      label: "System",
    },
  ];

  const selected = items.find((item) => item.key === theme);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
       <Button variant="outline" size="lg">
  {selected?.icon}
  <span className="ml-2 font-poppins text-sm capitalize">
    {selected?.label}
  </span>
</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        {items.map(({ key, icon, label }) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(key as "light" | "dark" | "system")}
          >
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-poppins text-sm capitalize">{label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
