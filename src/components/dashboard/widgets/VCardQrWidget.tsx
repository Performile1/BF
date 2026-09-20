import React, { useState } from 'react';
import { QrCode, Share2, Copy, Check, Download } from 'lucide-react';
import { WidgetComponentProps } from '../../../types/widgets';
import { getConnectUrl, downloadVCard } from '../../../utils/vcard';

export const VCardQrWidget: React.FC<WidgetComponentProps> = ({ currentUser }) => {
  const [copied, setCopied] = useState(false);
  const connectUrl = getConnectUrl(currentUser.id);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(connectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadVCard(currentUser);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 tracking-tight">Mitt Visitkort (vCard)</h3>
              <p className="text-[10px] text-gray-500">Direkt QR & Smart Connect</p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
            title="Ladda ner .vcf kontaktfil"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* QR Code */}
        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-center my-2">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(connectUrl)}`}
            alt="vCard QR"
            className="w-24 h-24 mx-auto rounded-lg mix-blend-multiply"
          />
          <p className="text-[10px] text-gray-500 mt-1.5 font-mono">
            Skanna för kontakt & nätverkskoppling
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
        <span className="text-[10px] text-gray-400 truncate max-w-[120px]">
          {connectUrl.replace(/^https?:\/\//, '')}
        </span>
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Kopierad!' : 'Kopiera länk'}
        </button>
      </div>
    </div>
  );
};
