import { Header } from "../../../components";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import type { Route } from './+types/create-trip'
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "~/lib/utils";
import { LayerDirective, LayersDirective, MapsComponent } from "@syncfusion/ej2-react-maps";
import React, { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";

interface Country {
    name: string;
    coordinates: [number, number];
    value: string;
    openStreetMap: string;
}

interface TripFormData {
    country: string;
    travelStyle: string;
    interest: string;
    budget: string;
    duration: number;
    groupType: string;
}

export const loader = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/independent?status=true');
        const data = await response.json();
        return {
            countries: Array.isArray(data) ? data.map((country: any) => ({
                name: country.flag + " " + country.name.common,
                coordinates: country.latlng,
                value: country.name.common,
                openStreetMap: country.maps?.openStreetMap,
            })) : []
        };
    } catch (e) {
        console.error("Loader fetch error:", e);
        return { countries: [] };
    }
}

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
    const { countries } = (loaderData as { countries: Country[] }) || { countries: [] };
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<TripFormData>({
        country: '',
        travelStyle: '',
        interest: '',
        budget: '',
        duration: 0,
        groupType: ''
    });

    const handleChange = (key: keyof TripFormData, value: string | number) => {
        setError(null);
        setFormData({ ...formData, [key]: value });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.country || !formData.travelStyle || !formData.interest || !formData.budget || !formData.groupType || formData.duration === 0) {
            setError('Please complete all fields to generate your itinerary.');
            setLoading(false);
            return;
        }

        try {
            const user = await account.get();
            const response = await fetch('/api/create-trip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    interests: formData.interest,
                    numberOfDays: formData.duration,
                    userId: user.$id
                })
            });

            const result = await response.json();
            if (result?.id) {
                navigate(`/trips/${result.id}`);
            } else {
                setError(result?.error || 'Failed to generate a trip');
            }
        } catch (e) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const mapData = [{
        country: formData.country,
        color: '#3B82F6', // Using a nice primary blue
        coordinates: countries.find(c => c.value === formData.country)?.coordinates || []
    }];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <main className="max-w-5xl mx-auto px-6">
                <Header
                    title="Plan Your Next Adventure"
                    description="Our AI will craft a personalized itinerary based on your preferences."
                />

                <div className="mt-10 bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                    <form className="p-8 md:p-12 space-y-10" onSubmit={handleSubmit}>

                        {/* Section 1: Destination & Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-bold uppercase tracking-widest text-slate-500">Destination</label>
                                <ComboBoxComponent
                                    dataSource={countries.map(c => ({ text: c.name, value: c.value }))}
                                    fields={{ text: 'text', value: 'value' }}
                                    placeholder="Choose a country"
                                    change={(e: any) => handleChange('country', e.value)}
                                    allowFiltering={true}
                                    cssClass="e-outline custom-select-height"
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-bold uppercase tracking-widest text-slate-500">Duration (Days)</label>
                                <input
                                    type="number"
                                    placeholder="How long? (e.g. 5)"
                                    className="w-full h-[40px] px-4 rounded-lg border border-slate-300 bg-white transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-700"
                                    min={1}
                                    max={14}
                                    onChange={(e) => handleChange('duration', Number(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* Section 2: Preferences */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {selectItems.map((key) => (
                                <div key={key} className="flex flex-col gap-4">
                                    <label className="text-sm font-bold uppercase tracking-widest text-slate-500">{formatKey(key)}</label>
                                    <ComboBoxComponent
                                        dataSource={comboBoxItems[key as keyof typeof comboBoxItems].map(i => ({ text: i, value: i }))}
                                        fields={{ text: 'text', value: 'value' }}
                                        placeholder={`Select ${formatKey(key)}`}
                                        change={(e: any) => handleChange(key as keyof TripFormData, e.value)}
                                        cssClass="e-outline custom-select-height"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Visual Context: Map */}
                        <div className="w-full h-[350px] rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                            <MapsComponent height="100%" width="100%" background="transparent" zoomSettings={{ enable: false }}>
                                <LayersDirective>
                                    <LayerDirective
                                        shapeData={world_map}
                                        dataSource={mapData}
                                        shapeDataPath="country"
                                        shapePropertyPath="name"
                                        shapeSettings={{
                                            fill: "#E2E8F0",
                                            colorValuePath: 'color'
                                        }}
                                    />
                                </LayersDirective>
                            </MapsComponent>
                        </div>

                        {/* Feedback & Actions */}
                        <div className="space-y-6 pt-4">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100 animate-pulse">
                                    {error}
                                </div>
                            )}

                            <ButtonComponent
                                type="submit"
                                className="!bg-slate-900 !text-white !h-16 !w-full !rounded-2xl !text-lg !font-bold hover:!bg-slate-800 transition-all shadow-xl disabled:opacity-70"
                                disabled={loading}
                            >
                                <div className="flex items-center justify-center gap-3">
                                    {loading ? (
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <img src="/assets/icons/magic-star.svg" className="size-5 invert" alt="magic" />
                                    )}
                                    <span>{loading ? 'Curating Your Experience...' : 'Create My Itinerary'}</span>
                                </div>
                            </ButtonComponent>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default CreateTrip;

