import { Clock, DollarSign, Star, Plus } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Activity } from '@/types/types';

interface ActivityCardProps {
  activity: Activity;
  onAdd?: (activity: Activity) => void;
  compact?: boolean;
}

export default function ActivityCard({ activity, onAdd, compact = false }: ActivityCardProps) {
  const hours = Math.floor(activity.duration / 60);
  const minutes = activity.duration % 60;
  const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  if (compact) {
    return (
      <Card className="group hover:shadow-hover transition-shadow duration-150">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
              <img
                src={activity.images[0]}
                alt={activity.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1 line-clamp-1">{activity.name}</h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{durationText}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>${activity.price}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current text-chart-4" />
                  <span>{activity.rating}</span>
                </div>
              </div>
              {onAdd && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onAdd(activity)}
                  className="h-7 text-xs rounded-lg"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group h-full flex flex-col overflow-hidden hover:shadow-hover transition-shadow duration-150">
      {/* Activity Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={activity.images[0]}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge style={{ backgroundColor: activity.category.color }} className="text-white border-0">
            {activity.category.name}
          </Badge>
        </div>
      </div>

      <CardContent className="flex-1 p-6 space-y-3">
        <div>
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">
            {activity.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {activity.description}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{durationText}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>${activity.price}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-chart-4" />
            <span>{activity.rating}</span>
          </div>
        </div>

        {activity.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activity.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {onAdd && (
        <CardFooter className="p-6 pt-0 mt-auto shrink-0">
          <Button
            onClick={() => onAdd(activity)}
            className="w-full rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Itinerary
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
