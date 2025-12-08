"use client";

interface AutoplayVideoProps {
    src: string;
}

export function AutoplayVideo({ src }: AutoplayVideoProps) {
    const handleClick = (e: React.MouseEvent<HTMLVideoElement>) => {
        const video = e.currentTarget;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    return (
        <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            onClick={handleClick}
            className="w-full h-auto cursor-pointer"
            style={{ aspectRatio: '16/9', objectFit: 'cover' }}
        >
            Tarayıcınız video oynatmayı desteklemiyor.
        </video>
    );
}
