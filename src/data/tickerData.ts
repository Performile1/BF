import { SystemActivityTickerEvent } from '../types';

export const INITIAL_TICKER_EVENTS: SystemActivityTickerEvent[] = [
  {
    id: 'tick_1',
    event_type: 'SYSTEM_ANNOUNCEMENT',
    message: '🎉 Välkommen till V12! Nya nätverksverktyg, kaffe-radar och B2B-annonsering är nu live.',
    target_tab: 'directory',
    is_pinned_by_admin: true,
    created_at: '2026-09-11T09:00:00Z'
  },
  {
    id: 'tick_2',
    event_type: 'COFFEE_PING',
    message: '☕ Johan K. öppnade för spontan lunch i Mölnlycke för 5 min sedan',
    target_tab: 'directory',
    created_at: '2026-09-11T09:10:00Z'
  },
  {
    id: 'tick_3',
    event_type: 'BADGE_EARNED',
    message: '🏆 Sara M. klarade AI-Kompetens-testet och erhöll verifierad Specialist-Badge',
    target_tab: 'directory',
    created_at: '2026-09-11T09:15:00Z'
  },
  {
    id: 'tick_4',
    event_type: 'NEW_MEMBER',
    message: '🤝 Mölnlycke Tech AB uppgraderade just till Guld-medlem – Varmt välkomna!',
    target_tab: 'membership',
    created_at: '2026-09-11T09:20:00Z'
  },
  {
    id: 'tick_5',
    event_type: 'EVENT_CREATED',
    message: '📅 Nytt event: "B2B Tillväxt & Skalning 2026" publicerat i Göteborgs-hubben',
    target_tab: 'events',
    created_at: '2026-09-11T09:25:00Z'
  },
  {
    id: 'tick_6',
    event_type: 'CASE_ADDED',
    message: '💡 Pontus L. lade till ett nytt case i sin portfölj: "Skalbar AI-pipeline"',
    target_tab: 'directory',
    created_at: '2026-09-11T09:30:00Z'
  }
];
