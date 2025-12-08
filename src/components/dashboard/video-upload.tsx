"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Loader2, PlayCircle } from "lucide-react";
import { toast } from "sonner";

interface VideoUploadProps {
    currentVideoUrl?: string | null;
    onVideoChange?: (url: string | null) => void;
}

export function VideoUpload({ currentVideoUrl, onVideoChange }: VideoUploadProps) {
    const [videoUrl, setVideoUrl] = useState<string | null>(currentVideoUrl || null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check (500MB)
        const maxSize = 500 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("Video 500MB'dan büyük olamaz");
            return;
        }

        // Type check
        if (!file.type.startsWith("video/")) {
            toast.error("Sadece video dosyaları yüklenebilir");
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("video", file);

            const res = await fetch("/api/restaurant/upload-video", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setVideoUrl(data.videoUrl);
                onVideoChange?.(data.videoUrl);
                toast.success("Video başarıyla yüklendi!");
            } else {
                toast.error(data.error || "Video yüklenemedi");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Bir hata oluştu");
        } finally {
            setIsUploading(false);
            e.target.value = ""; // Reset input
        }
    };

    const handleDelete = async () => {
        if (!confirm("Videoyu silmek istediğinizden emin misiniz?")) return;

        setIsDeleting(true);

        try {
            const res = await fetch("/api/restaurant/upload-video", {
                method: "DELETE",
            });

            if (res.ok) {
                setVideoUrl(null);
                onVideoChange?.(null);
                toast.success("Video silindi");
            } else {
                toast.error("Video silinemedi");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Bir hata oluştu");
        } finally {
            setIsDeleting(false);
        }
    };

    if (videoUrl) {
        return (
            <div className="space-y-4">
                {/* Video Preview */}
                <div className="relative rounded-lg overflow-hidden bg-black border border-gray-200">
                    <video
                        src={videoUrl}
                        controls
                        className="w-full max-h-96 object-contain"
                        preload="metadata"
                    >
                        Tarayıcınız video oynatmayı desteklemiyor.
                    </video>
                </div>

                {/* Delete Button */}
                <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Siliniyor...
                        </>
                    ) : (
                        <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Videoyu Kaldır
                        </>
                    )}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition">
                <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="hidden"
                    id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                            <p className="text-sm text-gray-600">Yükleniyor...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <Upload className="w-12 h-12 text-gray-400" />
                            <div className="text-sm text-gray-600">
                                <span className="font-semibold text-blue-600">Tıklayın</span> veya sürükleyin
                            </div>
                            <p className="text-xs text-gray-500">MP4, WebM veya MOV</p>
                        </div>
                    )}
                </label>
            </div>

            {/* Professional Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">💡 Tanıtım Videosu İpuçları</h4>
                <div className="space-y-1 text-xs text-gray-700">
                    <p>✅ <strong>İdeal Format:</strong> MP4 (H.264 codec)</p>
                    <p>✅ <strong>Çözünürlük:</strong> 1920x1080 (Full HD)</p>
                    <p>✅ <strong>Süre:</strong> 30-60 saniye (kısa ve öz)</p>
                    <p>✅ <strong>FPS:</strong> 30fps yeterli</p>
                    <p>✅ <strong>Boyut:</strong> Mümkünse 100MB altında tutun</p>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-300">
                    <p className="text-xs text-gray-600">
                        <strong>⚠️ Dikkat:</strong> Çok büyük dosyalar yavaş yüklenir. Mobil kullanıcılar için optimize edin.
                    </p>
                </div>
            </div>
        </div>
    );
}
