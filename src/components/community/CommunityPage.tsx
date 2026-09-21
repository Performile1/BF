import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { InspectorProvider } from '../dev/InspectorContext';
import { AdminInspect } from '../dev/AdminInspect';
import { DevHudDock } from '../dev/DevHudDock';
import { CompactMemberCard } from '../profile/CompactMemberCard';
import { OfferingTagsCard } from '../profile/OfferingTagsCard';
import { ReviewsSummaryCard } from '../profile/ReviewsSummaryCard';
import { PostComposer } from '../community/PostComposer';
import { PostCard, PostItem } from '../community/PostCard';
import { useAuth } from '../../context/AuthContext';

export default function CommunityPage({ onNavigateTab }: { onNavigateTab?: (tab: string) => void }) {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(currentUser || null);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'POST' | 'ARTICLE'>('ALL');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const targetUserId = session?.user?.id || currentUser?.id;
      
      if (targetUserId) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('id, full_name, role_title, company_name, membership_level, booster_score, avatar_url, city, offering_tags, seeking_tags, rating_avg, reviews_count, deals_closed_sek, account_status')
          .eq('id', targetUserId)
          .single();
        if (prof) setProfile(prof);
      }

      let query = supabase
        .from('community_posts')
        .select(`
          id, author_id, post_type, category, title, content, image_url,
          read_time_min, upvotes_count, comments_count, is_demo, created_at,
          profiles:author_id (full_name, company_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'ALL') {
        query = query.eq('post_type', filter);
      }

      const { data: feed, error } = await query;
      if (error) {
        console.warn('Community posts query error:', error.message);
      }
      if (feed && feed.length > 0) {
        setPosts(feed as any);
      } else {
        // Fallback default sample posts if DB table is currently empty
        setPosts([
          {
            id: 'post-seed-1',
            author_id: targetUserId || 'usr_rickard_wigrund',
            post_type: 'POST',
            category: 'Allmänt',
            title: 'Snabb fråga kring tullregler och 3PL',
            content: 'Någon i hubben som har erfarenhet av automatiserad tulldeklaration via API för e-handelsförsändelser till Norge? Tar gärna en kaffe och bollar tankar i loungen idag!',
            read_time_min: 1,
            upvotes_count: 4,
            comments_count: 2,
            is_demo: true,
            created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
            profiles: {
              full_name: currentUser?.full_name || 'Rickard Wigrund',
              company_name: currentUser?.company_name || 'Performile / Booster Friends',
              avatar_url: (currentUser as any)?.avatar_url
            }
          },
          {
            id: 'post-seed-2',
            author_id: targetUserId || 'usr_rickard_wigrund',
            post_type: 'ARTICLE',
            category: 'Logistik',
            title: '3 strategier för att sänka fraktkostnader och höja konverteringen 2026',
            content: 'Fraktalternativ i kassan är inte längre bara en logistikfråga – det är ett av dina starkaste verktyg för konverteringsoptimering. Genom att tydliggöra beräknad leveranstidpunkt och erbjuda paketboxar nära kunden kan övergivna varukorgar minskas markant.\n\nI denna genomgång analyserar vi tre konkreta åtgärder som kan implementeras direkt i er checkout-strategi.',
            image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
            read_time_min: 4,
            upvotes_count: 12,
            comments_count: 5,
            is_demo: true,
            created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
            profiles: {
              full_name: currentUser?.full_name || 'Rickard Wigrund',
              company_name: currentUser?.company_name || 'Performile / Booster Friends',
              avatar_url: (currentUser as any)?.avatar_url
            }
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [currentUser, filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeProfile = profile || currentUser;

  return (
    <InspectorProvider>
      <div className="min-h-screen bg-gray-50/50 py-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* VÄNSTER: 4 kolumner med inspektionsbara kort */}
            <div className="lg:col-span-4 space-y-5">
              <AdminInspect
                component="CompactMemberCard.tsx"
                sourceTable="public.profiles"
                columns={['full_name', 'role_title', 'company_name', 'membership_level', 'booster_score', 'avatar_url', 'city']}
                notes="1:1 med auth.users.id. Account status = ACTIVE."
              >
                <CompactMemberCard profile={activeProfile} />
              </AdminInspect>

              <AdminInspect
                component="OfferingTagsCard.tsx"
                sourceTable="public.profiles"
                columns={['offering_tags']}
                notes="Text-array med expertisområden."
              >
                <OfferingTagsCard tags={activeProfile?.offering_tags} />
              </AdminInspect>

              <AdminInspect
                component="ReviewsSummaryCard.tsx"
                sourceTable="public.profiles"
                columns={['rating_avg', 'reviews_count', 'deals_closed_sek']}
                notes="Färdigaggregerade nyckeltal direkt på profilen."
              >
                <ReviewsSummaryCard
                  ratingAvg={activeProfile?.rating_avg}
                  reviewsCount={activeProfile?.reviews_count}
                  dealsClosedSek={activeProfile?.deals_closed_sek}
                />
              </AdminInspect>
            </div>

            {/* HÖGER: 8 kolumner med composer och flöde */}
            <div className="lg:col-span-8 space-y-6">
              <AdminInspect
                component="PostComposer.tsx"
                sourceTable="public.community_posts"
                columns={['author_id', 'post_type', 'category', 'title', 'content', 'image_url', 'read_time_min']}
                notes="category och title är NOT NULL i schemat."
              >
                <PostComposer onSuccess={loadData} />
              </AdminInspect>

              <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-gray-100 shadow-xs">
                <div className="flex gap-1">
                  {(['ALL', 'ARTICLE', 'POST'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilter(t)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        filter === t
                          ? 'bg-gray-900 text-white shadow-xs'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {t === 'ALL' ? 'Allt' : t === 'ARTICLE' ? 'Medlemsbloggen' : 'Diskussioner'}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-gray-400 pr-3">{posts.length} inlägg</span>
              </div>

              <AdminInspect
                component="PostCard.tsx"
                sourceTable="public.community_posts"
                columns={['title', 'content', 'image_url', 'read_time_min', 'upvotes_count']}
                notes="Rendrerar olika layout baserat på post_type ('POST' vs 'ARTICLE')."
              >
                <div className="space-y-4">
                  {loading ? (
                    <div className="p-8 text-center text-xs text-gray-400">Laddar flödet...</div>
                  ) : posts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-xs text-gray-400">
                      Inga inlägg hittades. Klicka på 'Ladda Mock' i Dev HUD för att se exempeldata!
                    </div>
                  ) : (
                    posts.map((post) => <PostCard key={post.id} post={post} />)
                  )}
                </div>
              </AdminInspect>
            </div>

          </div>

        </div>

        {/* Flytande Dev HUD för admin */}
        <DevHudDock onDataMutated={loadData} />
      </div>
    </InspectorProvider>
  );
}
export { CommunityPage };
