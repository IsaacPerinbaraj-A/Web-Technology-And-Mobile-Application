import React from 'react';

const SlotGrid = ({ slots, onSlotClick, selectedSlot, loading }) => {
  const getStatusClasses = (status, isSelected) => {
    if (isSelected) return 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105 z-10';
    
    switch (status) {
      case 'AVAILABLE':
        return 'bg-white text-secondary border-secondary/20 hover:border-secondary hover:bg-secondary/5 cursor-pointer';
      case 'RESERVED':
        return 'bg-amber-50 text-amber-600 border-amber-200 cursor-not-allowed opacity-80';
      case 'OCCUPIED':
        return 'bg-red-50 text-red-600 border-red-200 cursor-not-allowed opacity-80';
      case 'MAINTENANCE':
        return 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed';
      default:
        return 'bg-slate-50 text-slate-300 border-slate-100';
    }
  };

  const legends = [
    { label: 'Available', color: 'bg-secondary', text: 'text-secondary' },
    { label: 'Occupied', color: 'bg-red-500', text: 'text-red-500' },
    { label: 'Reserved', color: 'bg-amber-500', text: 'text-amber-500' },
    { label: 'Your Choice', color: 'bg-primary', text: 'text-primary' },
  ];

  return (
    <div className="space-y-8">
      {/* Legend */}
      <div className="flex flex-wrap gap-6 p-6 glass rounded-3xl border border-border">
        {legends.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${item.color} shadow-sm`}></div>
            <span className={`text-sm font-semibold uppercase tracking-wider ${item.text}`}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Grid Floor */}
      <div className="relative p-10 bg-slate-950 rounded-[3rem] border-[12px] border-slate-900 shadow-2xl overflow-hidden">
        {/* Floor Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
        
        {/* Road/Aisle */}
        <div className="absolute top-1/2 left-0 w-full h-16 -translate-y-1/2 bg-slate-900 flex items-center justify-around border-y border-slate-800">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-12 h-1 bg-slate-700 rounded-full"></div>
          ))}
        </div>

        {/* Slots Grid */}
        <div className="relative z-10 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
          {slots.map((slot, i) => {
            const isSelected = selectedSlot?._id === slot._id;
            return (
              <button
                key={slot._id}
                onClick={() => slot.status === 'AVAILABLE' && onSlotClick(slot)}
                disabled={slot.status !== 'AVAILABLE' || loading}
                className={`
                  h-20 rounded-xl border-2 font-bold text-lg transition-all duration-300
                  flex flex-col items-center justify-center gap-1
                  ${getStatusClasses(slot.status, isSelected)}
                  ${slot.status === 'AVAILABLE' ? 'hover:-translate-y-1' : ''}
                  animate-fade-in
                `}
                style={{ animationDelay: `${i * 0.05}s` }}
                title={`${slot.slotNumber} - ${slot.status}`}
              >
                <span className="text-[10px] uppercase opacity-60 tracking-tighter">Slot</span>
                <span>{slot.slotNumber}</span>
                {slot.status === 'OCCUPIED' && <span className="text-xs">🚗</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SlotGrid;
