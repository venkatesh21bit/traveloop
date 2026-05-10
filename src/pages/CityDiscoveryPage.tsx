import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, DollarSign, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/common/PageHeader';
import { mockCities } from '@/data/mockData';

export default function CityDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const countries = Array.from(new Set(mockCities.map((city) => city.country)));

  const filteredCities = mockCities.filter((city) => {
    const matchesSearch =
      !searchQuery ||
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = !selectedCountry || city.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="min-h-full">
      <div className="max-w-[1440px] mx-auto p-6 md:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader
            title="Discover Cities"
            description="Explore amazing destinations around the world"
          />
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCountry === null ? 'default' : 'secondary'}
              onClick={() => setSelectedCountry(null)}
              className="rounded-xl"
            >
              All Countries
            </Button>
            {countries.map((country) => (
              <Button
                key={country}
                variant={selectedCountry === country ? 'default' : 'secondary'}
                onClick={() => setSelectedCountry(country)}
                className="rounded-xl"
              >
                {country}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Cities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCities.map((city) => (
            <Card key={city.id} className="group h-full flex flex-col overflow-hidden hover:shadow-hover transition-shadow duration-150">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
                  <p className="text-sm text-white/90">{city.country}</p>
                </div>
              </div>

              <CardContent className="flex-1 p-6 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {city.description}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {'$'.repeat(city.costIndex)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-chart-4" />
                    <span className="font-medium">{city.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {city.popularActivities.slice(0, 3).map((activity) => (
                    <Badge key={activity} variant="secondary" className="text-xs">
                      {activity}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full rounded-xl mt-auto" onClick={() => {}}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Add to Trip
                </Button>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
