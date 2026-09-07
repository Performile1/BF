import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Plus, 
  Linkedin, 
  Search, 
  Tag, 
  BarChart2, 
  Check, 
  Star, 
  Crown, 
  Filter, 
  ShieldCheck, 
  TrendingUp, 
  MessageCircle,
  ExternalLink,
  Zap,
  Info
} from 'lucide-react';
import { Member, CommunityPost, PostComment, CommunityPollOption } from '../../types';
import { INITIAL_COMMUNITY_POSTS } from '../../data/communityAndMatchmakingData';
import { CreatePostModal } from './CreatePostModal';

interface CommunityAndBlogModuleProps {
  currentUser: Member;
  allMembers: Member[];
  onAwardPoints?: (points: number, title: string, activityType: any) => void;
  onOpenDirectChat?: (memberId: string) => void;
}

export const CommunityAndBlogModule: React.FC<CommunityAndBlogModuleProps> = ({
  currentUser,
  allMembers = [],
  onAwardPoints,
  onOpenDirectChat
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'FORUM' | 'BLOG' | 'FOLLOWING'>('FORUM');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFollowingOnly, setFilterFollowingOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalType, setCreateModalType] = useState<'FORUM_THREAD' | 'ARTICLE'>('FORUM_THREAD');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>('post_1');
  const [commentInput, setCommentInput] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Posts state
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  
  // Following list state (member IDs)
  const [followingMemberIds, setFollowingMemberIds] = useState<string[]>(['usr_2', 'usr_3']);

  // Calculate Voter Upvote Multiplier based on current user tier and relationship
  const getVoterWeight = (authorId: string) => {
    let multiplier = 1.0;
    if (currentUser.membership_level === 'SILVER') multiplier = 1.25;
    if (currentUser.membership_level === 'GOLD') multiplier = 1.5;
    if (currentUser.booster_score >= 800) multiplier = 2.0; // Master Networker

    // Verified 1-on-1 meeting bonus (+0.5x)
    const hasMet = authorId === 'usr_3' || authorId === 'usr_2';
    if (hasMet) multiplier += 0.5;

    const pointsAwarded = Math.round(2 * multiplier * 10) / 10;
    return { multiplier, pointsAwarded, hasMet };
  };

  // Upvote Handler using Weighted Engine
  const handleUpvotePost = (post: CommunityPost) => {
    const { multiplier, pointsAwarded, hasMet } = getVoterWeight(post.author_id);

    setPosts(prev => prev.map(p => {
      if (p.id === post.id) {
        const nextHasUpvoted = !p.has_upvoted;
        return {
          ...p,
          has_upvoted: nextHasUpvoted,
          upvotes_count: nextHasUpvoted ? p.upvotes_count + 1 : Math.max(0, p.upvotes_count - 1),
          weighted_score: nextHasUpvoted ? p.weighted_score + pointsAwarded : Math.max(0, p.weighted_score - pointsAwarded)
        };
      }
      return p;
    }));

    if (!post.has_upvoted) {
      if (onAwardPoints && post.author_id === currentUser.id) {
        onAwardPoints(Math.round(pointsAwarded), `Viktad röst på inlägg`, 'ARTICLE_WRITTEN');
      }
      const note = hasMet ? ' (+0.5x kaffemötesbonus!)' : '';
      setFeedbackNotice(
        `✨ Din röst vägde ${multiplier}x som ${currentUser.membership_level}-medlem${note} och tilldelade författaren +${pointsAwarded} BP!`
      );
      setTimeout(() => setFeedbackNotice(null), 5000);
    }
  };

  // Poll Vote Handler
  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId && p.poll_options) {
        return {
          ...p,
          poll_options: p.poll_options.map(opt => {
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + 1, has_voted: true };
            }
            return { ...opt, has_voted: false };
          })
        };
      }
      return p;
    }));

    setFeedbackNotice('🗳️ Din röst har registrerats i community-omröstningen!');
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  // Add Comment Handler (+5 BP)
  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;

    const newComment: PostComment = {
      id: `comm_${Date.now()}`,
      post_id: postId,
      author_id: currentUser.id,
      author_name: currentUser.full_name,
      author_avatar: currentUser.avatar,
      author_company: currentUser.company_name,
      author_level: currentUser.membership_level,
      content: commentInput,
      upvotes: 0,
      has_upvoted: false,
      is_best_answer: false,
      created_at: new Date().toISOString()
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments_count: p.comments_count + 1,
          comments: [...(p.comments || []), newComment]
        };
      }
      return p;
    }));

    setCommentInput('');
    if (onAwardPoints) {
      onAwardPoints(5, 'Skrev svar i community-tråd', 'REVIEW_RECEIVED');
    }
    setFeedbackNotice('💬 Svar publicerat! Du har belönats med +5 Booster Points.');
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  // Mark Best Answer Handler (+25 BP to author)
  const handleMarkBestAnswer = (postId: string, comment: PostComment) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          is_best_answer_awarded: true,
          comments: (p.comments || []).map(c => ({
            ...c,
            is_best_answer: c.id === comment.id
          }))
        };
      }
      return p;
    }));

    if (onAwardPoints && comment.author_id === currentUser.id) {
      onAwardPoints(25, 'Markerat som Bästa Svar', 'MENTOR_SESSION');
    }

    setFeedbackNotice(`🏆 Svaret från ${comment.author_name} har markerats som Bästa Svar! +25 Booster Points tilldelat.`);
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  // Toggle Follow Handler
  const handleToggleFollow = (memberId: string, memberName: string) => {
    setFollowingMemberIds(prev => {
      const isFollowing = prev.includes(memberId);
      if (isFollowing) {
        setFeedbackNotice(`Avföljer ${memberName}.`);
        setTimeout(() => setFeedbackNotice(null), 2500);
        return prev.filter(id => id !== memberId);
      } else {
        setFeedbackNotice(`🔔 Du följer nu ${memberName}! Du får notiser när personen publicerar artiklar eller bokar flexplatser.`);
        setTimeout(() => setFeedbackNotice(null), 4000);
        return [...prev, memberId];
      }
    });
  };

  // Filter posts
  const filteredPosts = posts.filter(p => {
    if (activeMainTab === 'BLOG') {
      if (p.post_type !== 'ARTICLE' && p.post_type !== 'LINKEDIN_EMBED') return false;
    } else if (activeMainTab === 'FORUM') {
      if (p.post_type === 'ARTICLE') return false;
    }

    if (filterFollowingOnly && !followingMemberIds.includes(p.author_id) && p.author_id !== currentUser.id) {
      return false;
    }

    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
      return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchContent = p.content.toLowerCase().includes(q);
      const matchAuthor = p.author_name.toLowerCase().includes(q);
      const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchAuthor && !matchTags) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Varför Booster Friends slår LinkedIn */}
      <div className="bg-gradient-to-r from-[#800020] via-[#5c0017] to-[#2b000a] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Värdestyrt Community & Expertblogg</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Där Kunskap Konverterar till Affärer & Varma Relationer
            </h1>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Till skillnad från LinkedIn premieras du inte för klickbeten här. Vår <span className="text-amber-300 font-bold">Viktade BP-Algoritm</span> gör att röster från Guldmedlemmar och verifierade kaffekontakter väger tyngre, och intjänade poäng lyfter din profil högst upp i medlemsregistret.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setCreateModalType('ARTICLE');
                setShowCreateModal(true);
              }}
              className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg"
            >
              <BookOpen className="w-4 h-4" />
              <span>Skriv Artikel (+30 BP)</span>
            </button>

            <button
              onClick={() => {
                setCreateModalType('FORUM_THREAD');
                setShowCreateModal(true);
              }}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-2 border border-white/20 backdrop-blur-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nytt Tråd / Inlägg</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback notice */}
      {feedbackNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{feedbackNotice}</span>
          </div>
          <button 
            onClick={() => setFeedbackNotice(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Primary Tabs & Following Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveMainTab('FORUM')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeMainTab === 'FORUM'
                ? 'bg-[#800020] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Community & Forum</span>
          </button>

          <button
            onClick={() => setActiveMainTab('BLOG')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeMainTab === 'BLOG'
                ? 'bg-[#800020] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Medlemsbloggen (Member Insights)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('FOLLOWING')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeMainTab === 'FOLLOWING'
                ? 'bg-[#800020] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Personer du följer ({followingMemberIds.length})</span>
          </button>
        </div>

        {/* Filter Following Toggle */}
        <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer text-xs font-semibold text-gray-700 shrink-0">
          <input
            type="checkbox"
            checked={filterFollowingOnly}
            onChange={(e) => setFilterFollowingOnly(e.target.checked)}
            className="rounded text-[#800020] focus:ring-[#800020]"
          />
          <span>Endast följda medlemmar</span>
        </label>
      </div>

      {/* Categories & Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'Alla Ämnen' },
            { id: 'AFFARER_LEADS', label: '💼 Affärsmöjligheter & Leads' },
            { id: 'FRAGA_EXPERTERNA', label: '💡 Fråga Experterna' },
            { id: 'VERKTYG_TIPS', label: '🛠️ Verktyg & Tips' },
            { id: 'LOKALT_HUBBEN', label: '📍 Lokalt i Hubben' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-rose-100 text-[#800020] border border-rose-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Sök inlägg, taggar, författare..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
          />
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-5">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="font-bold text-gray-800 text-sm">Inga inlägg hittades</h3>
            <p className="text-xs text-gray-500">Prova att ändra kategori eller nollställa sökningen.</p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isFollowingAuthor = followingMemberIds.includes(post.author_id);
            const isAuthorMe = post.author_id === currentUser.id;
            const commentsOpen = expandedCommentsPostId === post.id;

            return (
              <article 
                key={post.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 hover:border-gray-300 transition"
              >
                {/* Post Author Bar */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.author_avatar} 
                      alt={post.author_name} 
                      className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-gray-900 text-sm">{post.author_name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#800020] border border-rose-200">
                          {post.author_level} • {post.author_booster_score} BP
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{post.author_role} • {post.author_company}</p>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        {new Date(post.created_at).toLocaleDateString('sv-SE')} 
                        {post.read_time_min && ` • ${post.read_time_min} min lästid`}
                      </span>
                    </div>
                  </div>

                  {/* Follow Button */}
                  {!isAuthorMe && (
                    <button
                      onClick={() => handleToggleFollow(post.author_id, post.author_name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isFollowingAuthor
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-rose-50 hover:bg-rose-100 text-[#800020] border border-rose-200'
                      }`}
                    >
                      {isFollowingAuthor ? 'Följer ✓' : '+ Följ'}
                    </button>
                  )}
                </div>

                {/* Post Header & Content */}
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-black text-gray-900 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Post Media: Image */}
                {post.image_url && (
                  <div className="rounded-2xl overflow-hidden max-h-80 border border-gray-100">
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* LinkedIn Embedded Post Box */}
                {post.post_type === 'LINKEDIN_EMBED' && post.linkedin_preview && (
                  <div className="p-4 rounded-2xl bg-[#0077b5]/5 border border-[#0077b5]/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#0077b5]">
                        <Linkedin className="w-4 h-4 fill-current" />
                        <span>Inbäddat LinkedIn Inlägg</span>
                      </div>
                      <span className="text-[11px] text-gray-400">{post.linkedin_preview.embed_date}</span>
                    </div>

                    <div className="text-xs text-gray-800 italic bg-white p-3 rounded-xl border border-gray-200/80 leading-relaxed">
                      "{post.linkedin_preview.text}"
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-gray-500 font-medium">👍 {post.linkedin_preview.likes_count} reaktioner på LinkedIn</span>
                      {post.linkedin_post_url && (
                        <a 
                          href={post.linkedin_post_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[#0077b5] font-bold hover:underline flex items-center gap-1"
                        >
                          <span>Öppna på LinkedIn</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Poll Options */}
                {post.post_type === 'POLL' && post.poll_options && (
                  <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/70 space-y-2.5">
                    <div className="text-xs font-bold text-purple-950 flex items-center gap-1.5 mb-1">
                      <BarChart2 className="w-4 h-4 text-purple-700" />
                      <span>Omröstning i nätverket:</span>
                    </div>

                    <div className="space-y-2">
                      {post.poll_options.map((opt) => {
                        const totalVotes = post.poll_options!.reduce((acc, curr) => acc + curr.votes, 0) || 1;
                        const percent = Math.round((opt.votes / totalVotes) * 100);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleVotePoll(post.id, opt.id)}
                            className={`w-full text-left p-3 rounded-xl border transition relative overflow-hidden ${
                              opt.has_voted 
                                ? 'bg-purple-100/70 border-purple-400 font-bold' 
                                : 'bg-white border-purple-200 hover:border-purple-300'
                            }`}
                          >
                            <div 
                              className="absolute left-0 top-0 bottom-0 bg-purple-200/40 pointer-events-none transition-all duration-500" 
                              style={{ width: `${percent}%` }}
                            />
                            <div className="relative z-10 flex items-center justify-between text-xs">
                              <span className="text-gray-900">{opt.text}</span>
                              <span className="text-purple-900 font-black">{percent}% ({opt.votes} röster)</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-medium">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Reactions & Action Bar with Weighted Voting Engine */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Weighted Upvote Button */}
                    <button
                      onClick={() => handleUpvotePost(post)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                        post.has_upvoted
                          ? 'bg-rose-100 text-[#800020] border border-rose-200'
                          : 'bg-gray-50 hover:bg-rose-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.has_upvoted ? 'fill-current text-[#800020]' : ''}`} />
                      <span>{post.upvotes_count} Värdefullt</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-gray-950 font-black">
                        +{post.weighted_score.toFixed(1)} BP
                      </span>
                    </button>

                    {/* Comments Toggle */}
                    <button
                      onClick={() => setExpandedCommentsPostId(commentsOpen ? null : post.id)}
                      className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200 transition flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments_count} Svar</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-gray-400">
                    💡 Röster är viktade utifrån medlemmens nivå & förtroende
                  </div>
                </div>

                {/* Comments Accordion */}
                {commentsOpen && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    <h4 className="font-bold text-gray-900 text-xs flex items-center gap-2">
                      <span>Diskussion & Svar ({post.comments?.length || 0})</span>
                    </h4>

                    {/* Existing comments */}
                    <div className="space-y-2.5">
                      {post.comments && post.comments.map((comm) => (
                        <div 
                          key={comm.id}
                          className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                            comm.is_best_answer 
                              ? 'bg-amber-50/70 border-amber-300 shadow-xs' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img 
                                src={comm.author_avatar} 
                                alt={comm.author_name} 
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="font-bold text-gray-900">{comm.author_name}</span>
                              <span className="text-[10px] text-gray-400">({comm.author_company})</span>
                            </div>

                            {comm.is_best_answer ? (
                              <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-950 font-black text-[10px] flex items-center gap-1">
                                <Award className="w-3 h-3 text-amber-700" /> Bästa Svar (+25 BP)
                              </span>
                            ) : (
                              isAuthorMe && (
                                <button
                                  onClick={() => handleMarkBestAnswer(post.id, comm)}
                                  className="text-[10px] text-amber-700 font-bold hover:underline"
                                >
                                  Markera som Bästa Svar
                                </button>
                              )
                            )}
                          </div>

                          <p className="text-gray-700 leading-relaxed pl-8">
                            {comm.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Comment Input */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Skriv ett svar eller råd till författaren (+5 BP)..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-4 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5a0016] text-white text-xs font-bold transition shadow-xs"
                      >
                        Svara
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          currentUser={currentUser}
          initialPostType={createModalType}
          onClose={() => setShowCreateModal(false)}
          onCreatePost={(newPost) => {
            const fullPost = newPost as CommunityPost;
            setPosts(prev => [fullPost, ...prev]);
            const pts = fullPost.post_type === 'ARTICLE' ? 30 : 10;
            if (onAwardPoints) {
              onAwardPoints(pts, `Publicerat ${fullPost.post_type === 'ARTICLE' ? 'expertartikel' : 'inlägg'}`, 'ARTICLE_WRITTEN');
            }
            setFeedbackNotice(`🎉 Inlägget "${fullPost.title}" har publicerats i Booster Friends! +${pts} Booster Points krediterade.`);
            setTimeout(() => setFeedbackNotice(null), 5000);
          }}
        />
      )}
    </div>
  );
};
