import React from 'react';
import { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-card hover:shadow-card-hover group flex flex-col h-full border-none transition-all duration-300">
      
      {/* Image Area */}
      <div className="relative aspect-[5/4] overflow-hidden">
        <img 
          src={activity.image} 
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abysse/90 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-6 left-8 right-8">
           <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">
             {activity.title}
           </h3>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-8 bg-slate-50">
        
        <div className="flex flex-wrap items-center gap-3 mb-6">
           <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 uppercase tracking-wide">
             <span className="material-symbols-outlined text-sm">schedule</span> {activity.duration}
           </span>
           <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 uppercase tracking-wide">
             <span className="material-symbols-outlined text-sm">group</span> Dès {activity.minAge} ans
           </span>
        </div>

        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-2">
            {activity.description}
        </p>

        <div className="mt-auto flex items-center gap-4">
            <div className="size-14 rounded-full bg-abysse text-white flex items-center justify-center font-black text-sm shadow-lg border-2 border-white shrink-0">
                {activity.price}
            </div>
            <button className="flex-1 bg-turquoise hover:bg-abysse text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2">
            RÉSERVER
            </button>
        </div>
      </div>
    </div>
  );
};