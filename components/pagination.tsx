"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className = "",
}: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Handle page change from UI
    const handlePageChange = (page: number) => {
        if (onPageChange) {
            onPageChange(page);
            return;
        }

        // Update URL with new page number
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    // Generate pagination items logic
    const generatePaginationItems = () => {
        // If 7 or fewer pages, show all
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Always show first and last page
        const items: (number | string)[] = [1];

        // For current page near the start
        if (currentPage <= 3) {
            items.push(2, 3, 4, "ellipsis", totalPages);
        }
        // For current page near the end
        else if (currentPage >= totalPages - 2) {
            items.push(
                "ellipsis",
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            );
        }
        // For current page in the middle
        else {
            items.push(
                "ellipsis",
                currentPage - 1,
                currentPage,
                currentPage + 1,
                "ellipsis2",
                totalPages
            );
        }

        return items;
    };

    // Don't show pagination if only one page
    if (totalPages <= 1) return null;

    const paginationItems = generatePaginationItems();

    return (
        <div className={`flex justify-center items-center gap-1 ${className}`}>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-md border-emerald-500/20 bg-black/20 text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300"
                onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {paginationItems.map((item, i) =>
                typeof item === "number" ? (
                    <Button
                        key={`page-${i}`}
                        variant={currentPage === item ? "default" : "outline"}
                        size="sm"
                        className={
                            currentPage === item
                                ? "h-8 min-w-8 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white"
                                : "h-8 min-w-8 rounded-md border-emerald-500/20 bg-black/20 text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300"
                        }
                        onClick={() => handlePageChange(item)}
                    >
                        {item}
                    </Button>
                ) : (
                    <MoreHorizontal
                        key={`ellipsis-${i}`}
                        className="h-4 w-4 text-emerald-500/60"
                    />
                )
            )}

            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-md border-emerald-500/20 bg-black/20 text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300"
                onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                }
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
