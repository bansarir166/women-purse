"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Address {
  id: string;
  isDefault: boolean;
  label: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderItem {
  id: string;
  name: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: "Allocated in Florence" | "Preparing in Florence" | "In Transit (White-Glove)" | "Delivered";
  total: number;
  trackingNumber: string;
  items: OrderItem[];
}

export interface AtelierPrivilege {
  id: string;
  title: string;
  description: string;
  code: string;
  status: "Active" | "Redeemed";
  expiresAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipTier: "Atelier Privé VIP" | "Atelier Connoisseur" | "Atelier Patron";
  memberSince: string;
  phone?: string;
  addresses: Address[];
  orders: Order[];
  privileges: AtelierPrivilege[];
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: () => void;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  setDefaultAddress: (addressId: string) => void;
}

const DEMO_VIP_USER: UserProfile = {
  id: "usr_clara_740",
  name: "Clara Montague",
  firstName: "Clara",
  lastName: "Montague",
  email: "clara.montague@atelier.com",
  membershipTier: "Atelier Privé VIP",
  memberSince: "November 2023",
  phone: "+1 (212) 555-0198",
  addresses: [
    {
      id: "addr_1",
      isDefault: true,
      label: "Primary Residence",
      name: "Clara Montague",
      street: "740 Park Avenue, Apt 11B",
      city: "New York",
      state: "NY",
      zip: "10021",
      country: "United States",
    },
    {
      id: "addr_2",
      isDefault: false,
      label: "Hamptons Atelier",
      name: "Clara Montague",
      street: "42 Dune Road",
      city: "East Hampton",
      state: "NY",
      zip: "11937",
      country: "United States",
    },
  ],
  orders: [
    {
      id: "VEL-894215",
      date: "September 10, 2026",
      status: "In Transit (White-Glove)",
      total: 395,
      trackingNumber: "WG-IT-992014-NY",
      items: [
        {
          id: "the-aurelia-bag",
          name: "The Aurelia Bag",
          color: "Warm Ivory",
          price: 189,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
        },
        {
          id: "the-monaco-clutch",
          name: "The Monaco Minaudière",
          color: "Gilded Gold",
          price: 206,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=600&auto=format&fit=crop",
        },
      ],
    },
    {
      id: "VEL-641092",
      date: "August 14, 2026",
      status: "Delivered",
      total: 229,
      trackingNumber: "WG-IT-488203-NY",
      items: [
        {
          id: "the-celeste-tote",
          name: "The Celeste Tote",
          color: "Caramel Cognac",
          price: 229,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop",
        },
      ],
    },
  ],
  privileges: [
    {
      id: "priv_1",
      title: "Bespoke Hot-Stamped Monogramming",
      description: "Complimentary gold foil or blind deboss initials on your next silhouette.",
      code: "PRIVÉ-INITIALS",
      status: "Active",
      expiresAt: "Ongoing Privilege",
    },
    {
      id: "priv_2",
      title: "Florence Atelier Private Tour & Concierge",
      description: "Invitation for two to visit our master leather studio in Scandicci, Florence.",
      code: "FIRENZE-INVITE",
      status: "Active",
      expiresAt: "Valid 2026-2027",
    },
    {
      id: "priv_3",
      title: "Annual Leather Conditioning Spa",
      description: "Complimentary biannual rejuvenation & edge repainting for any VELORA piece.",
      code: "SPA-REJUVENATE",
      status: "Active",
      expiresAt: "Ongoing Privilege",
    },
  ],
};

const STORAGE_KEY = "velora_auth_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to parse saved user from localStorage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserSession = (newUser: UserProfile | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = async (email: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate luxury network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const normalizedEmail = email.trim().toLowerCase();

    // If it's Clara's email or contains 'clara' or 'demo', load full demo profile
    if (normalizedEmail.includes("clara") || normalizedEmail.includes("demo")) {
      saveUserSession(DEMO_VIP_USER);
      return { success: true };
    }

    // Otherwise create or restore customized profile
    const namePart = email.split("@")[0] || "Client";
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const loggedInUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: formattedName,
      firstName: formattedName,
      lastName: "",
      email: normalizedEmail,
      membershipTier: "Atelier Connoisseur",
      memberSince: "September 2026",
      addresses: [
        {
          id: "addr_default",
          isDefault: true,
          label: "Primary Residence",
          name: formattedName,
          street: "150 Central Park South",
          city: "New York",
          state: "NY",
          zip: "10019",
          country: "United States",
        },
      ],
      orders: [],
      privileges: [
        {
          id: "priv_welcome",
          title: "Atelier Welcome Privilege",
          description: "Enjoy 15% off and complimentary priority dispatch on your inaugural order.",
          code: "WELCOME15",
          status: "Active",
          expiresAt: "30 Days from Registration",
        },
      ],
    };

    saveUserSession(loggedInUser);
    return { success: true };
  };

  const register = async (name: string, email: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    const parts = name.trim().split(" ");
    const firstName = parts[0] || "Client";
    const lastName = parts.slice(1).join(" ") || "";

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      firstName,
      lastName,
      email: email.trim().toLowerCase(),
      membershipTier: "Atelier Connoisseur",
      memberSince: "September 2026",
      addresses: [
        {
          id: `addr_${Date.now()}`,
          isDefault: true,
          label: "Primary Residence",
          name: name.trim(),
          street: "740 Park Avenue",
          city: "New York",
          state: "NY",
          zip: "10021",
          country: "United States",
        },
      ],
      orders: [],
      privileges: [
        {
          id: "priv_welcome",
          title: "Inaugural Atelier Welcome",
          description: "15% off your first handcrafted silhouette and bespoke monogramming.",
          code: "WELCOME15",
          status: "Active",
          expiresAt: "Valid for 60 Days",
        },
      ],
    };

    saveUserSession(newUser);
    return { success: true };
  };

  const quickDemoLogin = () => {
    saveUserSession(DEMO_VIP_USER);
  };

  const logout = () => {
    saveUserSession(null);
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    saveUserSession(updated);
  };

  const addAddress = (newAddr: Omit<Address, "id">) => {
    if (!user) return;
    const id = `addr_${Date.now()}`;
    const address: Address = { ...newAddr, id };

    let updatedAddresses = [...user.addresses];
    if (address.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(address);

    updateProfile({ addresses: updatedAddresses });
  };

  const setDefaultAddress = (addressId: string) => {
    if (!user) return;
    const updatedAddresses = user.addresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    updateProfile({ addresses: updatedAddresses });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        quickDemoLogin,
        logout,
        updateProfile,
        addAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
