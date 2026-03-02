import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { hotelService } from "@/services/hotel.service";
import { GlobalSearchResponse } from "@/types/hotel.types";
import { Loader2, Search, Calendar, User, DoorOpen, Users, ArrowRight } from "lucide-react";

interface GlobalSearchResultsProps {
    query: string;
    onClose: () => void;
}

export default function GlobalSearchResults({ query, onClose }: GlobalSearchResultsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<GlobalSearchResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query || query.length < 3) {
                setResults(null);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const data = await hotelService.globalSearch(query);
                setResults(data);
            } catch (err: any) {
                console.error("Search failed:", err);
                setError("Failed to fetch search results");
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300); // 300ms debounce
        return () => clearTimeout(timer);
    }, [query]);

    if (!query || query.length < 3) {
        return null;
    }

    const hasResults = results && Object.values(results.results || {}).some(arr => arr && arr.length > 0);

    const renderSection = (title: string, items: any[] | undefined, icon: React.ReactNode) => {
        if (!items || items.length === 0) return null;

        return (
            <div className="mb-4 last:mb-0">
                <h3 className="text-xs font-bold text-[#5C5B59] uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                    {icon}
                    {title}
                </h3>
                <ul className="space-y-1">
                    {items.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => {
                                    if (item.url) {
                                        router.push(item.url);
                                    }
                                    onClose();
                                }}
                                className="w-full text-left p-2 rounded-xl hover:bg-[#F0F9FF] transition-colors flex flex-col items-start group"
                            >
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#0F75BD]">{item.title}</span>
                                    <ArrowRight className="w-3 h-3 text-transparent group-hover:text-[#0F75BD] transition-colors" />
                                </div>
                                {item.subtitle && (
                                    <span className="text-xs text-[#5C5B59] mt-0.5">{item.subtitle}</span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            className="absolute top-full mt-2 w-full bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden z-50 max-h-[80vh] flex flex-col"
        >
            {loading ? (
                <div className="p-8 flex flex-col items-center justify-center text-[#5C5B59]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#0F75BD] mb-2" />
                    <p className="text-sm">Searching...</p>
                </div>
            ) : error ? (
                <div className="p-4 text-sm text-red-600 bg-red-50 text-center">
                    {error}
                </div>
            ) : hasResults ? (
                <div className="p-2 overflow-y-auto scrollbar-hide">
                    {renderSection("Bookings", results?.results?.bookings, <Calendar className="w-3.5 h-3.5" />)}
                    {renderSection("Guests", results?.results?.guests, <User className="w-3.5 h-3.5" />)}
                    {renderSection("Rooms", results?.results?.rooms, <DoorOpen className="w-3.5 h-3.5" />)}
                    {renderSection("Staff", results?.results?.staff, <Users className="w-3.5 h-3.5" />)}
                </div>
            ) : (
                <div className="p-8 flex flex-col items-center justify-center text-center">
                    <Search className="w-8 h-8 text-gray-300 mb-3" />
                    <p className="text-sm font-semibold text-[#1A1A1A]">No results found</p>
                    <p className="text-xs text-[#5C5B59] mt-1">Try adjusting your search query</p>
                </div>
            )}
        </div>
    );
}
