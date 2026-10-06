// Legacy Bento IDs remain accepted, but each modular widget has one identity.
export const WIDGET_ALIASES: Record<string, string> = {
  kpi_overview: 'admin_kpi_overview', who_is_at_hub: 'hub_presence',
  profile_gamification: 'booster_score', system_ticker_widget: 'activity_ticker',
  coffee_ping_radar: 'proximity_radar', coworking_booking: 'flex_booking',
  matchmaking: 'ai_matchmaking', pipeline: 'member_pipeline',
  bp_ledger_widget: 'bp_ledger', forum_activity: 'community_feed', academy_certs: 'academy_progress'
};
export const canonicalWidgetId = (id: string) => WIDGET_ALIASES[id] || id;
export const normalizeWidgetIds = (ids: string[]) => [...new Set(ids.map(canonicalWidgetId))];
