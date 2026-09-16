"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Crown,
  Package,
  Sparkles,
  MapPin,
  User,
  LogOut,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Clock,
  Phone,
  Plus,
  Check,
  CheckCircle2,
  Truck,
  Scissors,
} from "lucide-react";
import { useAuth, Address } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, updateProfile, addAddress, setDefaultAddress } = useAuth();
  const { showToast } = useUI();

  const [activeTab, setActiveTab] = useState<"orders" | "privileges" | "addresses" | "profile">("orders");

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // New Address modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: "Residence",
    name: "",
    street: "",
    city: "",
    state: "NY",
    zip: "",
    country: "United States",
    isDefault: false,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/account");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setNewAddr((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <main className="min-h-screen bg-[#FBF9F5] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-[0.2em] font-sans-clean text-[#7A6F62]">
            Accessing Atelier Vault...
          </p>
        </div>
      </main>
    );
  }

  const handleLogout = () => {
    logout();
    showToast("Signed out of VELORA Atelier", "info");
    router.push("/");
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      name: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
      email: profileForm.email,
      phone: profileForm.phone,
    });
    showToast("Atelier profile updated successfully", "success");
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city || !newAddr.zip) return;
    addAddress(newAddr);
    setIsAddressModalOpen(false);
    showToast("New delivery destination added", "success");
    setNewAddr({
      label: "Residence",
      name: user.name,
      street: "",
      city: "",
      state: "NY",
      zip: "",
      country: "United States",
      isDefault: false,
    });
  };

  return (
    <main className="min-h-screen bg-[#FBF9F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Luxury Member Header Banner */}
        <div className="bg-[#1A1410] text-[#F9F6F0] p-6 sm:p-10 border border-[#2E241E] shadow-xl relative overflow-hidden">
          {/* Subtle gold decorative background accent */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#DFD3C3] text-[10px] uppercase tracking-[0.25em] font-sans-clean font-semibold rounded-full">
                <Crown className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{user.membershipTier}</span>
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#F9F6F0]">
                Welcome, {user.firstName || user.name}
              </h1>
              <p className="text-xs text-[#C5B9AC] font-sans-clean">
                Member of the Florence Atelier Circle since {user.memberSince} • ID:{" "}
                <span className="font-mono text-[#DFD3C3]">{user.id}</span>
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="px-4 py-2.5 bg-[#C5A880] hover:bg-[#9A7B4F] text-[#191411] hover:text-white text-xs uppercase tracking-[0.16em] font-sans-clean font-semibold transition-colors cursor-pointer"
              >
                Browse Creations
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 border border-white/20 hover:border-white text-[#F9F6F0] text-xs uppercase tracking-[0.16em] font-sans-clean font-semibold transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-[#E8E1D5] overflow-x-auto no-scrollbar gap-2 sm:gap-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3 sm:py-4 px-2 text-xs uppercase tracking-[0.18em] font-sans-clean font-semibold flex items-center gap-2 relative shrink-0 cursor-pointer transition-colors ${
              activeTab === "orders" ? "text-[#191411]" : "text-[#8E8377] hover:text-[#191411]"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders &amp; Allocations ({user.orders.length})</span>
            {activeTab === "orders" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9A7B4F]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("privileges")}
            className={`py-3 sm:py-4 px-2 text-xs uppercase tracking-[0.18em] font-sans-clean font-semibold flex items-center gap-2 relative shrink-0 cursor-pointer transition-colors ${
              activeTab === "privileges" ? "text-[#191411]" : "text-[#8E8377] hover:text-[#191411]"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Atelier Privileges ({user.privileges.length})</span>
            {activeTab === "privileges" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9A7B4F]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`py-3 sm:py-4 px-2 text-xs uppercase tracking-[0.18em] font-sans-clean font-semibold flex items-center gap-2 relative shrink-0 cursor-pointer transition-colors ${
              activeTab === "addresses" ? "text-[#191411]" : "text-[#8E8377] hover:text-[#191411]"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Residences ({user.addresses.length})</span>
            {activeTab === "addresses" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9A7B4F]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3 sm:py-4 px-2 text-xs uppercase tracking-[0.18em] font-sans-clean font-semibold flex items-center gap-2 relative shrink-0 cursor-pointer transition-colors ${
              activeTab === "profile" ? "text-[#191411]" : "text-[#8E8377] hover:text-[#191411]"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Client Dossier</span>
            {activeTab === "profile" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9A7B4F]" />
            )}
          </button>
        </div>

        {/* Tab 1: Orders & Allocations */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {user.orders.length === 0 ? (
              <div className="bg-[#FAF8F5] border border-[#E8E1D5] p-12 text-center space-y-4">
                <Package className="w-12 h-12 text-[#C5B9AC] mx-auto" />
                <h3 className="font-serif-luxury text-2xl text-[#191411]">No Current Allocations</h3>
                <p className="text-xs text-[#7A6F62] font-sans-clean max-w-md mx-auto leading-relaxed">
                  Your atelier order ledger is currently serene. Explore our handcrafted Italian calfskin silhouettes to reserve your next piece.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-3 bg-[#191411] text-[#F9F6F0] hover:bg-[#9A7B4F] text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold transition-colors mt-2"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {user.orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#FAF8F5] border border-[#E8E1D5] p-6 sm:p-8 space-y-6 shadow-sm"
                  >
                    {/* Order Meta Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E1D5]">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-semibold text-[#191411]">
                            {order.id}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] font-sans-clean font-semibold rounded-full ${
                              order.status === "Delivered"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-[#C5A880]/25 text-[#7A6038]"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#7A6F62] font-sans-clean mt-1">
                          Placed on {order.date} • Courier: White-Glove Insured Air
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-[#9A7B4F] font-sans-clean font-semibold block">
                          Total Investment
                        </span>
                        <span className="font-serif-luxury text-2xl text-[#191411]">
                          ${order.total}
                        </span>
                      </div>
                    </div>

                    {/* Order Tracking Bar */}
                    <div className="bg-[#F5F1EB] p-4 border border-[#E8E1D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans-clean">
                      <div className="flex items-center gap-2.5 text-[#211A16]">
                        <Truck className="w-4 h-4 text-[#9A7B4F]" />
                        <span>
                          Tracking Identifier:{" "}
                          <span className="font-mono font-medium text-[#191411]">
                            {order.trackingNumber}
                          </span>
                        </span>
                      </div>
                      <span className="text-[11px] text-[#7A6F62]">
                        Direct Florence Dispatch • Signature Required
                      </span>
                    </div>

                    {/* Order Line Items */}
                    <div className="divide-y divide-[#E8E1D5]">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 relative bg-[#EBE4DA] shrink-0 overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-serif-luxury text-base text-[#191411]">
                                {item.name}
                              </h4>
                              <p className="text-xs text-[#7A6F62] font-sans-clean">
                                Shade: {item.color} • Qty: {item.quantity}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-serif-luxury text-base text-[#191411]">
                              ${item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Atelier Privileges */}
        {activeTab === "privileges" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {user.privileges.map((priv) => (
              <div
                key={priv.id}
                className="bg-[#FAF8F5] border border-[#C5A880]/40 p-6 sm:p-8 space-y-5 flex flex-col justify-between hover:border-[#9A7B4F] transition-all shadow-sm"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#C5A880]/15 text-[#9A7B4F] flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-sans-clean font-semibold px-2 py-0.5 bg-[#C5A880]/20 text-[#7A6038] rounded-full">
                      {priv.status}
                    </span>
                    <span className="text-[10px] text-[#8E8377] font-sans-clean">
                      {priv.expiresAt}
                    </span>
                  </div>
                  <h3 className="font-serif-luxury text-xl text-[#191411] leading-snug">
                    {priv.title}
                  </h3>
                  <p className="text-xs text-[#7A6F62] font-sans-clean leading-relaxed">
                    {priv.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8E1D5] flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[#191411] bg-[#F5F1EB] px-2.5 py-1 border border-[#D8CEBF]">
                    {priv.code}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(priv.code);
                      showToast(`Copied code: ${priv.code}`, "success");
                    }}
                    className="text-[11px] uppercase tracking-[0.14em] font-sans-clean text-[#9A7B4F] hover:text-[#191411] font-semibold cursor-pointer"
                  >
                    Copy Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Saved Residences */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#7A6F62] font-sans-clean">
                Manage your confidential shipping destinations for insured white-glove arrival.
              </p>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="px-4 py-2 bg-[#191411] hover:bg-[#9A7B4F] text-[#F9F6F0] text-xs uppercase tracking-[0.16em] font-sans-clean font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Residence</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-6 bg-[#FAF8F5] border ${
                    addr.isDefault ? "border-[#9A7B4F] ring-1 ring-[#9A7B4F]" : "border-[#E8E1D5]"
                  } space-y-4 relative`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#9A7B4F]" />
                      <h4 className="font-serif-luxury text-lg text-[#191411]">
                        {addr.label}
                      </h4>
                    </div>
                    {addr.isDefault ? (
                      <span className="px-2 py-0.5 bg-[#9A7B4F] text-white text-[9px] uppercase tracking-[0.16em] font-sans-clean font-semibold rounded-full">
                        Primary
                      </span>
                    ) : (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[11px] text-[#9A7B4F] hover:underline cursor-pointer font-sans-clean"
                      >
                        Set as Primary
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-[#554C42] font-sans-clean leading-relaxed">
                    <p className="font-medium text-[#191411]">{addr.name}</p>
                    <p>{addr.street}</p>
                    <p>
                      {addr.city}, {addr.state} {addr.zip}
                    </p>
                    <p>{addr.country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Client Dossier */}
        {activeTab === "profile" && (
          <div className="bg-[#FAF8F5] border border-[#E8E1D5] p-6 sm:p-10 max-w-2xl">
            <div className="space-y-2 mb-6">
              <h3 className="font-serif-luxury text-2xl text-[#191411]">
                Atelier Client Dossier
              </h3>
              <p className="text-xs text-[#7A6F62] font-sans-clean">
                Your credentials and communication preferences are kept in strict confidentiality.
              </p>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-clean font-semibold text-[#52483E] mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.firstName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-white border border-[#D8CEBF] text-xs font-sans-clean text-[#191411] focus:outline-none focus:border-[#9A7B4F]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-clean font-semibold text-[#52483E] mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-white border border-[#D8CEBF] text-xs font-sans-clean text-[#191411] focus:outline-none focus:border-[#9A7B4F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-clean font-semibold text-[#52483E] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-[#D8CEBF] text-xs font-sans-clean text-[#191411] focus:outline-none focus:border-[#9A7B4F]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-clean font-semibold text-[#52483E] mb-1.5">
                  Concierge Contact Telephone
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  placeholder="+1 (212) 555-0198"
                  className="w-full px-3 py-2.5 bg-white border border-[#D8CEBF] text-xs font-sans-clean text-[#191411] focus:outline-none focus:border-[#9A7B4F]"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#191411] text-[#F9F6F0] hover:bg-[#9A7B4F] text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold transition-colors cursor-pointer"
                >
                  Save Dossier Updates
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] border border-[#E8E1D5] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="space-y-1">
              <h3 className="font-serif-luxury text-2xl text-[#191411]">
                Add Confidential Residence
              </h3>
              <p className="text-xs text-[#7A6F62] font-sans-clean">
                Enter destination particulars for white-glove arrival.
              </p>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-clean font-semibold text-[#52483E] mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={newAddr.label}
                    onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                    placeholder="e.g. City Villa"
                    required
                    className="w-full px-3 py-2 bg-white border border-[#D8CEBF] text-xs font-sans-clean text-[#191411]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-clean font-semibold text-[#52483E] mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-white border border-[#D8CEBF] text-xs font-sans-clean text-[#191411]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-clean font-semibold text-[#52483E] mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  placeholder="e.g. 10 Downing Street"
                  required
                  className="w-full px-3 py-2 bg-white border border-[#D8CEBF] text-xs font-sans-clean text-[#191411]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-clean font-semibold text-[#52483E] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-white border border-[#D8CEBF] text-xs font-sans-clean text-[#191411]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-clean font-semibold text-[#52483E] mb-1">
                    State / Prov
                  </label>
                  <input
                    type="text"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-white border border-[#D8CEBF] text-xs font-sans-clean text-[#191411]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-sans-clean font-semibold text-[#52483E] mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={newAddr.zip}
                    onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-white border border-[#D8CEBF] text-xs font-sans-clean text-[#191411]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-sans-clean text-[#554C42] pt-1">
                <input
                  type="checkbox"
                  checked={newAddr.isDefault}
                  onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                  className="accent-[#9A7B4F]"
                />
                <span>Set as primary delivery residence</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 py-2.5 border border-[#D8CEBF] text-xs font-sans-clean font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#191411] text-[#F9F6F0] hover:bg-[#9A7B4F] text-xs font-sans-clean font-semibold uppercase tracking-wider transition-colors"
                >
                  Save Residence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
