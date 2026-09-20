import React, { useState } from 'react';
import { Award, Trophy, Zap, ChevronRight } from 'lucide-react';
import { WidgetComponentProps } from '../../../types/widgets';

export const BoosterScoreWidget: React.FC<WidgetComponentProps> = ({
  currentUser,
  onNavigateTab
}) => {
  const currentScore = currentUser.booster_score || 250;
  const nextTierScore = currentUser.membership_level === 'BRONZE' ? 500 : currentUser.membership_level === 'SILVER' ? 1000 : 2500;
  const progressPercent = Math.min(100, Math.round((currentScore / nextTierScore) * 100));

  const levelColor = 
    currentUser.membership_level === 'GOLD' 
      ? 'from-amber-500 to-amber-700 text-amber-950' 
      : currentUser.membership_level === 'SILVER'
      ? 'from-slate-300 to-slate-500 text-slate-900'
      : 'from-amber-700 to-amber-900 text-amber-100';

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 tracking-tight">Medlemskort & Poäng</h3>
              <p className="text-[10px] text-gray-500">{currentUser.full_name}</p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r ${levelColor}`}>
            {currentUser.membership_level}
          </span>
        </div>

        {/* Score & Progress */}
        <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 my-2">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-[11px] text-gray-500 font-medium">Booster Score</span>
            <span className="text-xl font-black text-gray-900">
              {currentScore} <span className="text-xs font-bold text-[#800020]">BP</span>
            </span>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-1.5">
            <div 
              className="bg-[#800020] h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span>{progressPercent}% till nästa nivå</span>
            <span>Mål: {nextTierScore} BP</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">
          Rank #12 i nätverket
        </span>
        <button
          onClick={() => onNavigateTab && onNavigateTab('gamification')}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
        >
          Poänghistorik & Meriter
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
