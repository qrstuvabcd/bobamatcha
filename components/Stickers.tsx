import React from "react";

interface StickerProps {
    size?: number;
    className?: string;
    style?: React.CSSProperties;
}

export function StickerBobaCup({ size = 64, className = "", style }: StickerProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className={`inline-block drop-shadow-xl ${className}`} style={style}>
            <rect x="44" y="4" width="5" height="28" rx="2.5" fill="#7cb342" transform="rotate(6 46 18)" />
            <circle cx="46" cy="5" r="4" fill="#7cb342" opacity="0.6" />
            <path d="M18 22 C18 19 22 17 40 17 C58 17 62 19 62 22 C62 25 58 27 40 27 C22 27 18 25 18 22Z" fill="#3d2b1f" stroke="#7cb342" strokeWidth="2" strokeLinejoin="round" />
            <path d="M20 27 C20 27 21 60 23 65 C25 68 35 70 40 70 C45 70 55 68 57 65 C59 60 60 27 60 27" fill="#2a1f1a" stroke="#7cb342" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M22 35 C26 32 32 38 40 35 C48 32 54 38 58 35 L57 60 C56 64 48 67 40 67 C32 67 24 64 23 60 Z" fill="#7cb342" opacity="0.25" />
            <circle cx="30" cy="58" r="4" fill="#6b4226" stroke="#4a2c17" strokeWidth="1" />
            <circle cx="40" cy="62" r="4" fill="#6b4226" stroke="#4a2c17" strokeWidth="1" />
            <circle cx="50" cy="58" r="3.5" fill="#6b4226" stroke="#4a2c17" strokeWidth="1" />
            <circle cx="35" cy="55" r="3" fill="#6b4226" stroke="#4a2c17" strokeWidth="1" />
            <circle cx="46" cy="55" r="3" fill="#6b4226" stroke="#4a2c17" strokeWidth="1" />
            <circle cx="33" cy="42" r="2.5" fill="white" />
            <circle cx="47" cy="42" r="2.5" fill="white" />
            <circle cx="34" cy="42" r="1" fill="#2a1f1a" />
            <circle cx="48" cy="42" r="1" fill="#2a1f1a" />
            <ellipse cx="28" cy="46" rx="4" ry="2.5" fill="#7cb342" opacity="0.3" />
            <ellipse cx="52" cy="46" rx="4" ry="2.5" fill="#7cb342" opacity="0.3" />
            <path d="M36 47 C38 50 42 50 44 47" fill="none" stroke="#5C4033" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M40 10 C40 8 38 6.5 36.5 6.5 C35 6.5 33 8 33 10 C33 13 40 16 40 16 C40 16 47 13 47 10 C47 8 45 6.5 43.5 6.5 C42 6.5 40 8 40 10Z" fill="#7cb342" stroke="#7cb342" strokeWidth="0.8" opacity="0.6" />
        </svg>
    );
}

export function StickerMatchaLeaf({ size = 48, className = "", style }: StickerProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className={`inline-block drop-shadow-xl ${className}`} style={style}>
            <path
                d="M24 6 C12 14 6 24 10 36 C14 44 20 44 24 40 C28 44 34 44 38 36 C42 24 36 14 24 6Z"
                fill="#7cb342"
                stroke="#558b2f"
                strokeWidth="2"
                strokeLinejoin="round"
                opacity="0.8"
            />
            <path d="M24 10 L24 36" stroke="#558b2f" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
            <path d="M24 20 L16 26" stroke="#558b2f" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
            <path d="M24 26 L32 22" stroke="#558b2f" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
        </svg>
    );
}

export function StickerBobaPearls({ size = 48, className = "", style }: StickerProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className={`inline-block drop-shadow-xl ${className}`} style={style}>
            <circle cx="16" cy="24" r="8" fill="#6b4226" stroke="#4a2c17" strokeWidth="1.5" />
            <circle cx="32" cy="20" r="7" fill="#6b4226" stroke="#4a2c17" strokeWidth="1.5" />
            <circle cx="26" cy="34" r="6" fill="#6b4226" stroke="#4a2c17" strokeWidth="1.5" />
            <circle cx="14" cy="22" r="2" fill="rgba(255,255,255,0.2)" />
            <circle cx="30" cy="18" r="1.8" fill="rgba(255,255,255,0.2)" />
            <circle cx="24" cy="32" r="1.5" fill="rgba(255,255,255,0.2)" />
        </svg>
    );
}

export function StickerHeart({ size = 36, className = "", style }: StickerProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" className={`inline-block drop-shadow-xl ${className}`} style={style}>
            <path
                d="M18 9 C18 6 15 3 12 3 C9 3 6 6 6 9 C6 15 18 24 18 24 C18 24 30 15 30 9 C30 6 27 3 24 3 C21 3 18 6 18 9Z"
                fill="#7cb342"
                stroke="#558b2f"
                strokeWidth="1.5"
                strokeLinejoin="round"
                opacity="0.7"
            />
        </svg>
    );
}
