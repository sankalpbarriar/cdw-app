import { ClassifiedCardSkeleton } from "@/components/inventory/classified-card-skeleton"
import { IneventorySkeleton } from "@/components/inventory/inventory-skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function FavouritesLoafingPage() {
    return (
        <div className="container mx-auto px-4 py-8 min-h-[80dvh]">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Favourites Classifieds</h1>
            <IneventorySkeleton/>
        </div>
    )
}