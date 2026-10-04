export type OrderStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface OrderItem {
  id: string;
  orderNumber: string;
  serviceId: string;
  serviceTitle: string;
  category: string;
  serviceImage: string;
  price: number;
  platformFee: number;
  totalAmount: number;
  status: OrderStatus;
  bookingDate: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  paymentMethod: string;
  paymentStatus: "PAID" | "PENDING" | "REFUNDED";
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
  provider: {
    id: string;
    name: string;
    avatar: string;
    phone: string;
    email: string;
    rating: number;
  };
}

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "ord-101",
    orderNumber: "ORD-98421",
    serviceId: "ac-servicing-master",
    serviceTitle: "AC Master Servicing & Gas Refill",
    category: "Appliances",
    serviceImage:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
    price: 45,
    platformFee: 5,
    totalAmount: 50,
    status: "CONFIRMED",
    bookingDate: "2026-10-02",
    scheduledDate: "2026-10-06",
    scheduledTimeSlot: "10:00 AM - 12:00 PM",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "PENDING",
    customer: {
      name: "Tanvir Ahmed",
      phone: "+880 1712-345678",
      address: "House 42, Road 11, Block D, Banani, Dhaka",
      notes: "Please call before arriving at the apartment building.",
    },
    provider: {
      id: "pro-1",
      name: "Tanvir Cooling Solutions",
      avatar: "https://i.pravatar.cc/150?img=11",
      phone: "+880 1812-345678",
      email: "tanvir.cooling@servicehub.com",
      rating: 4.9,
    },
  },
  {
    id: "ord-102",
    orderNumber: "ORD-97814",
    serviceId: "full-home-deep-cleaning",
    serviceTitle: "Full Home Deep Cleaning & Sanitization",
    category: "Cleaning",
    serviceImage:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
    price: 65,
    platformFee: 5,
    totalAmount: 70,
    status: "COMPLETED",
    bookingDate: "2026-09-28",
    scheduledDate: "2026-09-30",
    scheduledTimeSlot: "02:00 PM - 04:00 PM",
    paymentMethod: "Credit / Debit Card",
    paymentStatus: "PAID",
    customer: {
      name: "Tanvir Ahmed",
      phone: "+880 1712-345678",
      address: "House 42, Road 11, Block D, Banani, Dhaka",
      notes: "3-bedroom apartment full sanitization.",
    },
    provider: {
      id: "pro-2",
      name: "Sparkle Cleaners Ltd.",
      avatar: "https://i.pravatar.cc/150?img=32",
      phone: "+880 1711-987654",
      email: "support@sparkleclean.com",
      rating: 4.8,
    },
  },
  {
    id: "ord-103",
    orderNumber: "ORD-96502",
    serviceId: "plumbing-pipe-leak-fix",
    serviceTitle: "Emergency Plumbing & Pipe Leak Fix",
    category: "Plumbing",
    serviceImage:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=800&auto=format&fit=crop",
    price: 35,
    platformFee: 5,
    totalAmount: 40,
    status: "PENDING",
    bookingDate: "2026-10-03",
    scheduledDate: "2026-10-07",
    scheduledTimeSlot: "04:00 PM - 06:00 PM",
    paymentMethod: "bKash / Nagad",
    paymentStatus: "PENDING",
    customer: {
      name: "Tanvir Ahmed",
      phone: "+880 1712-345678",
      address: "House 42, Road 11, Block D, Banani, Dhaka",
      notes: "Kitchen sink drain pipe joint dripping water.",
    },
    provider: {
      id: "pro-3",
      name: "Dhaka Plumbing Care",
      avatar: "https://i.pravatar.cc/150?img=60",
      phone: "+880 1913-445566",
      email: "info@dhakaplumbing.com",
      rating: 4.9,
    },
  },
  {
    id: "ord-104",
    orderNumber: "ORD-95110",
    serviceId: "electrical-wiring-switchboard",
    serviceTitle: "Electrical Circuit & Switchboard Repair",
    category: "Electrical",
    serviceImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    price: 40,
    platformFee: 5,
    totalAmount: 45,
    status: "CANCELLED",
    bookingDate: "2026-09-15",
    scheduledDate: "2026-09-17",
    scheduledTimeSlot: "11:00 AM - 01:00 PM",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "REFUNDED",
    customer: {
      name: "Tanvir Ahmed",
      phone: "+880 1712-345678",
      address: "House 42, Road 11, Block D, Banani, Dhaka",
      notes: "Cancelled due to personal schedule conflict.",
    },
    provider: {
      id: "pro-4",
      name: "VoltMaster Electricians",
      avatar: "https://i.pravatar.cc/150?img=12",
      phone: "+880 1612-889900",
      email: "contact@voltmaster.com",
      rating: 4.8,
    },
  },
];

const ORDERS_STORAGE_KEY = "servicehub_my_orders_v1";

export function getStoredOrders(): OrderItem[] {
  if (typeof window === "undefined") {
    return INITIAL_ORDERS;
  }
  try {
    const item = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!item) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(item);
  } catch {
    return INITIAL_ORDERS;
  }
}

export function getStoredOrderById(id: string): OrderItem | undefined {
  const orders = getStoredOrders();
  return orders.find((o) => o.id === id || o.orderNumber === id);
}

export function cancelStoredOrder(id: string): boolean {
  const orders = getStoredOrders();
  const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index === -1) return false;

  orders[index].status = "CANCELLED";
  if (typeof window !== "undefined") {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }
  return true;
}

export function updateStoredOrderStatus(
  id: string,
  newStatus: OrderStatus
): OrderItem | null {
  const orders = getStoredOrders();
  const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index === -1) return null;

  orders[index].status = newStatus;
  if (typeof window !== "undefined") {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }
  return orders[index];
}

