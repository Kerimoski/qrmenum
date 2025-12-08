
"use client";

import { useLanguage } from "./language-context";
import { Globe, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-full w-full flex items-center justify-center gap-2 hover:bg-gray-50 rounded-none">
                    <Globe className="w-5 h-5 text-gray-700" />
                    <span className="font-medium text-gray-700 uppercase">{language}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => setLanguage("tr")} className="cursor-pointer">
                    <span className="flex-1">Türkçe</span>
                    {language === "tr" && <Check className="w-4 h-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("en")} className="cursor-pointer">
                    <span className="flex-1">English</span>
                    {language === "en" && <Check className="w-4 h-4 ml-2" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
