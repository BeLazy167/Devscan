"use client";

import { Search, X, Filter } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [tech, setTech] = useState("");
    const [popularTechs, setPopularTechs] = useState<string[]>([
        "react",
        "python",
        "javascript",
        "nodejs",
        "machine learning",
        "blockchain",
        "firebase",
        "mongodb",
        "nextjs",
        "typescript",
    ]);
    const [showClearButton, setShowClearButton] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize form values from URL on component mount
    useEffect(() => {
        const urlQuery = searchParams.get("query") || "";
        const urlTech = searchParams.get("tech") || "";

        setQuery(urlQuery);
        setTech(urlTech);
        setShowClearButton(!!(urlQuery || urlTech));
    }, [searchParams]);

    // Update URL with search parameters
    const updateSearchParams = useCallback(
        (newQuery?: string, newTech?: string) => {
            const params = new URLSearchParams(searchParams.toString());

            if (newQuery !== undefined) {
                if (newQuery) params.set("query", newQuery);
                else params.delete("query");
            }

            if (newTech !== undefined) {
                if (newTech) params.set("tech", newTech);
                else params.delete("tech");
            }

            const hasFilters = params.toString().length > 0;
            setShowClearButton(hasFilters);

            // Reset to page 1 when search criteria change
            params.set("page", "1");

            router.push(`${pathname}?${params.toString()}`);
        },
        [searchParams, pathname, router]
    );

    // Handle search form submission
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        updateSearchParams(query, tech);
    };

    // Clear all search filters
    const handleClearSearch = () => {
        setQuery("");
        setTech("");
        updateSearchParams("", "");
        if (inputRef.current) inputRef.current.focus();
    };

    // Add a tech filter
    const handleAddTech = (techName: string) => {
        setTech(techName);
        updateSearchParams(query, techName);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                        <Input
                            ref={inputRef}
                            className="w-full pl-10 pr-10 bg-black/20 border-emerald-500/20 focus-visible:ring-emerald-500/30 hover:border-emerald-500/40 placeholder:text-emerald-200/40"
                            placeholder="Search projects by name, description, or GitHub summary..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {showClearButton && (
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400/70 hover:text-emerald-400"
                                onClick={handleClearSearch}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className={`gap-2 ${
                                    tech
                                        ? "border-emerald-500 bg-emerald-950/40"
                                        : "border-emerald-500/20"
                                }`}
                            >
                                <Filter className="h-4 w-4" />
                                {tech ? "Filtered" : "Filter"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4 bg-[#1a1a2e] border-emerald-500/20">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-emerald-200 mb-2">
                                        Technology
                                    </h3>
                                    <Input
                                        className="w-full bg-black/20 border-emerald-500/20 focus-visible:ring-emerald-500/30"
                                        placeholder="Filter by technology..."
                                        value={tech}
                                        onChange={(e) =>
                                            setTech(e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-emerald-200 mb-2">
                                        Popular Technologies
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {popularTechs.map((techName) => (
                                            <Badge
                                                key={techName}
                                                className="cursor-pointer bg-emerald-900/40 hover:bg-emerald-900/70 border-emerald-500/20 text-emerald-200"
                                                onClick={() =>
                                                    handleAddTech(techName)
                                                }
                                            >
                                                {techName}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setTech("")}
                                        className="text-emerald-400"
                                    >
                                        Clear Filters
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => {
                                            handleSearch();
                                            document.body.click(); // Close popover
                                        }}
                                        className="bg-emerald-700 hover:bg-emerald-600 text-white"
                                    >
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button
                        type="submit"
                        className="bg-emerald-700 hover:bg-emerald-600 text-white"
                    >
                        Search
                    </Button>
                </div>

                {/* Active filters display */}
                {(query || tech) && (
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="text-xs text-emerald-400">
                            Active filters:
                        </span>
                        {query && (
                            <Badge
                                className="bg-emerald-700/30 border-emerald-500/20 text-emerald-200 px-2 py-1 gap-1"
                                onClick={() => updateSearchParams("", tech)}
                            >
                                {query}
                                <X className="h-3 w-3 cursor-pointer" />
                            </Badge>
                        )}
                        {tech && (
                            <Badge
                                className="bg-emerald-700/30 border-emerald-500/20 text-emerald-200 px-2 py-1 gap-1"
                                onClick={() => updateSearchParams(query, "")}
                            >
                                Tech: {tech}
                                <X className="h-3 w-3 cursor-pointer" />
                            </Badge>
                        )}
                        <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={handleClearSearch}
                            className="text-xs text-emerald-400 h-auto p-0"
                        >
                            Clear all
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
