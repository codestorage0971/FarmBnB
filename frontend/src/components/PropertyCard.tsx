import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  id: string;
  name: string;
  location: string;
  city?: string;
  basePricePerNight: number;
  maxGuests: number;
  images: string[];
  facilities: string[];
}

export const PropertyCard = ({
  id,
  name,
  location,
  city,
  basePricePerNight,
  maxGuests,
  images,
  facilities,
}: PropertyCardProps) => {
  const displayImage = images[0] || "/placeholder.svg";

  return (
    <Link to={`/properties/${id}`}>
      <Card className="group overflow-hidden hover-lift animate-fade-in">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{city || location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Up to {maxGuests} guests</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Starting from</p>
              <p className="text-lg font-semibold text-primary">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(basePricePerNight)}
              </p>
              <p className="text-xs text-muted-foreground">per day</p>
            </div>
          </div>
          {facilities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {facilities.slice(0, 3).map((facility, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-secondary text-xs rounded-full text-secondary-foreground"
                >
                  {facility}
                </span>
              ))}
              {facilities.length > 3 && (
                <span className="px-2 py-1 bg-secondary text-xs rounded-full text-secondary-foreground">
                  +{facilities.length - 3} more
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
