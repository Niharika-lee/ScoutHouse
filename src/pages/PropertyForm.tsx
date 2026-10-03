import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ImagePlus, X, AlertCircle, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  propertyTypes, furnishedOptions, genderOptions, availabilityOptions,
  furnitureChecklistItems, maxBudgetDefault,
} from '@/data/properties';
import type { Property, PropertyType, FurnishedStatus, GenderPreference, Availability, HouseRules, AgreementTerms } from '@/types';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'login' | 'signup' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

interface PropertyFormProps {
  onNavigate: (page: Page, params?: Record<string, string>) => void;
  editId?: string;
}

function resizeImage(file: File, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height / width) * maxDim);
            width = maxDim;
          } else {
            width = Math.round((width / height) * maxDim);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not available')); return; }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function safeStr(v: string): string { return v || ''; }
function safeNum(v: string): number { const n = Number(v); return isNaN(n) ? 0 : n; }

export function PropertyForm({ onNavigate, editId }: PropertyFormProps) {
  const { user, ownerProperties, addOwnerProperty, updateOwnerProperty } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existing = editId ? ownerProperties.find((p) => p.id === editId) : null;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [area, setArea] = useState(existing?.area ?? '');
  const [city, setCity] = useState(existing?.city ?? '');
  const [type, setType] = useState<PropertyType>(existing?.type ?? 'PG');
  const [rent, setRent] = useState(existing ? String(existing.rent) : '');
  const [deposit, setDeposit] = useState(existing ? String(existing.deposit) : '');
  const [maintenance, setMaintenance] = useState(existing ? String(existing.maintenance) : '');
  const [electricity, setElectricity] = useState(existing ? String(existing.electricityEstimate) : '');
  const [water, setWater] = useState(existing ? String(existing.waterEstimate) : '');
  const [wifi, setWifi] = useState(existing ? String(existing.internetCost) : '');
  const [food, setFood] = useState(existing ? String(existing.foodCost) : '');
  const [furnished, setFurnished] = useState<FurnishedStatus>(existing?.furnished ?? 'Furnished');
  const [gender, setGender] = useState<GenderPreference>(existing?.genderPreference ?? 'Any');
  const [availability, setAvailability] = useState<Availability>(existing?.availability ?? 'Available Now');
  const [noticePeriod, setNoticePeriod] = useState(existing?.agreementTerms.noticePeriod ?? '1 month');
  const [lockIn, setLockIn] = useState(existing?.agreementTerms.lockInPeriod ?? '3 months');
  const [agreementType, setAgreementType] = useState(existing?.agreementTerms.agreementType ?? 'Rental agreement (11 months)');
  const [nearestCollege, setNearestCollege] = useState(existing?.nearestCollege ?? '');
  const [distanceKm, setDistanceKm] = useState(existing ? String(existing.distanceKm) : '');
  const [travelTime, setTravelTime] = useState(existing?.travelTimeEstimate ?? '');
  const [rulesVisitors, setRulesVisitors] = useState(existing?.houseRules.visitors ?? 'Visitors allowed');
  const [rulesCurfew, setRulesCurfew] = useState(existing?.houseRules.curfew ?? 'No curfew');
  const [rulesSmoking, setRulesSmoking] = useState(existing?.houseRules.smokingAlcohol ?? 'Not allowed');
  const [rulesPets, setRulesPets] = useState(existing?.houseRules.pets ?? 'Not allowed');
  const [rulesCooking, setRulesCooking] = useState(existing?.houseRules.cooking ?? 'Allowed');
  const [rulesGuestStay, setRulesGuestStay] = useState(existing?.houseRules.guestStay ?? 'Guests can stay up to 3 days');
  const [transport, setTransport] = useState(existing?.nearbyTransport.join(', ') ?? '');
  const [images, setImages] = useState<string[]>(existing?.images ?? []);
  const [imageUrl, setImageUrl] = useState('');
  const [facilities, setFacilities] = useState<string[]>(existing?.furnitureIncluded ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) onNavigate('login');
  }, [user, onNavigate]);

  if (!user) return null;

  const toggleFacility = (item: string) => {
    setFacilities((prev) => prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item]);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (images.length + files.length > 5) {
      setErrors({ images: 'You can upload up to 5 images' });
      return;
    }
    setUploading(true);
    try {
      const resized: string[] = [];
      for (const file of Array.from(files)) {
        if (images.length + resized.length >= 5) break;
        const dataUrl = await resizeImage(file, 800);
        resized.push(dataUrl);
      }
      setImages((prev) => [...prev, ...resized]);
      setErrors((prev) => { const c = { ...prev }; delete c.images; return c; });
    } catch {
      setErrors({ images: 'Failed to process image. Try a different file.' });
    } finally {
      setUploading(false);
    }
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) return;
    if (images.length >= 5) { setErrors({ images: 'You can upload up to 5 images' }); return; }
    setImages((prev) => [...prev, imageUrl.trim()]);
    setImageUrl('');
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!description.trim()) e.description = 'Description is required';
    if (!area.trim()) e.area = 'Area is required';
    if (!city.trim()) e.city = 'City is required';
    if (!rent.trim() || safeNum(rent) <= 0) e.rent = 'Enter a valid rent amount';
    if (!deposit.trim() || safeNum(deposit) < 0) e.deposit = 'Enter a valid deposit amount';
    if (!nearestCollege.trim()) e.nearestCollege = 'Nearest college is required';
    if (!distanceKm.trim() || safeNum(distanceKm) <= 0) e.distanceKm = 'Enter distance in km';
    if (!travelTime.trim()) e.travelTime = 'Travel time is required';
    if (images.length === 0) e.images = 'Add at least one image';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const transportArr = transport.split(',').map((t) => t.trim()).filter(Boolean);

    const houseRules: HouseRules = {
      visitors: rulesVisitors,
      curfew: rulesCurfew,
      smokingAlcohol: rulesSmoking,
      pets: rulesPets,
      cooking: rulesCooking,
      guestStay: rulesGuestStay,
    };

    const agreementTerms: AgreementTerms = {
      noticePeriod,
      lockInPeriod: lockIn,
      agreementType,
    };

    const amenities: string[] = [];
    const facLower = facilities.map((f) => f.toLowerCase());
    if (facLower.some((f) => f.includes('wi-fi'))) amenities.push('Wi-Fi');
    if (facLower.some((f) => f.includes('power backup'))) amenities.push('Power Backup');
    if (facLower.some((f) => f.includes('parking'))) amenities.push('Parking');
    if (facLower.some((f) => f.includes('ac'))) amenities.push('AC');
    if (facLower.some((f) => f.includes('fridge'))) amenities.push('Refrigerator');
    if (facLower.some((f) => f.includes('washing machine'))) amenities.push('Washing Machine');
    if (facLower.some((f) => f.includes('geyser') || f.includes('hot water'))) amenities.push('Hot Water 24/7');

    const id = existing?.id ?? `owner-${Date.now()}`;

    const property: Property = {
      id,
      title: title.trim(),
      area: area.trim(),
      city: city.trim(),
      type,
      rent: safeNum(rent),
      deposit: safeNum(deposit),
      maintenance: safeNum(maintenance),
      furnished,
      distanceKm: safeNum(distanceKm),
      nearestCollege: nearestCollege.trim(),
      nearbyTransport: transportArr.length > 0 ? transportArr : ['Not specified'],
      amenities: amenities.length > 0 ? amenities : ['Not specified'],
      furnitureIncluded: facilities,
      genderPreference: gender,
      availability,
      lastUpdated: today,
      description: description.trim(),
      images,
      electricityEstimate: safeNum(electricity),
      waterEstimate: safeNum(water),
      internetCost: safeNum(wifi),
      foodCost: safeNum(food),
      brokerage: 0,
      travelTimeEstimate: travelTime.trim(),
      photosLastUpdated: today,
      houseRules,
      agreementTerms,
      tenantReviews: existing?.tenantReviews ?? [],
      similarPropertyIds: existing?.similarPropertyIds ?? [],
      isOwnerPosted: true,
      ownerEmail: user.email,
    };

    if (existing) updateOwnerProperty(property);
    else addOwnerProperty(property);

    onNavigate('owner-dashboard');
  };

  const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400';
  const labelCls = 'mb-1.5 block text-sm font-medium text-slate-700';
  const errorCls = 'mt-1 text-xs text-red-500';

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => onNavigate('owner-dashboard')}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </button>

      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        {existing ? 'Edit property' : 'Post a new property'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
        {/* Basic info */}
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-slate-900">Basic information</legend>

          <div>
            <label className={labelCls} htmlFor="title">Title *</label>
            <input id="title" className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Cozy PG near Christ University" />
            {errors.title && <p className={errorCls}>{errors.title}</p>}
          </div>

          <div>
            <label className={labelCls} htmlFor="description">Description *</label>
            <textarea id="description" className={`${inputCls} resize-none`} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the property..." />
            {errors.description && <p className={errorCls}>{errors.description}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="area">Area *</label>
              <input id="area" className={inputCls} value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Koramangala" />
              {errors.area && <p className={errorCls}>{errors.area}</p>}
            </div>
            <div>
              <label className={labelCls} htmlFor="city">City *</label>
              <input id="city" className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Bengaluru" />
              {errors.city && <p className={errorCls}>{errors.city}</p>}
            </div>
          </div>

          <div>
            <label className={labelCls} htmlFor="type">Property type</label>
            <select id="type" className={inputCls} value={type} onChange={(e) => setType(e.target.value as PropertyType)}>
              {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </fieldset>

        {/* Cost details */}
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-slate-900">Cost details (in ₹)</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="rent">Monthly rent *</label>
              <input id="rent" type="number" className={inputCls} value={rent} onChange={(e) => setRent(e.target.value)} placeholder="8500" />
              {errors.rent && <p className={errorCls}>{errors.rent}</p>}
            </div>
            <div>
              <label className={labelCls} htmlFor="deposit">Deposit *</label>
              <input id="deposit" type="number" className={inputCls} value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="17000" />
              {errors.deposit && <p className={errorCls}>{errors.deposit}</p>}
            </div>
            <div>
              <label className={labelCls} htmlFor="maintenance">Maintenance</label>
              <input id="maintenance" type="number" className={inputCls} value={maintenance} onChange={(e) => setMaintenance(e.target.value)} placeholder="500" />
            </div>
            <div>
              <label className={labelCls} htmlFor="electricity">Electricity (est.)</label>
              <input id="electricity" type="number" className={inputCls} value={electricity} onChange={(e) => setElectricity(e.target.value)} placeholder="500" />
            </div>
            <div>
              <label className={labelCls} htmlFor="water">Water (est.)</label>
              <input id="water" type="number" className={inputCls} value={water} onChange={(e) => setWater(e.target.value)} placeholder="100" />
            </div>
            <div>
              <label className={labelCls} htmlFor="wifi">Wi-Fi (est.)</label>
              <input id="wifi" type="number" className={inputCls} value={wifi} onChange={(e) => setWifi(e.target.value)} placeholder="300" />
            </div>
            <div>
              <label className={labelCls} htmlFor="food">Food (optional)</label>
              <input id="food" type="number" className={inputCls} value={food} onChange={(e) => setFood(e.target.value)} placeholder="2500" />
            </div>
          </div>
        </fieldset>

        {/* Property details */}
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-slate-900">Property details</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="furnished">Furnished status</label>
              <select id="furnished" className={inputCls} value={furnished} onChange={(e) => setFurnished(e.target.value as FurnishedStatus)}>
                {furnishedOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="gender">Gender preference</label>
              <select id="gender" className={inputCls} value={gender} onChange={(e) => setGender(e.target.value as GenderPreference)}>
                {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="availability">Availability</label>
              <select id="availability" className={inputCls} value={availability} onChange={(e) => setAvailability(e.target.value as Availability)}>
                {availabilityOptions.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="nearestCollege">Nearest college *</label>
              <input id="nearestCollege" className={inputCls} value={nearestCollege} onChange={(e) => setNearestCollege(e.target.value)} placeholder="e.g. Christ University" />
              {errors.nearestCollege && <p className={errorCls}>{errors.nearestCollege}</p>}
            </div>
            <div>
              <label className={labelCls} htmlFor="distanceKm">Distance (km) *</label>
              <input id="distanceKm" type="number" step="0.1" className={inputCls} value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} placeholder="1.5" />
              {errors.distanceKm && <p className={errorCls}>{errors.distanceKm}</p>}
            </div>
          </div>

          <div>
            <label className={labelCls} htmlFor="travelTime">Travel time *</label>
            <input id="travelTime" className={inputCls} value={travelTime} onChange={(e) => setTravelTime(e.target.value)} placeholder="e.g. 10 min walk" />
            {errors.travelTime && <p className={errorCls}>{errors.travelTime}</p>}
          </div>
        </fieldset>

        {/* Agreement terms */}
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-slate-900">Agreement terms</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="noticePeriod">Notice period</label>
              <input id="noticePeriod" className={inputCls} value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)} placeholder="1 month" />
            </div>
            <div>
              <label className={labelCls} htmlFor="lockIn">Lock-in period</label>
              <input id="lockIn" className={inputCls} value={lockIn} onChange={(e) => setLockIn(e.target.value)} placeholder="3 months" />
            </div>
            <div>
              <label className={labelCls} htmlFor="agreementType">Agreement type</label>
              <input id="agreementType" className={inputCls} value={agreementType} onChange={(e) => setAgreementType(e.target.value)} placeholder="Rental agreement" />
            </div>
          </div>
        </fieldset>

        {/* House rules */}
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-slate-900">House rules</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="rulesVisitors">Visitors</label>
              <input id="rulesVisitors" className={inputCls} value={rulesVisitors} onChange={(e) => setRulesVisitors(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="rulesCurfew">Curfew</label>
              <input id="rulesCurfew" className={inputCls} value={rulesCurfew} onChange={(e) => setRulesCurfew(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="rulesSmoking">Smoking &amp; alcohol</label>
              <input id="rulesSmoking" className={inputCls} value={rulesSmoking} onChange={(e) => setRulesSmoking(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="rulesPets">Pets</label>
              <input id="rulesPets" className={inputCls} value={rulesPets} onChange={(e) => setRulesPets(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="rulesCooking">Cooking</label>
              <input id="rulesCooking" className={inputCls} value={rulesCooking} onChange={(e) => setRulesCooking(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="rulesGuestStay">Guest stay</label>
              <input id="rulesGuestStay" className={inputCls} value={rulesGuestStay} onChange={(e) => setRulesGuestStay(e.target.value)} />
            </div>
          </div>
        </fieldset>

        {/* Nearby transport */}
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-slate-900">Nearby transport</legend>
          <div>
            <label className={labelCls} htmlFor="transport">Transport options (comma-separated)</label>
            <input id="transport" className={inputCls} value={transport} onChange={(e) => setTransport(e.target.value)} placeholder="e.g. Bus Stop (200m), Metro Station (2km)" />
          </div>
        </fieldset>

        {/* Facilities */}
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-slate-900">Furniture &amp; facilities</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {furnitureChecklistItems.map((item) => {
              const checked = facilities.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleFacility(item)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition ${
                    checked ? 'border-teal-300 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {checked ? <Check className="h-4 w-4 shrink-0 text-teal-600" /> : <div className="h-4 w-4 shrink-0 rounded border-2 border-slate-300" />}
                  {item}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Images */}
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-slate-900">Images (up to 5) *</legend>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt={`Property image ${i + 1}`} className="h-24 w-32 rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || images.length >= 5}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <ImagePlus className="h-4 w-4" />
              {uploading ? 'Processing...' : 'Upload image'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            <div className="flex flex-1 items-center gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste an image URL"
                className={inputCls}
              />
              <button
                type="button"
                onClick={addImageUrl}
                disabled={!imageUrl.trim() || images.length >= 5}
                className="shrink-0 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
          {errors.images && <p className={errorCls}>{errors.images}</p>}
          <p className="text-xs text-slate-400">Images are automatically resized to max 800px and stored locally in your browser.</p>
        </fieldset>

        {/* Submit */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onNavigate('owner-dashboard')}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-blue-200"
          >
            {existing ? 'Save changes' : 'Post property'}
          </button>
        </div>
      </form>
    </div>
  );
}
