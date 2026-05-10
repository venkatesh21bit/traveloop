import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import PageHeader from '@/components/common/PageHeader';
import TripCard from '@/components/common/TripCard';
import EmptyState from '@/components/common/EmptyState';
import { useAuthStore } from '@/store/authStore';
import { useTripStore } from '@/store/tripStore';
import { mockTrips, mockCities } from '@/data/mockData';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { trips, setTrips } = useTripStore();

  useEffect(() => {
    // Load mock trips
    setTrips(mockTrips);
  }, [setTrips]);

  const upcomingTrips = trips.filter(
    (trip) => trip.status === 'planned' || trip.status === 'ongoing'
  );
  const completedTrips = trips.filter((trip) => trip.status === 'completed');
  const recentTrips = trips.slice(0, 3);

  const stats = [
    {
      title: 'Total Trips',
      value: trips.length,
      icon: MapPin,
      color: 'text-primary',
    },
    {
      title: 'Upcoming',
      value: upcomingTrips.length,
      icon: Calendar,
      color: 'text-chart-4',
    },
    {
      title: 'Completed',
      value: completedTrips.length,
      icon: TrendingUp,
      color: 'text-chart-2',
    },
  ];

  return (
    <div className="min-h-full">
      <div className="max-w-[1440px] mx-auto p-6 md:p-8 space-y-12">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader
            title={`Welcome back, ${user?.name?.split(' ')[0] || 'Traveler'}!`}
            description="Plan your next adventure or continue where you left off"
            action={
              <Button asChild size="lg" className="rounded-xl">
                <Link to="/trips/new">
                  <Plus className="h-5 w-5 mr-2" />
                  Plan New Trip
                </Link>
              </Button>
            }
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Recent Trips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Trips</h2>
            <Button asChild variant="ghost" className="rounded-xl">
              <Link to="/trips">View all</Link>
            </Button>
          </div>

          {recentTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<MapPin className="h-8 w-8 text-muted-foreground" />}
              title="No trips yet"
              description="Start planning your first adventure"
              action={
                <Button asChild className="rounded-xl">
                  <Link to="/trips/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Trip
                  </Link>
                </Button>
              }
            />
          )}
        </motion.div>

        {/* Recommended Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold">Recommended Destinations</h2>
          
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {mockCities.slice(0, 6).map((city) => (
                <CarouselItem key={city.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="group overflow-hidden hover:shadow-hover transition-shadow duration-150">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-xl font-bold mb-1">{city.name}</h3>
                        <p className="text-sm text-white/90">{city.country}</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {city.description}
                      </p>
                      <Button asChild variant="secondary" className="w-full rounded-xl">
                        <Link to={`/discover/cities?city=${city.id}`}>
                          Explore
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </motion.div>
      </div>
    </div>
  );
}
