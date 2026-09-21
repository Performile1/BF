import React from 'react';
import { AdminInspect } from '../dev/AdminInspect';

export function ReviewsSummaryCard({
  ratingAvg = 5.0,
  reviewsCount = 0,
  dealsClosedSek = 0,
}: {
  ratingAvg?: number;
  reviewsCount?: number;
  dealsClosedSek?: number;
}) {
  return (
    <AdminInspect
      component="ReviewsSummaryCard.tsx"
      sourceTable="public.member_reviews / deals"
      columns={['rating_avg', 'reviews_count', 'deals_closed_sek']}
      notes="Omdömen och track record sammanställning"
    >
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">Omdömen & Track Record</h3>
          <span className="text-amber-500 text-xs font-bold">★ {Number(ratingAvg || 5.0).toFixed(1)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-3 bg-gray-50/60 rounded-xl border border-gray-100">
            <div className="text-[10px] text-gray-400 font-bold uppercase">Verifierade omdömen</div>
            <div className="text-sm font-bold text-gray-900 mt-0.5">{reviewsCount} st</div>
          </div>
          <div className="p-3 bg-gray-50/60 rounded-xl border border-gray-100">
            <div className="text-[10px] text-gray-400 font-bold uppercase">Stängda affärer</div>
            <div className="text-sm font-bold text-emerald-700 mt-0.5">
              {new Intl.NumberFormat('sv-SE', { notation: 'compact' }).format(dealsClosedSek)} kr
            </div>
          </div>
        </div>
      </div>
    </AdminInspect>
  );
}
