import React, { useState } from 'react';
import { Heart, MessageCircle, Clock, BookOpen, Share2, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { AdminInspect } from '../dev/AdminInspect';

export interface PostItem {
  id: string;
  author_id: string;
  post_type: 'POST' | 'ARTICLE';
  category: string;
  title: string;
  content: string;
  image_url?: string | null;
  read_time_min?: number;
  upvotes_count?: number;
  comments_count?: number;
  created_at: string;
  is_demo?: boolean;
  profiles?: {
    full_name?: string;
    company_name?: string;
    avatar_url?: string;
  };
}

export const PostCard: React.FC<{ post: PostItem }> = ({ post }) => {
  const [upvotes, setUpvotes] = useState(post.upvotes_count || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = async () => {
    if (hasUpvoted) {
      setUpvotes(prev => Math.max(0, prev - 1));
      setHasUpvoted(false);
    } else {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
      try {
        await supabase
          .from('community_posts')
          .update({ upvotes_count: (post.upvotes_count || 0) + 1 })
          .eq('id', post.id);
      } catch (err) {
        console.warn('Upvote update warning:', err);
      }
    }
  };

  const authorName = post.profiles?.full_name || 'Booster Medlem';
  const authorCompany = post.profiles?.company_name || 'Booster Community';
  const authorAvatar = post.profiles?.avatar_url;
  const isArticle = post.post_type === 'ARTICLE';

  const timeAgo = (dateStr: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
      if (diffSec < 60) return 'Just nu';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m sedan`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h sedan`;
      return `${Math.floor(diffSec / 86400)}d sedan`;
    } catch {
      return 'Nyligen';
    }
  };

  return (
    <AdminInspect
      component="PostCard.tsx"
      sourceTable="public.community_posts"
      columns={['id', 'author_id', 'post_type', 'category', 'title', 'content', 'upvotes_count', 'comments_count']}
      notes="Inläggskort i community-flödet med uppröstning och delning"
    >
      <article className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden transition-all hover:border-gray-200">
      {/* Cover image if article */}
      {isArticle && post.image_url && (
        <div className="h-48 sm:h-56 w-full overflow-hidden bg-gray-100 relative">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#800020] text-white shadow-sm flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              Artikel
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-gray-800 shadow-sm">
              {post.category}
            </span>
          </div>
        </div>
      )}

      <div className="p-5 space-y-3">
        {/* Header with author info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200/80 flex items-center justify-center text-xs font-black text-[#800020] overflow-hidden">
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
              ) : (
                authorName.substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">{authorName}</div>
              <div className="text-[11px] text-gray-400">
                {authorCompany} • {timeAgo(post.created_at)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isArticle && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {post.category || 'Allmänt'}
              </span>
            )}
            {post.read_time_min && post.read_time_min > 0 && (
              <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" />
                {post.read_time_min} min
              </span>
            )}
            {post.is_demo && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                Demo
              </span>
            )}
          </div>
        </div>

        {/* Content body */}
        <div className="space-y-1.5">
          <h3 className={`font-bold text-gray-900 ${isArticle ? 'text-base sm:text-lg' : 'text-sm'}`}>
            {post.title}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line line-clamp-4">
            {post.content}
          </p>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUpvote}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                hasUpvoted
                  ? 'bg-rose-50 text-[#800020] border border-rose-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-current text-[#800020]' : ''}`} />
              <span>{upvotes}</span>
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{post.comments_count || 0} svar</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Länk kopierad till urklipp!');
              }
            }}
            className="p-2 text-gray-400 hover:text-gray-700 transition rounded-lg hover:bg-gray-100 cursor-pointer"
            title="Dela inlägg"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
    </AdminInspect>
  );
}
