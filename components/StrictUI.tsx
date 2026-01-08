import React from 'react';

export const Card = ({ children, className = '', title }: { children?: React.ReactNode, className?: string, title?: string }) => (
  <div className={`border border-dim bg-surface p-4 mb-4 ${className}`}>
    {title && <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 border-b border-dim pb-1">{title}</h3>}
    {children}
  </div>
);

export const Button = ({ onClick, children, variant = 'primary', disabled = false, full = false }: any) => {
  const base = "py-3 px-4 text-sm font-bold tracking-widest uppercase transition-all duration-200";
  const variants: any = {
    primary: "bg-white text-black hover:bg-gray-200 disabled:bg-gray-600",
    danger: "bg-alert text-black hover:bg-red-400",
    outline: "border border-white text-white hover:bg-white hover:text-black"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${base} ${variants[variant]} ${full ? 'w-full' : ''}`}
    >
      {children}
    </button>
  );
};

export const Metric = ({ label, value, sub, trend }: any) => (
  <div className="flex flex-col">
    <span className="text-[10px] uppercase text-gray-500 tracking-wider">{label}</span>
    <span className="text-2xl font-mono text-white">{value}</span>
    {sub && <span className="text-xs text-gray-400">{sub}</span>}
    {trend && (
      <span className={`text-xs ${trend === 'up' ? 'text-success' : 'text-alert'}`}>
        {trend === 'up' ? '▲' : '▼'}
      </span>
    )}
  </div>
);

export const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="text-sm font-bold uppercase text-primary tracking-widest mb-4 mt-6">
    // {title}
  </h2>
);

export const AlertBanner = ({ message }: { message: string }) => (
  <div className="bg-alert/10 border-l-4 border-alert p-4 mb-4">
    <p className="text-alert font-mono text-xs uppercase">{message}</p>
  </div>
);