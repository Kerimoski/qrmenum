"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const TEMPLATES = [
    { id: 'minimal' as const, name: 'Minimal', description: 'Sade ve modern', emoji: '⚪' },
    { id: 'modern' as const, name: 'Modern', description: 'Renkli ve dinamik', emoji: '🎨' },
    { id: 'elegant' as const, name: 'Elegant', description: 'Zarif ve profesyonel', emoji: '✨' },
    { id: 'colorful' as const, name: 'Colorful', description: 'Canlı ve eğlenceli', emoji: '🌈' },
    { id: 'classic' as const, name: 'Classic', description: 'Klasik ve güvenilir', emoji: '📋' },
    { id: 'neon' as const, name: 'Neon', description: 'Parlak ve çarpıcı', emoji: '⚡' },
    { id: 'rustic' as const, name: 'Rustic', description: 'Doğal ve samimi', emoji: '🌾' },
    { id: 'premium' as const, name: 'Premium', description: 'Lüks ve özel', emoji: '💎' },
    { id: 'vintage' as const, name: 'Vintage', description: 'Nostaljik ve retro', emoji: '📰' },
    { id: 'ocean' as const, name: 'Ocean', description: 'Deniz temalı', emoji: '🌊' },
    { id: 'forest' as const, name: 'Forest', description: 'Doğa temalı', emoji: '🌲' },
];

export type TemplateStyle = typeof TEMPLATES[number]['id'];

interface TemplateSelectorProps {
    selectedStyle: TemplateStyle;
    onSelectStyle: (style: TemplateStyle) => void;
}

export function TemplateSelector({ selectedStyle, onSelectStyle }: TemplateSelectorProps) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Şablon Seçimi</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {TEMPLATES.map((template) => (
                    <Card
                        key={template.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedStyle === template.id
                            ? 'ring-2 ring-blue-500 shadow-md'
                            : 'hover:border-gray-400'
                            }`}
                        onClick={() => onSelectStyle(template.id)}
                    >
                        <CardContent className="p-4 text-center relative">
                            {selectedStyle === template.id && (
                                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                                    <Check className="w-3 h-3" />
                                </div>
                            )}
                            <div className="text-4xl mb-2">{template.emoji}</div>
                            <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
                            <p className="text-xs text-gray-600">{template.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
