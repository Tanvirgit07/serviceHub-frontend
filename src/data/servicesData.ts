export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  availability: boolean;
  provider: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    jobsCompleted: number;
    phone: string;
    email: string;
  };
  features: string[];
  inclusions: string[];
  exclusions: string[];
  createdAt: string;
}

export const CATEGORIES = [
  "All",
  "Appliances",
  "Cleaning",
  "Plumbing",
  "Electrical",
  "Painting",
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: "ac-servicing-master",
    title: "AC Master Servicing & Gas Refill",
    description:
      "Comprehensive AC cooling inspection, jet chemical cleaning, filter wash, pressure test, and refrigerant top-up for optimal energy efficiency.",
    category: "Appliances",
    price: 45,
    duration: "60-90 mins",
    rating: 4.9,
    reviewsCount: 320,
    imageUrl:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
    availability: true,
    provider: {
      id: "pro-1",
      name: "Tanvir Cooling Solutions",
      avatar: "https://i.pravatar.cc/150?img=11",
      rating: 4.9,
      jobsCompleted: 580,
      phone: "+880 1812-345678",
      email: "tanvir.cooling@servicehub.com",
    },
    features: [
      "Certified AC HVAC Technician",
      "Eco-friendly coil cleaner used",
      "30-day post-service warranty",
    ],
    inclusions: [
      "Indoor unit deep chemical wash",
      "Outdoor condenser fin cleaning",
      "Cooling airflow & gas pressure check",
      "Electrical circuit & capacitor inspection",
    ],
    exclusions: [
      "Spare parts replacement cost",
      "Major compressor rewinding",
    ],
    createdAt: "2024-01-15",
  },
  {
    id: "full-home-deep-cleaning",
    title: "Full Home Deep Cleaning & Sanitization",
    description:
      "Complete multi-room deep cleaning including floor scrubbing, kitchen grease removal, bathroom descaling, balcony cleaning, and full sanitization.",
    category: "Cleaning",
    price: 65,
    duration: "3-4 hours",
    rating: 4.8,
    reviewsCount: 412,
    imageUrl:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
    availability: true,
    provider: {
      id: "pro-2",
      name: "Sparkle Cleaners Ltd.",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: 4.8,
      jobsCompleted: 890,
      phone: "+880 1711-987654",
      email: "support@sparkleclean.com",
    },
    features: [
      "Hospital-grade disinfectant agents",
      "Industrial scrubbing machines",
      "Team of 3 background-verified pros",
    ],
    inclusions: [
      "All bedroom, living, and dining dusting",
      "Kitchen stovetop, chimney & tile degreasing",
      "Bathroom tiles & sanitaryware descaling",
      "Window glass, grill & balcony cleaning",
    ],
    exclusions: [
      "Furniture internal storage reorganization",
      "Exterior high-rise window cleaning",
    ],
    createdAt: "2024-01-20",
  },
  {
    id: "plumbing-pipe-leak-fix",
    title: "Emergency Plumbing & Pipe Leak Fix",
    description:
      "Quick response plumbing for leaking pipes, clogged drains, faulty faucets, bathroom fittings, and water heater pipe connections.",
    category: "Plumbing",
    price: 35,
    duration: "45-60 mins",
    rating: 4.9,
    reviewsCount: 245,
    imageUrl:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=800&auto=format&fit=crop",
    availability: true,
    provider: {
      id: "pro-3",
      name: "Dhaka Plumbing Care",
      avatar: "https://i.pravatar.cc/150?img=60",
      rating: 4.9,
      jobsCompleted: 430,
      phone: "+880 1913-445566",
      email: "info@dhakaplumbing.com",
    },
    features: [
      "Under 45-min arrival time",
      "Modern pipe pressure inspection",
      "100% leak-proof guaranteed repair",
    ],
    inclusions: [
      "Leak detection & pipe joint resealing",
      "Tap/shower washer replacement",
      "Drain unclogging & sediment flush",
      "Water valve & line inspection",
    ],
    exclusions: ["Cost of new pipes, valves, or taps"],
    createdAt: "2024-02-01",
  },
  {
    id: "electrical-wiring-switchboard",
    title: "Electrical Circuit & Switchboard Repair",
    description:
      "Safe and certified electrical solutions including short circuit diagnostics, switch replacement, ceiling fan installation, and breaker maintenance.",
    category: "Electrical",
    price: 40,
    duration: "45-60 mins",
    rating: 4.8,
    reviewsCount: 198,
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    availability: true,
    provider: {
      id: "pro-4",
      name: "VoltMaster Electricians",
      avatar: "https://i.pravatar.cc/150?img=12",
      rating: 4.8,
      jobsCompleted: 350,
      phone: "+880 1612-889900",
      email: "contact@voltmaster.com",
    },
    features: [
      "Licensed safety-certified technicians",
      "Digital multi-meter diagnosis",
      "Safety gear & surge protection checks",
    ],
    inclusions: [
      "Faulty circuit inspection & repair",
      "Up to 3 switch/socket replacements",
      "Ceiling fan/light hanging setup",
      "Main DB breaker safety check",
    ],
    exclusions: ["Heavy industrial 3-phase rewiring"],
    createdAt: "2024-02-10",
  },
  {
    id: "sofa-carpet-shampoo-wash",
    title: "Sofa & Carpet Steam Shampooing",
    description:
      "Revitalize fabrics, upholstery, and carpets with extraction wet cleaning, anti-bacterial steaming, and stubborn stain removal.",
    category: "Cleaning",
    price: 30,
    duration: "60-90 mins",
    rating: 4.7,
    reviewsCount: 180,
    imageUrl:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=800&auto=format&fit=crop",
    availability: true,
    provider: {
      id: "pro-2",
      name: "Sparkle Cleaners Ltd.",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: 4.8,
      jobsCompleted: 890,
      phone: "+880 1711-987654",
      email: "support@sparkleclean.com",
    },
    features: [
      "Rapid-dry vacuum extraction",
      "Odor removal & allergen elimination",
      "Safe for sensitive skin & pets",
    ],
    inclusions: [
      "Dry vacuuming of loose debris",
      "Spot treatment for food/coffee stains",
      "Foam shampoo scrubber application",
      "Deep moisture extraction",
    ],
    exclusions: ["Torn leather re-stitching"],
    createdAt: "2024-02-14",
  },
  {
    id: "refrigerator-gas-cooling-fix",
    title: "Refrigerator Cooling Diagnostic & Repair",
    description:
      "Diagnostic and repair service for all major double-door and inverter refrigerator brands. Fix non-cooling, water leakage, or abnormal compressor noise.",
    category: "Appliances",
    price: 50,
    duration: "60-90 mins",
    rating: 4.9,
    reviewsCount: 165,
    imageUrl:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
    availability: true,
    provider: {
      id: "pro-1",
      name: "Tanvir Cooling Solutions",
      avatar: "https://i.pravatar.cc/150?img=11",
      rating: 4.9,
      jobsCompleted: 580,
      phone: "+880 1812-345678",
      email: "tanvir.cooling@servicehub.com",
    },
    features: [
      "Expertise across Samsung, LG, Walton, Hitachi",
      "Original spare parts sourced directly",
      "Thermal sensor digital calibration",
    ],
    inclusions: [
      "Compressor & thermostat diagnostic",
      "Refrigerant gas leak test & top-up",
      "Defrost drain line unclogging",
      "Door rubber gasket seal check",
    ],
    exclusions: ["Compressor replacement unit cost"],
    createdAt: "2024-02-22",
  },
  {
    id: "interior-wall-painting",
    title: "Interior Wall Painting & Touch-up",
    description:
      "Professional wall painting, putty smoothening, damp treatment, and designer accent wall coloring using premium low-VOC paints.",
    category: "Painting",
    price: 85,
    duration: "1-2 days",
    rating: 4.8,
    reviewsCount: 130,
    imageUrl:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop",
    availability: true,
    provider: {
      id: "pro-5",
      name: "ColorCraft Painters",
      avatar: "https://i.pravatar.cc/150?img=25",
      rating: 4.8,
      jobsCompleted: 210,
      phone: "+880 1515-667788",
      email: "info@colorcraft.com",
    },
    features: [
      "Laser wall moisture measurement",
      "Furniture plastic covering included",
      "Precision roller finish",
    ],
    inclusions: [
      "Crack filling & sanding",
      "Primer coat application",
      "2 coats of premium plastic emulsion",
      "Floor cleanup after work",
    ],
    exclusions: ["Major civil plaster reconstruction"],
    createdAt: "2024-03-01",
  },
  {
    id: "bathroom-deep-sanitization",
    title: "Bathroom Deep Scrub & Scale Removal",
    description:
      "Heavy-duty chemical descaling of hard water stains, tile yellowing, commode sanitization, mirror buffing, and chrome fixture shining.",
    category: "Cleaning",
    price: 25,
    duration: "45-60 mins",
    rating: 4.9,
    reviewsCount: 290,
    imageUrl:
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=800&auto=format&fit=crop",
    availability: true,
    provider: {
      id: "pro-2",
      name: "Sparkle Cleaners Ltd.",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: 4.8,
      jobsCompleted: 890,
      phone: "+880 1711-987654",
      email: "support@sparkleclean.com",
    },
    features: [
      "Hard water calcium removal formula",
      "99.9% germ sanitization",
      "Sparkling chrome fixtures finish",
    ],
    inclusions: [
      "Floor and wall tile rotary scrubbing",
      "Commode, basin & tub deep bleach wash",
      "Taps and showerhead limescale removal",
      "Exhaust fan and glass buffing",
    ],
    exclusions: ["Broken tile re-grouting"],
    createdAt: "2024-03-05",
  },
];

const STORAGE_KEY = "servicehub_services_data_v1";

// Helper to get stored services (with localStorage fallback for demo/CRUD)
export function getStoredServices(): Service[] {
  if (typeof window === "undefined") {
    return INITIAL_SERVICES;
  }
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES;
    }
    return JSON.parse(item);
  } catch {
    return INITIAL_SERVICES;
  }
}

// Get single service by ID
export function getStoredServiceById(id: string): Service | undefined {
  const services = getStoredServices();
  return services.find((s) => s.id === id);
}

// Create a new service
export function createStoredService(
  data: Omit<Service, "id" | "createdAt" | "rating" | "reviewsCount">
): Service {
  const services = getStoredServices();
  const newService: Service = {
    ...data,
    id: `service-${Date.now()}`,
    rating: 5.0,
    reviewsCount: 1,
    createdAt: new Date().toISOString().split("T")[0],
  };

  const updatedList = [newService, ...services];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  }
  return newService;
}

// Update existing service
export function updateStoredService(
  id: string,
  updatedData: Partial<Service>
): Service | null {
  const services = getStoredServices();
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const updatedService = { ...services[index], ...updatedData };
  services[index] = updatedService;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  }
  return updatedService;
}

// Delete service
export function deleteStoredService(id: string): boolean {
  const services = getStoredServices();
  const filtered = services.filter((s) => s.id !== id);
  if (filtered.length === services.length) return false;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
  return true;
}
