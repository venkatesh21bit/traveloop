import { Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, MoreVertical, Edit, Trash2, Share2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Trip } from '@/types/types';
import { format } from 'date-fns';

interface TripCardProps {
  trip: Trip;
  onEdit?: (trip: Trip) => void;
  onDelete?: (trip: Trip) => void;
  onShare?: (trip: Trip) => void;
}

const statusColors = {
  draft: 'bg-muted text-muted-foreground',
  planned: 'bg-primary/10 text-primary',
  ongoing: 'bg-chart-4/10 text-chart-4',
  completed: 'bg-chart-2/10 text-chart-2',
};

export default function TripCard({ trip, onEdit, onDelete, onShare }: TripCardProps) {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="group h-full flex flex-col overflow-hidden hover:shadow-hover transition-shadow duration-150">
      {/* Cover Image */}
      <Link to={`/trips/${trip.id}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge className={statusColors[trip.status]}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </Badge>
          </div>
        </div>
      </Link>

      <CardContent className="flex-1 p-6 space-y-4">
        <div>
          <Link to={`/trips/${trip.id}`}>
            <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors line-clamp-1">
              {trip.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {trip.description}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>
              {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')} ({duration} days)
            </span>
          </div>
          {trip.stops && trip.stops.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{trip.stops.length} destination{trip.stops.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4 shrink-0" />
            <span>${trip.budget.toLocaleString()} budget</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between gap-2 mt-auto shrink-0">
        <Button asChild variant="secondary" className="flex-1 rounded-xl">
          <Link to={`/trips/${trip.id}`}>View Trip</Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 rounded-xl">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(trip)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShare?.(trip)}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(trip)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
