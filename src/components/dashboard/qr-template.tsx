/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

import { WifiIcon, CameraIcon, FireIcon, SparklesIcon, BoltIcon, PaintBrushIcon } from "@heroicons/react/24/solid";

interface QRTemplateProps {
    style: 'minimal' | 'modern' | 'elegant' | 'colorful' | 'classic' | 'neon' | 'rustic' | 'premium' | 'vintage' | 'ocean' | 'forest';
    restaurantName: string;
    qrCode: string;
    tableNumber?: number;
    wifiPassword?: string;
    instagram?: string;
    logo?: string;
    primaryColor?: string;
}

export function QRTemplate({
    style,
    restaurantName,
    qrCode,
    tableNumber,
    wifiPassword,
    instagram,
    logo,
    primaryColor = "#3B82F6"
}: QRTemplateProps) {

    const templates = {
        minimal: (
            <div className="w-[105mm] h-[148mm] bg-white p-4 flex flex-col justify-between">
                <div className="flex flex-col items-center">
                    {logo && <img src={logo} alt="Logo" className="h-8 w-auto object-contain mb-2" />}
                    <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">{restaurantName}</h1>
                    <div className="w-12 h-0.5 bg-gray-900"></div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="bg-white p-3 border-2 border-gray-900 mb-3">
                        <img src={qrCode} alt="QR Code" className="w-32 h-32" />
                    </div>
                    <p className="text-sm text-gray-700 mb-2">Menüyü İnceleyin</p>
                    {tableNumber && (
                        <div className="text-3xl font-bold text-gray-900">MASA {tableNumber}</div>
                    )}
                </div>

                <div className="text-center space-y-1">
                    {wifiPassword && (
                        <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
                            <WifiIcon className="w-3 h-3" />
                            <span>WiFi: <span className="font-mono font-semibold">{wifiPassword}</span></span>
                        </p>
                    )}
                    {instagram && <p className="text-xs text-gray-600">IG: @{instagram}</p>}
                </div>
            </div>
        ),

        modern: (
            <div
                className="w-[105mm] h-[148mm] p-4 flex flex-col justify-between"
                style={{ background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}40 100%)` }}
            >
                {logo && <img src={logo} alt="Logo" className="h-8 w-auto object-contain mx-auto" />}

                <div className="bg-white rounded-2xl p-4 shadow-xl">
                    <div className="h-1 rounded-t-2xl mb-2" style={{ backgroundColor: primaryColor }}></div>
                    <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: primaryColor }}>{restaurantName}</h1>

                    <div className="flex justify-center mb-3">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                            <img src={qrCode} alt="QR Code" className="w-28 h-28" />
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-1 text-gray-800 mb-2">
                        <FireIcon className="w-4 h-4 text-orange-500" />
                        <p className="text-base font-semibold">Dijital Menü</p>
                    </div>

                    {tableNumber && (
                        <div className="text-2xl font-bold text-center py-1.5 rounded-lg text-white" style={{ backgroundColor: primaryColor }}>
                            MASA #{tableNumber}
                        </div>
                    )}
                </div>

                <div className="text-center space-y-1">
                    {wifiPassword && (
                        <p className="text-xs text-gray-700 flex items-center justify-center gap-1">
                            <WifiIcon className="w-3 h-3" />
                            <span>WiFi: <span className="font-bold">{wifiPassword}</span></span>
                        </p>
                    )}
                    {instagram && <p className="text-xs text-gray-700">IG: @{instagram}</p>}
                </div>
            </div>
        ),

        elegant: (
            <div className="w-[105mm] h-[148mm] bg-gradient-to-b from-amber-50 to-white p-4 flex flex-col justify-between border-4 border-amber-600">
                <div className="flex flex-col items-center">
                    {logo && <img src={logo} alt="Logo" className="h-10 w-auto object-contain mb-2" />}
                    <div className="text-amber-700 text-xs tracking-wide mb-1 flex items-center gap-1">
                        <SparklesIcon className="w-3 h-3" /> DINING <SparklesIcon className="w-3 h-3" />
                    </div>
                    <h1 className="text-2xl font-serif text-amber-900 mb-1">{restaurantName}</h1>
                    <div className="flex items-center gap-1">
                        <div className="w-6 h-px bg-amber-600"></div>
                        <span className="text-amber-700 text-xs">EST. 2024</span>
                        <div className="w-6 h-px bg-amber-600"></div>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="bg-white p-3 border-2 border-amber-600 shadow-lg mb-2">
                        <img src={qrCode} alt="QR Code" className="w-28 h-28" />
                    </div>
                    <p className="text-sm font-serif text-amber-900 mb-2">Premium Menu</p>
                    {tableNumber && (
                        <div className="bg-amber-600 text-white px-4 py-2 text-xl font-serif">Table {tableNumber}</div>
                    )}
                </div>

                <div className="text-center space-y-0.5">
                    {wifiPassword && (
                        <p className="text-xs text-amber-800 flex items-center justify-center gap-1">
                            <WifiIcon className="w-3 h-3" />
                            <span>WiFi: {wifiPassword}</span>
                        </p>
                    )}
                    {instagram && <p className="text-xs text-amber-800">✦ @{instagram} ✦</p>}
                </div>
            </div>
        ),

        colorful: (
            <div className="w-[105mm] h-[148mm] bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-4 flex flex-col justify-between">
                <div className="h-6 -mx-4 -mt-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>

                <div className="bg-white rounded-2xl p-4 shadow-xl flex-1 flex flex-col justify-center items-center mx-2">
                    {logo && (
                        <div className="bg-white rounded-full p-1.5 mb-2">
                            <img src={logo} alt="Logo" className="h-6 w-auto object-contain" />
                        </div>
                    )}

                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2 text-center">
                        {restaurantName}
                    </h1>

                    <div className="bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 p-2 rounded-2xl mb-2">
                        <img src={qrCode} alt="QR Code" className="w-24 h-24" />
                    </div>

                    <div className="flex items-center gap-1 text-gray-800 mb-2">
                        <PaintBrushIcon className="w-5 h-5 text-purple-500" />
                        <p className="text-lg font-bold">Scan Me!</p>
                    </div>

                    {tableNumber && (
                        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-black text-center py-2 rounded-xl px-4">
                            MASA {tableNumber}
                        </div>
                    )}
                </div>

                <div className="text-center space-y-1 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1.5 mx-2">
                    {wifiPassword && (
                        <p className="text-xs font-bold text-purple-700 flex items-center justify-center gap-1">
                            <WifiIcon className="w-3 h-3" />
                            <span>WiFi: {wifiPassword}</span>
                        </p>
                    )}
                    {instagram && <p className="text-xs font-bold text-pink-700">IG: @{instagram}</p>}
                </div>
            </div>
        ),

        classic: (
            <div className="w-[105mm] h-[148mm] bg-gray-50 p-4 flex flex-col justify-between border-2 border-gray-800">
                <div className="flex flex-col items-center">
                    {logo && <img src={logo} alt="Logo" className="h-8 w-auto object-contain mb-2" />}
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{restaurantName}</h1>
                    <div className="w-16 h-0.5 bg-gray-800"></div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="bg-white p-3 border border-gray-800 shadow-md mb-2">
                        <img src={qrCode} alt="QR Code" className="w-32 h-32" />
                    </div>
                    <div className="bg-gray-800 text-white px-3 py-1.5 text-xs font-semibold mb-2">TARAYIN</div>
                    {tableNumber && (
                        <div className="border-2 border-gray-800 px-4 py-2 bg-white">
                            <p className="text-xs text-gray-600">MASA</p>
                            <p className="text-3xl font-bold text-gray-900">{tableNumber}</p>
                        </div>
                    )}
                </div>

                <div className="text-center space-y-0.5">
                    {wifiPassword && (
                        <p className="text-xs text-gray-700 flex items-center justify-center gap-1">
                            <WifiIcon className="w-3 h-3" />
                            <span>WiFi: <strong>{wifiPassword}</strong></span>
                        </p>
                    )}
                    {instagram && <p className="text-xs text-gray-700">IG: <strong>@{instagram}</strong></p>}
                </div>
            </div>
        ),

        neon: (
            <div className="w-[105mm] h-[148mm] bg-gray-900 p-4 flex flex-col justify-between overflow-hidden">
                <div className="flex flex-col items-center">
                    {logo && <img src={logo} alt="Logo" className="h-8 w-auto object-contain mb-2" />}
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-1 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)] text-center">
                        {restaurantName}
                    </h1>
                    <div className="flex items-center gap-1">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 shadow-[0_0_5px_#00ffff]"></div>
                        <div className="w-8 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 shadow-[0_0_5px_#ff00ff]"></div>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.5)] mb-2">
                        <img src={qrCode} alt="QR Code" className="w-28 h-28" />
                    </div>
                    <div className="flex items-center gap-1 mb-2 drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">
                        <BoltIcon className="w-4 h-4 text-cyan-300" />
                        <p className="text-base font-bold text-cyan-300">MENU</p>
                        <BoltIcon className="w-4 h-4 text-cyan-300" />
                    </div>
                    {tableNumber && (
                        <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-2xl font-black px-4 py-1.5 rounded-xl shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                            TABLE {tableNumber}
                        </div>
                    )}
                </div>

                <div className="text-center space-y-1">
                    {wifiPassword && (
                        <p className="text-xs text-cyan-300 flex items-center justify-center gap-1">
                            <WifiIcon className="w-3 h-3" />
                            <span>WiFi: <span className="font-mono">{wifiPassword}</span></span>
                        </p>
                    )}
                    {instagram && <p className="text-xs text-pink-300">IG: @{instagram}</p>}
                </div>
            </div>
        ),

        rustic: (
            <div
                className="w-[105mm] h-[148mm] bg-amber-50 p-4 flex flex-col justify-between border-4 border-amber-800 border-double"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\"20\\" height=\\"20\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cpath d=\\"M0 0h20v20H0z\\" fill=\\"%23f5f5dc\\"/%3E%3Cpath d=\\"M10 0v20M0 10h20\\" stroke=\\"%23d2691e\\" stroke-width=\\"0.5\\" opacity=\\"0.1\\"/%3E%3C/svg%3E")',
                }}
            >
                <div className="flex flex-col items-center">
                    {logo && <img src={logo} alt="Logo" className="h-10 w-auto object-contain sepia mb-2" />}
                    <div className="text-amber-900 text-sm mb-1 flex items-center gap-1">
                        <SparklesIcon className="w-3 h-3" />
                    </div>
                    <h1 className="text-2xl font-serif text-amber-900 mb-1 text-center">{restaurantName}</h1>
                    <p className="text-amber-700 italic text-xs">Homemade</p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="bg-white p-2 border-2 border-amber-900 shadow-xl mb-2">
                        <img src={qrCode} alt="QR Code" className="w-28 h-28" />
                    </div>
                    <p className="text-sm font-serif text-amber-900 mb-2">~ Menu ~</p>
                    {tableNumber && (
                        <div className="bg-amber-900 text-amber-50 px-4 py-2 text-2xl font-serif border-2 border-amber-950">
                            Table {tableNumber}
                        </div>
                    )}
                </div>

                <div className="text-center space-y-0.5">
                    {wifiPassword && (
                        <p className="text-xs text-amber-800 font-serif flex items-center justify-center gap-1">
                            <WifiIcon className="w-3 h-3" />
                            <span>WiFi: {wifiPassword}</span>
                        </p>
                    )}
                    {instagram && <p className="text-xs text-amber-800 font-serif">IG: @{instagram}</p>}
                </div>
            </div>
        ),

        premium: (
            <div className="w-[105mm] h-[148mm] bg-black p-4 flex flex-col justify-between border border-amber-500">
                <div className="flex flex-col items-center">
                    {logo && <img src={logo} alt="Logo" className="h-10 w-auto object-contain brightness-200 mb-2" />}
                    <div className="text-amber-500 text-xs tracking-wider mb-1">LUXURY</div>
                    <h1 className="text-2xl font-light tracking-wide text-amber-400 mb-1 text-center">{restaurantName}</h1>
                    <div className="flex items-center gap-1">
                        <div className="w-8 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                        <span className="text-amber-500 text-xs tracking-widest">2024</span>
                        <div className="w-8 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="bg-white/5 backdrop-blur-sm p-4 border border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.3)] mb-3">
                        <img src={qrCode} alt="QR Code" className="w-28 h-28" />
                    </div>
                    <p className="text-sm font-light tracking-widest text-amber-400 mb-2">MENU</p>
                    {tableNumber && (
                        <div className="border border-amber-500 bg-amber-500/10 backdrop-blur-sm px-6 py-2">
                            <p className="text-xs text-amber-500 tracking-wider">TABLE</p>
                            <p className="text-3xl font-light text-amber-400">{tableNumber}</p>
                        </div>
                    )}
                </div>

                <div className="text-center space-y-1">
                    {wifiPassword && (
                        <p className="text-xs text-amber-500/80 tracking-wide flex items-center justify-center gap-1">
                            <WifiIcon className="w-3 h-3" />
                            <span>WiFi: <span className="font-mono">{wifiPassword}</span></span>
                        </p>
                    )}
                    {instagram && <p className="text-xs text-amber-500/80 tracking-wide">◆ @{instagram} ◆</p>}
                </div>
            </div>
        ),

        vintage: (
            <div className="w-[105mm] h-[148mm] bg-[#f4e8d0] p-4 flex flex-col justify-between border-8 border-[#8b4513] relative"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,69,19,0.03) 2px, rgba(139,69,19,0.03) 4px)',
                }}
            >
                <div className="flex flex-col items-center">
                    {logo && <img src={logo} alt="Logo" className="h-10 w-auto object-contain sepia mb-2" />}
                    <div className="border-t-2 border-b-2 border-[#8b4513] py-2 px-4">
                        <h1 className="text-2xl font-serif text-[#8b4513] text-center font-bold tracking-wide">
                            {restaurantName}
                        </h1>
                    </div>
                    <p className="text-xs text-[#8b4513] mt-1 italic">Est. 2024</p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="bg-white p-3 border-4 border-double border-[#8b4513] shadow-lg mb-2">
                        <img src={qrCode} alt="QR Code" className="w-28 h-28 sepia opacity-90" />
                    </div>
                    <p className="text-sm font-serif text-[#8b4513] mb-2">* MENU *</p>
                    {tableNumber && (
                        <div className="border-4 border-double border-[#8b4513] bg-[#f9f3e6] px-6 py-2">
                            <p className="text-xs text-[#8b4513]">TABLE</p>
                            <p className="text-3xl font-serif font-bold text-[#8b4513]">{tableNumber}</p>
                        </div>
                    )}
                </div>

                <div className="text-center space-y-0.5 border-t border-[#8b4513] pt-2">
                    {wifiPassword && (
                        <p className="text-xs text-[#8b4513] font-serif flex items-center justify-center gap-1">
                            <WifiIcon className="w-3 h-3" />
                            <span>WiFi: {wifiPassword}</span>
                        </p>
                    )}
                    {instagram && <p className="text-xs text-[#8b4513] font-serif">IG: @{instagram}</p>}
                </div>
            </div>
        ),

        ocean: (
            <div className="w-[105mm] h-[148mm] bg-gradient-to-b from-cyan-50 to-blue-100 p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-400 rounded-full blur-3xl"></div>
                </div>

                <div className="flex flex-col items-center relative z-10">
                    {logo && <img src={logo} alt="Logo" className="h-10 w-auto object-contain mb-2" />}
                    <div className="text-cyan-600 text-xl mb-1">
                        <SparklesIcon className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-bold text-blue-800 text-center mb-1">{restaurantName}</h1>
                    <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                </div>

                <div className="flex flex-col items-center relative z-10">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border-2 border-cyan-300 mb-3">
                        <img src={qrCode} alt="QR Code" className="w-28 h-28" />
                    </div>
                    <p className="text-sm text-blue-700 font-medium mb-2">~ Digital Menu ~</p>
                    {tableNumber && (
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-lg">
                            <p className="text-xs">Table</p>
                            <p className="text-2xl font-bold">{tableNumber}</p>
                        </div>
                    )}
                </div>

                <div className="text-center space-y-1 relative z-10 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2">
                    {wifiPassword && (
                        <p className="text-xs text-blue-700 flex items-center justify-center gap-1">
                            <WifiIcon className="w-3 h-3" />
                            <span>WiFi: <span className="font-semibold">{wifiPassword}</span></span>
                        </p>
                    )}
                    {instagram && <p className="text-xs text-blue-700">IG: @{instagram}</p>}
                </div>
            </div>
        ),

        forest: (
            <div className="w-[105mm] h-[148mm] bg-gradient-to-b from-green-50 to-emerald-100 p-4 flex flex-col justify-between relative">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-600 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-emerald-600 rounded-full blur-3xl"></div>
                </div>

                <div className="flex flex-col items-center relative z-10">
                    {logo && <img src={logo} alt="Logo" className="h-10 w-auto object-contain mb-2" />}
                    <div className="text-green-700 text-xl mb-1">
                        <SparklesIcon className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-bold text-green-800 text-center mb-1">{restaurantName}</h1>
                    <p className="text-xs text-green-600 italic">Fresh & Natural</p>
                </div>

                <div className="flex flex-col items-center relative z-10">
                    <div className="bg-white p-3 rounded-xl shadow-xl border-2 border-green-400 mb-2">
                        <img src={qrCode} alt="QR Code" className="w-28 h-28" />
                    </div>
                    <p className="text-sm text-green-700 font-medium mb-2">🍃 Menu 🍃</p>
                    {tableNumber && (
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg shadow-lg">
                            <p className="text-xs font-medium">Table</p>
                            <p className="text-2xl font-bold">{tableNumber}</p>
                        </div>
                    )}
                </div>

                <div className="text-center space-y-1 relative z-10 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-200">
                    {wifiPassword && (
                        <p className="text-xs text-green-700 flex items-center justify-center gap-1">
                            <WifiIcon className="w-3 h-3" />
                            <span>WiFi: <span className="font-semibold">{wifiPassword}</span></span>
                        </p>
                    )}
                    {instagram && <p className="text-xs text-green-700">IG: @{instagram}</p>}
                </div>
            </div>
        ),
    };

    return templates[style] || templates.minimal;
}

