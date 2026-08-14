export const FeatureCard = ({ icon, title, iconBg, desc }) => {
  return (
    <div className="flex gap-4 p-5 bg-[#FAEFDF] rounded-2xl">
      <div
        className={`flex items-center justify-center self-center shrink-0 w-12 h-12 rounded-xl text-white text-xl ${iconBg}`}
      >
        {icon}
      </div>
      <div className="self-center">
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
};
