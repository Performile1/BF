import React from 'react';
export type AdminTools = { hud: boolean; quickAction: boolean };
export function useAdminTools(userId: string) {
  const key = `bf_admin_tools_${userId}`;
  const read = (): AdminTools => { try { const saved = JSON.parse(localStorage.getItem(key) || '{}'); return { hud: saved.hud === true, quickAction: saved.quickAction === true }; } catch { return { hud: false, quickAction: false }; } };
  const [tools, setTools] = React.useState<AdminTools>(read);
  React.useEffect(() => { setTools(read()); }, [key]);
  const update = (value: AdminTools) => { setTools(value); try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  return { tools, update };
}
export function AdminToolSettings({ tools, onChange }: { tools: AdminTools; onChange: (value: AdminTools) => void }) {
  return <fieldset className="border rounded-xl p-4 space-y-4"><legend className="font-semibold px-2">Adminverktyg i nederkant</legend>
    <label className="flex gap-3 items-center"><input type="checkbox" checked={tools.hud} onChange={e => onChange({ ...tools, hud: e.target.checked })} />Visa ADMIN DEV HUD</label>
    <p className="text-sm text-gray-500">Dolda som standard. Valen sparas automatiskt för ditt konto i denna webbläsare. Utvecklarpanelen innehåller Hover Inspector, Clean Slate, Ladda Mock och Rensa Mock. Att visa panelen laddar eller rensar inga data.</p>
  </fieldset>;
}
