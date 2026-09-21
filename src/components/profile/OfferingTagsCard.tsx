import React from 'react';
import { AdminInspect } from '../dev/AdminInspect';

export function OfferingTagsCard({ tags }: { tags?: string[] }) {
  const activeTags = tags && tags.length > 0 ? tags : ['E-handel', 'Logistik', 'B2B Försäljning'];

  return (
    <AdminInspect
      component="OfferingTagsCard.tsx"
      sourceTable="public.profiles"
      columns={['offering_tags', 'skills']}
      notes="Expertis och erbjudande taggar för medlem"
    >
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">Expertis & Erbjudande</h3>
          <span className="text-[10px] text-gray-400">{activeTags.length} områden</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {activeTags.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-xl bg-gray-50 text-gray-700 border border-gray-100 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </AdminInspect>
  );
}
