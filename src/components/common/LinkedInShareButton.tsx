import React, { useState } from 'react';
import { Linkedin, Share2, Check, Copy, ExternalLink, Sparkles } from 'lucide-react';

interface LinkedInShareButtonProps {
  title: string;
  summary?: string;
  url?: string;
  tags?: string[];
  onShared?: () => void;
  variant?: 'button' | 'icon' | 'badge' | 'compact';
  className?: string;
}

export const LinkedInShareButton: React.FC<LinkedInShareButtonProps> = ({
  title,
  summary = '',
  url = window.location.origin,
  tags = ['BoosterFriends', 'B2BNätverk', 'Affärsutveckling'],
  onShared,
  variant = 'button',
  className = ''
}) => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Formatted post text for LinkedIn
  const hashtagString = tags.map(t => `#${t.replace(/[^a-zA-Z0-9åäöÅÄÖ]/g, '')}`).join(' ');
  const fullPostText = `${title}\n\n${summary ? summary + '\n\n' : ''}Delat via affärsnätverket Booster Friends: ${url}\n\n${hashtagString}`;

  const handleOpenLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=650,height=600');
    if (onShared) {
      onShared();
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(fullPostText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <>
      {variant === 'icon' ? (
        <button
          onClick={() => setShowModal(true)}
          className={`p-2 rounded-xl text-[#0A66C2] bg-blue-50 hover:bg-[#0A66C2] hover:text-white transition duration-200 border border-blue-200 ${className}`}
          title="Dela på LinkedIn (+15 BP)"
        >
          <Linkedin className="w-3.5 h-3.5" />
        </button>
      ) : variant === 'compact' ? (
        <button
          onClick={() => setShowModal(true)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-[#0A66C2] bg-blue-50 hover:bg-blue-100 transition border border-blue-200 ${className}`}
          title="Dela på LinkedIn (+15 BP)"
        >
          <Linkedin className="w-3 h-3 text-[#0A66C2]" />
          <span>LinkedIn</span>
        </button>
      ) : variant === 'badge' ? (
        <button
          onClick={() => setShowModal(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-[#0A66C2] hover:bg-[#004182] transition shadow-xs ${className}`}
        >
          <Linkedin className="w-3.5 h-3.5" />
          <span>Dela (+15 BP)</span>
        </button>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0A66C2] hover:bg-[#004182] transition shadow-xs border border-white/20 ${className}`}
        >
          <Linkedin className="w-3.5 h-3.5 fill-current" />
          <span>Dela på LinkedIn (+15 BP)</span>
        </button>
      )}

      {/* Share Preview Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#0A66C2] flex items-center justify-center text-white">
                  <Linkedin className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Dela till LinkedIn-nätverket</h3>
                  <p className="text-[11px] text-gray-500">Tjäna +15 Booster Points genom att sprida affärsvärde</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span>Förhandsgranskning av inläggstext:</span>
                <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3 h-3" />
                  +15 BP vid delning
                </span>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-800 whitespace-pre-wrap font-sans max-h-48 overflow-y-auto leading-relaxed">
                {fullPostText}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleCopyText}
                className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Kopierad!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopiera inläggstext</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 rounded-xl text-gray-500 hover:text-gray-800 text-xs font-semibold"
                >
                  Stäng
                </button>
                <button
                  onClick={() => {
                    handleOpenLinkedIn();
                    setShowModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>Öppna LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
