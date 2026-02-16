"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Binoculars, Anchor, Trees, Bird, Info } from 'lucide-react';

// Correction de l'icône par défaut de Leaflet qui casse souvent en Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom markers colors for our aesthetic
const createCustomIcon = (color: string) => {
    return L.divIcon({
        className: 'custom-leaflet-icon',
        html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });
};

const ICONS = {
    turquoise: createCustomIcon('#2DD4BF'),
    abysse: createCustomIcon('#1E293B'),
    green: createCustomIcon('#16A34A'),
    orange: createCustomIcon('#F97316')
};

export interface ObservationPoint {
    id: string;
    title: string;
    type: string;
    icon: React.ReactNode;
    desc: string;
    tip: string;
    position: [number, number];
    images?: string[];
}

const OBSERVATIONS: ObservationPoint[] = [
    {
        id: 'phoques',
        title: 'Colonie de Phoques',
        type: 'Faune',
        icon: <Binoculars size={20} className="text-turquoise" />,
        desc: "Une colonie de phoques veau-marin réside au cœur du havre. Ils sont particulièrement visibles à marée basse sur les bancs de sable.",
        tip: "L'observation doit se faire à plus de 300m pour ne pas perturber leur repos. Utilisez des jumelles !",
        position: [49.021, -1.564]
    },
    {
        id: 'phare',
        title: 'Phare d\'Agon',
        type: 'Patrimoine',
        icon: <Anchor size={20} className="text-abysse" />,
        desc: "Sentinelle emblématique marquant l'entrée du havre. Il guide les navigateurs depuis 1856.",
        tip: "Le coucher de soleil depuis le phare offre une vue imprenable sur l'archipel des Écréhou.",
        position: [49.0272, -1.5748]
    },
    {
        id: 'pres-sales',
        title: 'Les Prés-Salés',
        type: 'Flore',
        icon: <Trees size={20} className="text-green-600" />,
        desc: "Écosystème rare où pousse la salicorne et le lilas de mer. Recouvert uniquement lors des grandes marées.",
        tip: "C'est ici que l'on récolte la célèbre salicorne de Coutainville en début d'été.",
        position: [49.035, -1.550]
    },
    {
        id: 'oiseaux',
        title: 'Zone Ornithologique',
        type: 'Faune',
        icon: <Bird size={20} className="text-orange-500" />,
        desc: "Escale majeure pour les oiseaux migrateurs comme la Bernache Cravant ou le Tadorne de Belon.",
        tip: "Le calme est de rigueur pour observer les limicoles fouillant la vase.",
        position: [49.030, -1.570]
    }
];

interface NatureMapProps {
    observations: ObservationPoint[];
    onSelectPoint: (point: ObservationPoint) => void;
    activePointId?: string;
}

const MapController = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
};

export const NatureMap: React.FC<NatureMapProps> = ({ observations, onSelectPoint, activePointId }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
            <span className="text-slate-400 text-sm">Chargement de la carte...</span>
        </div>;
    }

    return (
        <MapContainer
            key="nature-map-v2"
            center={[49.028, -1.565]}
            zoom={14}
            className="w-full h-full z-0"
            scrollWheelZoom={false}
        >
            <MapController center={[49.028, -1.565]} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {observations.map((point) => (
                <Marker
                    key={point.id}
                    position={point.position}
                    icon={
                        (point.type?.toLowerCase() === 'faune' || point.id === 'phoques') ? ICONS.turquoise :
                            (point.type?.toLowerCase() === 'patrimoine' || point.id === 'phare') ? ICONS.abysse :
                                (point.type?.toLowerCase() === 'flore' || point.id === 'pres-sales') ? ICONS.green :
                                    ICONS.orange
                    }
                    eventHandlers={{
                        click: () => onSelectPoint(point),
                    }}
                >
                    <Popup className="custom-popup">
                        <div className="p-2">
                            <h4 className="font-black text-abysse uppercase text-xs mb-1 italic">{point.title}</h4>
                            <p className="text-[10px] text-slate-500 line-clamp-2">{point.desc}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default NatureMap;
