import React, { useState } from 'react';
import { Send, Users, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { WidgetComponentProps } from '../../../types/widgets';
import { sendBroadcastCampaign } from '../../../lib/apiServices';

export const AdminBroadcastSenderWidget: React.FC<WidgetComponentProps> = ({
  currentUser
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<'ALL' | 'PROSPECTS' | 'MEMBERS'>('ALL');
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SENT' | 'ERROR'>('IDLE');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setStatus('SENDING');
    try {
      await sendBroadcastCampaign(title, body, audience);
      setStatus('SENT');
      setTitle('');
      setBody('');
      setTimeout(() => setStatus('IDLE'), 4000);
    } catch (err) {
      console.error(err);
      setStatus('ERROR');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-gray-900 tracking-tight">Skicka Snabb-Broadcast</h3>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-gray-500">Utskick till nätverket via app & e-post</p>
            </div>
          </div>
        </div>

        {status === 'SENT' ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center my-4 animate-in fade-in">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-1.5" />
            <p className="text-xs font-black text-emerald-900">Utskick skickat!</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Meddelandet distribuerades till målgruppen {audience}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-2.5 my-2">
            {/* Målgrupp */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
              {[
                { id: 'ALL', label: 'Alla (142)' },
                { id: 'MEMBERS', label: 'Bara Medlemmar' },
                { id: 'PROSPECTS', label: 'Trials & Prospects' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAudience(item.id as any)}
                  className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                    audience === item.id
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Rubrik (t.ex. Viktigt möte imorgon)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#800020] outline-hidden"
              required
            />

            <textarea
              placeholder="Skriv ditt meddelande här..."
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#800020] outline-hidden resize-none"
              required
            />

            {status === 'ERROR' && (
              <p className="text-[10px] text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Kunde inte skicka utskick. Försök igen.
              </p>
            )}

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-gray-400">
                In-app notis + push
              </span>
              <button
                type="submit"
                disabled={status === 'SENDING' || !title || !body}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {status === 'SENDING' ? 'Skickar...' : 'Skicka Direkt'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
