import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Linkedin, 
  BarChart2, 
  BookOpen, 
  MessageSquare,
  Image as ImageIcon,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { Member, CommunityPost, CommunityPostType } from '../../types';

interface CreatePostModalProps {
  currentUser: Member;
  initialPostType?: CommunityPostType;
  onClose: () => void;
  onCreatePost: (post: Partial<CommunityPost>) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  initialPostType = 'FORUM_THREAD',
  onClose,
  onCreatePost
}) => {
  const [postType, setPostType] = useState<CommunityPostType>(initialPostType);
  const [category, setCategory] = useState<'ALLMANT' | 'AFFARER_LEADS' | 'FRAGA_EXPERTERNA' | 'VERKTYG_TIPS' | 'LOKALT_HUBBEN'>('AFFARER_LEADS');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['Alternativ 1', 'Alternativ 2']);
  const [tagsInput, setTagsInput] = useState('B2B, Tillväxt');

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, `Alternativ ${pollOptions.length + 1}`]);
    }
  };

  const handleUpdatePollOption = (index: number, value: string) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const newPost: Partial<CommunityPost> = {
      id: `post_${Date.now()}`,
      author_id: currentUser.id,
      author_name: currentUser.full_name,
      author_avatar: currentUser.avatar,
      author_company: currentUser.company_name,
      author_role: currentUser.role_title,
      author_level: currentUser.membership_level,
      author_booster_score: currentUser.booster_score,
      post_type: postType,
      category,
      title,
      content,
      image_url: imageUrl || undefined,
      linkedin_post_url: linkedinUrl || undefined,
      linkedin_preview: linkedinUrl ? {
        author: currentUser.full_name,
        headline: `${currentUser.role_title} • ${currentUser.company_name}`,
        text: content.slice(0, 180) + '...',
        likes_count: 84,
        embed_date: 'Idag'
      } : undefined,
      poll_options: postType === 'POLL' ? pollOptions.map((opt, i) => ({
        id: `opt_${i}`,
        text: opt,
        votes: 0
      })) : undefined,
      tags,
      upvotes_count: 0,
      weighted_score: 0,
      has_upvoted: false,
      comments_count: 0,
      comments: [],
      created_at: new Date().toISOString(),
      read_time_min: postType === 'ARTICLE' ? 3 : undefined
    };

    onCreatePost(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#800020] to-[#5a0016] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
              {postType === 'ARTICLE' ? 'Medlemsbloggen (+30 BP)' : 'Community & Forum (+10 BP)'}
            </span>
            <h2 className="text-lg font-black text-white">
              {postType === 'ARTICLE' ? 'Skriv & Publicera Expertartikel' : 'Skapa Nytt Community-Inlägg'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Post Type Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Välj Typ av Innehåll:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPostType('FORUM_THREAD')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                  postType === 'FORUM_THREAD'
                    ? 'bg-[#800020] text-white border-[#800020]'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Tråd / Fråga</span>
              </button>

              <button
                type="button"
                onClick={() => setPostType('ARTICLE')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                  postType === 'ARTICLE'
                    ? 'bg-[#800020] text-white border-[#800020]'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Artikel (+30 BP)</span>
              </button>

              <button
                type="button"
                onClick={() => setPostType('LINKEDIN_EMBED')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                  postType === 'LINKEDIN_EMBED'
                    ? 'bg-[#0077b5] text-white border-[#0077b5]'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <Linkedin className="w-4 h-4" />
                <span>Bädda in LinkedIn</span>
              </button>

              <button
                type="button"
                onClick={() => setPostType('POLL')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                  postType === 'POLL'
                    ? 'bg-purple-700 text-white border-purple-700'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>Omröstning</span>
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Kategori:</label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white text-gray-800 font-medium"
            >
              <option value="AFFARER_LEADS">💼 Affärsmöjligheter & Leads</option>
              <option value="FRAGA_EXPERTERNA">💡 Fråga Experterna</option>
              <option value="VERKTYG_TIPS">🛠️ Verktyg & Tips</option>
              <option value="LOKALT_HUBBEN">📍 Lokalt i Hubben</option>
              <option value="ALLMANT">💬 Allmänt & Mingel</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Rubrik: *</label>
            <input
              type="text"
              required
              placeholder="T.ex. Hur vi ökade konverteringen med 24% genom enkla avtalsjusteringar"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-[#800020]"
            />
          </div>

          {/* LinkedIn URL if embed */}
          {postType === 'LINKEDIN_EMBED' && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
              <label className="block text-xs font-bold text-sky-900">
                Länk till ditt LinkedIn-inlägg:
              </label>
              <input
                type="url"
                required
                placeholder="https://www.linkedin.com/posts/ditt-namn-..."
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sky-300 text-xs bg-white"
              />
              <p className="text-[11px] text-sky-800">
                Inlägget bäddas in som en visuell kassett och ger viktade Booster Points för varje reaktion i nätverket.
              </p>
            </div>
          )}

          {/* Body Content */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {postType === 'ARTICLE' ? 'Artikeln (Rik text & fallstudie): *' : 'Innehåll / Frågeställning: *'}
            </label>
            <textarea
              required
              rows={postType === 'ARTICLE' ? 7 : 4}
              placeholder="Skriv ditt inlägg här. Tagga gärna medlemmar med @namn för att involvera kollegor i diskussionen..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-hidden focus:border-[#800020] leading-relaxed"
            />
          </div>

          {/* Poll options if poll */}
          {postType === 'POLL' && (
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
              <label className="block text-xs font-bold text-purple-900">
                Svarsalternativ för omröstningen:
              </label>
              {pollOptions.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={opt}
                  onChange={(e) => handleUpdatePollOption(idx, e.target.value)}
                  placeholder={`Alternativ ${idx + 1}`}
                  className="w-full px-3 py-2 rounded-xl border border-purple-300 text-xs bg-white mb-1.5"
                />
              ))}
              {pollOptions.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="text-xs text-purple-800 font-bold hover:underline"
                >
                  + Lägg till ytterligare alternativ
                </button>
              )}
            </div>
          )}

          {/* Optional image url */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Omslagsbild (URL - valfritt):
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-800"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Taggar (kommaseparerade):</label>
            <input
              type="text"
              placeholder="B2B, Sälj, AI, Investering"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-800"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5a0016] text-white font-bold text-xs transition flex items-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Publicera {postType === 'ARTICLE' ? 'Artikel (+30 BP)' : 'Inlägg (+10 BP)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
