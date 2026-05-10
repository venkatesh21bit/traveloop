import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PageHeader from '@/components/common/PageHeader';
import TripCard from '@/components/common/TripCard';
import EmptyState from '@/components/common/EmptyState';
import { TripCardSkeleton } from '@/components/common/LoadingSkeleton';
import { useTripStore } from '@/store/tripStore';
import { mockTrips } from '@/data/mockData';

export default function MyTripsPage() {
  const { trips, setTrips, filters, setFilters, sortOptions, setSortOptions, getFilteredTrips } = useTripStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setTrips(mockTrips);
      setIsLoading(false);
    }, 500);
  }, [setTrips]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters({ ...filters, search: value });
  };

  const handleStatusFilter = (value: string) => {
    setFilters({
      ...filters,
      status: value === 'all' ? undefined : (value as any),
    });
  };

  const handleSort = (value: string) => {
    const [field, order] = value.split('-');
    setSortOptions({ field, order: order as 'asc' | 'desc' });
  };

  const filteredTrips = getFilteredTrips();

  return (
    <div className="min-h-full">
      <div className="max-w-[1440px] mx-auto p-6 md:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader
            title="My Trips"
            description="Manage and organize all your travel plans"
            action={
              <Button asChild size="lg" className="rounded-xl">
                <Link to="/trips/new">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Trip
                </Link>
              </Button>
            }
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>

          <Select onValueChange={handleStatusFilter} defaultValue="all">
            <SelectTrigger className="w-full md:w-48 rounded-xl">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={handleSort} defaultValue="createdAt-desc">
            <SelectTrigger className="w-full md:w-48 rounded-xl">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="startDate-asc">Start Date (Earliest)</SelectItem>
              <SelectItem value="startDate-desc">Start Date (Latest)</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Trips Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <TripCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No trips found"
              description={
                searchQuery || filters.status
                  ? 'Try adjusting your filters'
                  : 'Start planning your first adventure'
              }
              action={
                !searchQuery && !filters.status ? (
                  <Button asChild className="rounded-xl">
                    <Link to="/trips/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Trip
                    </Link>
                  </Button>
                ) : undefined
              }
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
