import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { AdminInspect } from '../dev/AdminInspect';

export function PostComposer({ onSuccess }: { onSuccess: () => void }) {
  const [postType, setPostType] = useState<'POST' | 'ARTICLE'>('POST');
  const [category, setCategory] = useState<string>('Allmänt');
  const [categories, setCategories] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Hämta tillgängliga kategorier från community_category-enumen
  useEffect(() => {
    async function loadCategories() {
      // Fallback-kategorier om databasen har standardiserade värden
      setCategories(['Allmänt', 'E-handel', 'Logistik', 'Tech & AI', 'Evenemang']);
      setCategory('Allmänt');
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !title.trim()) return;

    try {
      setSubmitting(true);
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      if (!currentUserId) throw new Error('Ej inloggad. Vänligen logga in för att publicera.');

      const wordCount = content.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));

      const { error } = await supabase.from('community_posts').insert({
        author_id: currentUserId,
        post_type: postType,
        category: category as any,
        title: title.trim(),
        content: content.trim(),
        image_url: postType === 'ARTICLE' && imageUrl.trim() ? imageUrl.trim() : null,
        read_time_min: readTime,
      });

      if (error) throw error;

      setTitle('');
      setContent('');
      setImageUrl('');
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Kunde inte skapa inlägget.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminInspect
      component="PostComposer.tsx"
      sourceTable="public.community_posts"
      columns={['author_id', 'post_type', 'category', 'title', 'content', 'image_url', 'read_time_min']}
      notes="Skapa inlägg eller artikel i community-flödet"
    >
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
      <div className="flex gap-2 border-b border-gray-100 pb-3">
        <button
          type="button"
          onClick={() => setPostType('POST')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            postType === 'POST' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Snabbdiskussion
        </button>
        <button
          type="button"
          onClick={() => setPostType('ARTICLE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            postType === 'ARTICLE' ? 'bg-[#800020] text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Skriv Medlemsartikel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Titel krävs av schemat för alla typer (NOT NULL) */}
        <input
          type="text"
          placeholder={postType === 'ARTICLE' ? 'Artikeltitel...' : 'Vad vill du diskutera? (Rubrik)...'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full text-sm font-bold px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#800020]"
        />

        <div className="flex gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#800020] bg-white cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Kategori: {c}
              </option>
            ))}
          </select>

          {postType === 'ARTICLE' && (
            <input
              type="url"
              placeholder="Omslagsbild URL (valfritt)..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#800020]"
            />
          )}
        </div>

        <textarea
          rows={postType === 'ARTICLE' ? 6 : 3}
          placeholder={postType === 'ARTICLE' ? 'Dela din analys, guide eller fallstudie...' : 'Skriv din fråga eller tanke här...'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full text-xs p-3.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#800020] resize-none"
        />

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-[#800020] text-white text-xs font-bold rounded-xl hover:bg-[#66001a] transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Publicerar...' : postType === 'ARTICLE' ? 'Publicera artikel' : 'Dela inlägg'}
          </button>
        </div>
      </form>
    </div>
    </AdminInspect>
  );
}
