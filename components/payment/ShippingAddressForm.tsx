'use client';

import React, { useState } from 'react';
import { MapPin, Home, Briefcase, Plus, Check, Phone, User, Building, Compass, Hash, Globe, FileText } from 'lucide-react';
import MuiSelect from '@/components/ui/MuiSelect';
import { INDIAN_STATES_AND_DISTRICTS, StateItem } from '@/lib/data/indianStatesDistricts';

const COUNTRY_OPTIONS = [
  { value: 'United States', label: 'United States' },
  { value: 'India', label: 'India' },
  { value: 'Canada', label: 'Canada' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Germany', label: 'Germany' },
];

export interface ShippingAddressData {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: 'home' | 'work' | 'other';
  notes?: string;
}

interface ShippingAddressFormProps {
  address: ShippingAddressData;
  onChange: (updated: ShippingAddressData) => void;
}

const PRESET_ADDRESSES: ShippingAddressData[] = [
  {
    full_name: 'Alex Johnson',
    phone: '+1 (555) 234-5678',
    address_line1: '742 Evergreen Terrace',
    address_line2: 'Apt 4B',
    city: 'San Francisco',
    state: 'California',
    postal_code: '94107',
    country: 'United States',
    address_type: 'home',
    notes: 'Please leave package at the front porch.',
  },
  {
    full_name: 'Alex Johnson (Tech HQ)',
    phone: '+1 (555) 987-6543',
    address_line1: '100 Innovation Way',
    address_line2: 'Suite 1200 - Tower A',
    city: 'San Jose',
    state: 'California',
    postal_code: '95113',
    country: 'United States',
    address_type: 'work',
    notes: 'Deliver during business hours (9 AM - 5 PM).',
  },
];

export default function ShippingAddressForm({ address, onChange }: ShippingAddressFormProps) {
  const [selectedPreset, setSelectedPreset] = useState<number | 'new'>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleSelectPreset = (index: number) => {
    setSelectedPreset(index);
    onChange(PRESET_ADDRESSES[index]);
    setIsEditing(false);
  };

  const handleCustomFormChange = (field: keyof ShippingAddressData, value: string) => {
    onChange({
      ...address,
      [field]: value,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-semibold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-title">
              Delivery Address
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select or enter where you want your order delivered
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedPreset('new');
            setIsEditing(true);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Preset Addresses Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {PRESET_ADDRESSES.map((preset, index) => {
          const isSelected = selectedPreset === index && !isEditing;
          const Icon = preset.address_type === 'home' ? Home : Briefcase;

          return (
            <div
              key={index}
              onClick={() => handleSelectPreset(index)}
              className={`relative rounded-xl p-4 cursor-pointer border transition-all duration-200 ${
                isSelected
                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {preset.address_type}
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {preset.full_name}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {preset.address_line1}, {preset.address_line2 ? `${preset.address_line2}, ` : ''}
                  {preset.city}, {preset.state} {preset.postal_code}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {preset.phone}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual / Editing Form */}
      {(isEditing || selectedPreset === 'new') && (
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Shipping Contact Details
            </h3>
            <span className="text-xs text-slate-400">All fields required</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={address.full_name}
                  onChange={(e) => handleCustomFormChange('full_name', e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) => handleCustomFormChange('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Street Address Line 1 */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Street Address Line 1
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={address.address_line1}
                  onChange={(e) => handleCustomFormChange('address_line1', e.target.value)}
                  placeholder="House No., Street Name, Landmark"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Address Line 2 */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Apartment, Suite, Unit (Optional)
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={address.address_line2 || ''}
                  onChange={(e) => handleCustomFormChange('address_line2', e.target.value)}
                  placeholder="Apt 4B, Building 2"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                State / Province
              </label>
              {(() => {
                const stateOptions = [
                  { value: '', label: 'Select State *' },
                  ...INDIAN_STATES_AND_DISTRICTS.map((s: StateItem) => ({
                    value: s.state,
                    label: s.state,
                  })),
                ];

                if (
                  address.state &&
                  !stateOptions.some(
                    (opt) => opt.value.toLowerCase() === address.state.toLowerCase()
                  )
                ) {
                  stateOptions.splice(1, 0, {
                    value: address.state,
                    label: address.state,
                  });
                }

                return (
                  <MuiSelect
                    value={address.state}
                    onChange={(e) => {
                      const selectedState = String(e.target.value);
                      onChange({
                        ...address,
                        state: selectedState,
                        city: '',
                      });
                    }}
                    options={stateOptions}
                  />
                );
              })()}
            </div>

            {/* City / District Selector based on selected State */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                City / District
              </label>
              {(() => {
                const matchedState = INDIAN_STATES_AND_DISTRICTS.find(
                  (s: StateItem) => s.state.toLowerCase() === (address.state || '').toLowerCase()
                );
                const districts = matchedState ? matchedState.districts : [];

                if (districts.length > 0) {
                  const cityOptions = [
                    {
                      value: '',
                      label: 'Select City / District *',
                    },
                    ...districts.map((d: string) => ({ value: d, label: d })),
                  ];

                  if (
                    address.city &&
                    !cityOptions.some(
                      (opt) => opt.value.toLowerCase() === address.city.toLowerCase()
                    )
                  ) {
                    cityOptions.splice(1, 0, {
                      value: address.city,
                      label: address.city,
                    });
                  }

                  return (
                    <MuiSelect
                      value={address.city}
                      disabled={!address.state}
                      onChange={(e) => handleCustomFormChange('city', String(e.target.value))}
                      options={cityOptions}
                    />
                  );
                }

                if (!address.state) {
                  return (
                    <MuiSelect
                      value=""
                      disabled
                      onChange={() => {}}
                      options={[{ value: '', label: 'Select State First *' }]}
                    />
                  );
                }

                return (
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => handleCustomFormChange('city', e.target.value)}
                    placeholder="e.g. San Francisco"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                );
              })()}
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Postal / Zip Code
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={address.postal_code}
                  onChange={(e) => handleCustomFormChange('postal_code', e.target.value)}
                  placeholder="94107"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Country (MUI Dropdown)
              </label>
              <MuiSelect
                value={address.country || 'United States'}
                onChange={(e) => handleCustomFormChange('country', String(e.target.value))}
                options={COUNTRY_OPTIONS}
                maxWidth="240px"
              />
            </div>

            {/* Special Instructions */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Delivery Notes (Optional)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  value={address.notes || ''}
                  onChange={(e) => handleCustomFormChange('notes', e.target.value)}
                  placeholder="Gate code, landmark, or specific instructions for delivery driver..."
                  rows={2}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
