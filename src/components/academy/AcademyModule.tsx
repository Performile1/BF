import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Clock, 
  Play, 
  Lock, 
  Unlock, 
  FileText, 
  Download, 
  QrCode, 
  Share2, 
  Calendar, 
  UserCheck, 
  Sparkles, 
  ExternalLink, 
  X, 
  Check, 
  ArrowRight,
  CreditCard,
  Building,
  HelpCircle,
  Trophy
} from 'lucide-react';
import { Course, Certificate, MentorSlot, QuizQuestion, Member, ActivityType } from '../../types';
import { formatSek } from '../../utils/calendar';
import { AdminInspect } from '../dev/AdminInspect';

interface AcademyModuleProps {
  currentUser: Member;
  courses: Course[];
  certificates: Certificate[];
  mentorSlots: MentorSlot[];
  quizQuestions: QuizQuestion[];
  onBookMentorSlot: (slotId: string) => void;
  onAwardCertificate: (cert: Certificate) => void;
  onUnlockCourse: (courseId: string) => void;
  onAwardPoints: (points: number, title: string, activityType: ActivityType) => void;
}

export const AcademyModule: React.FC<AcademyModuleProps> = ({
  currentUser,
  courses = [],
  certificates = [],
  mentorSlots = [],
  quizQuestions = [],
  onBookMentorSlot,
  onAwardCertificate,
  onUnlockCourse,
  onAwardPoints
}) => {
  const [activeTab, setActiveTab] = useState<'COURSES' | 'CERTIFICATES' | 'MENTORS' | 'QUIZ'>('COURSES');
  const [selectedCourseForQuiz, setSelectedCourseForQuiz] = useState<Course | null>(null);
  const [selectedCertificateModal, setSelectedCertificateModal] = useState<Certificate | null>(null);
  const [selectedCourseForUnlock, setSelectedCourseForUnlock] = useState<Course | null>(null);
  const [paymentSuccessNotice, setPaymentSuccessNotice] = useState<string | null>(null);

  // Quiz Engine State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScorePercent, setQuizScorePercent] = useState<number | null>(null);

  // Filter courses by category
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'B2B Tillväxt & Skalning', 'Styrelse & Finans', 'Mjuka Kompetenser', 'Ledarskap & Mentorskap'];

  const filteredCourses = courses.filter(c => {
    return selectedCategory === 'ALL' || c.category === selectedCategory;
  });

  const startQuiz = (course: Course) => {
    setSelectedCourseForQuiz(course);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScorePercent(null);
    setActiveTab('QUIZ');
  };

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct_index) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / quizQuestions.length) * 100);
    setQuizScorePercent(percent);
    setQuizSubmitted(true);

    if (percent >= 70 && selectedCourseForQuiz) {
      // Award certificate!
      const codeNumber = Math.floor(1000 + Math.random() * 9000);
      const newCert: Certificate = {
        id: `cert_${Date.now()}`,
        certificate_code: `BF-CERT-2026-${codeNumber}`,
        member_id: currentUser.id,
        member_name: currentUser.full_name,
        course_id: selectedCourseForQuiz.id,
        course_title: selectedCourseForQuiz.title,
        instructor_name: selectedCourseForQuiz.instructor_name,
        instructor_role: selectedCourseForQuiz.instructor_role,
        issue_date: new Date().toLocaleDateString('sv-SE', { day: '2-digit', month: 'short', year: 'numeric' }),
        verification_url: `https://boosterfriends.se/verify/BF-CERT-2026-${codeNumber}`,
        score_percent: percent,
        skills_covered: selectedCourseForQuiz.learning_outcomes || ['Affärskompetens', 'Pipeline Management']
      };

      onAwardCertificate(newCert);
      onAwardPoints(60, `Certifierad i ${selectedCourseForQuiz.title}`, 'SKILL_ENDORSEMENT');
    }
  };

  const handleUnlockCourse = (course: Course) => {
    onUnlockCourse(course.id);
    setPaymentSuccessNotice(`Booster Pack aktiverat för "${course.title}". Fullständig kurs och certifiering är nu upplåst!`);
    setSelectedCourseForUnlock(null);
    setTimeout(() => setPaymentSuccessNotice(null), 5000);
  };

  return (
    <AdminInspect
      component="AcademyModule.tsx"
      sourceTable="public.courses / certificates / mentor_slots"
      columns={['id', 'title', 'instructor', 'category', 'is_locked', 'price_sek', 'quiz_completed', 'certificate_hash']}
      notes="Booster Academy med micro-kurser, kunskapstest (quiz), mentorpass och certifikat"
    >
      <div className="space-y-6">

      {/* Success banner */}
      {paymentSuccessNotice && (
        <div className="bg-emerald-700 text-white p-4 rounded-2xl shadow-sm flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span className="text-xs font-bold">{paymentSuccessNotice}</span>
          </div>
          <button onClick={() => setPaymentSuccessNotice(null)} className="text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#800020]/10 flex items-center justify-center text-[#800020]">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 font-display">
                  Booster Friends Akademi & Certifiering
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#800020]/10 text-[#800020]">
                  V5 Master
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Spetsutbildningar, certifiering med QR-verifiering och 1-on-1 sparring med nätverkets toppmentorer.
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-3">
            <div className="bg-[#F4F5F7] px-3.5 py-2 rounded-xl text-center border border-gray-200">
              <div className="text-base font-black text-[#800020] font-display">
                {certificates.length}
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase">Erhållna Certifikat</div>
            </div>

            <div className="bg-[#F4F5F7] px-3.5 py-2 rounded-xl text-center border border-gray-200">
              <div className="text-base font-black text-gray-900 font-display">
                {mentorSlots.filter(s => s.is_booked && s.booked_by_member_id === currentUser.id).length}
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase">Bokade Mentorsessioner</div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1.5 border-t border-gray-100 pt-4 overflow-x-auto scrollbar-none">
          {[
            { id: 'COURSES', label: 'Kurskatalog & Booster Packs', icon: BookOpen },
            { id: 'CERTIFICATES', label: `Mina Certifikat (${certificates.length})`, icon: Award },
            { id: 'MENTORS', label: 'Mentor Matchmaking & Sparring', icon: Calendar },
            { id: 'QUIZ', label: 'Kunskapstest & Prov', icon: HelpCircle }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#800020] text-white shadow-xs'
                    : 'bg-[#F4F5F7] text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: KURSKATALOG & BOOSTER PACKS */}
      {activeTab === 'COURSES' && (
        <div className="space-y-5">
          {/* Filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#800020] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat === 'ALL' ? 'Alla Kategorier' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCourses.map(course => {
              const isGoldTier = currentUser.membership_level === 'GOLD';
              const isTierEligible = 
                course.level_required === 'BRONZE' ||
                (course.level_required === 'SILVER' && (currentUser.membership_level === 'SILVER' || isGoldTier)) ||
                (course.level_required === 'GOLD' && isGoldTier);
              
              const isUnlocked = isTierEligible || course.is_unlocked;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between hover:border-[#800020]/40 transition space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                        {course.category}
                      </span>
                      
                      {isUnlocked ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                          <Unlock className="w-3 h-3 text-emerald-600" />
                          <span>Upplåst</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1 border border-amber-300">
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>Kräver {course.level_required}</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-[#800020] transition font-display">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        {course.tagline}
                      </p>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Learning Outcomes */}
                    {course.learning_outcomes && (
                      <div className="bg-[#F4F5F7] p-3 rounded-2xl space-y-1.5 border border-gray-100">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          Du kommer att bemästra:
                        </div>
                        {course.learning_outcomes.map((out, idx) => (
                          <div key={idx} className="text-[11px] text-gray-700 flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{out}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Instructor Row */}
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                      <img
                        src={course.instructor_avatar}
                        alt={course.instructor_name}
                        className="w-9 h-9 rounded-xl object-cover border border-gray-200"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-gray-900">{course.instructor_name}</div>
                        <div className="text-[10px] text-gray-500">{course.instructor_role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {course.duration_hours} tim
                      </span>
                      <span>•</span>
                      <span>{course.modules_count} moduler</span>
                    </div>

                    {isUnlocked ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startQuiz(course)}
                          className="px-3 py-1.5 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Gör Certifieringstest</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedCourseForUnlock(course)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Köp Booster Pack ({formatSek(course.booster_pack_price_sek)})</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MINA CERTIFIKAT & A4 PDF GENERATOR */}
      {activeTab === 'CERTIFICATES' && (
        <div className="space-y-6">
          {certificates.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
              <Award className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-800">Inga erhållna certifikat än</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Slutför en kurs i katalogen och klara kunskapstestet med minst 70% för att erhålla ditt första officiella Booster Friends-diplom.
              </p>
              <button
                onClick={() => setActiveTab('COURSES')}
                className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold"
              >
                Utforska Kurskatalogen
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {certificates.map(cert => (
                <div
                  key={cert.id}
                  className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 hover:border-[#800020]/40 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#800020] bg-[#800020]/10 px-2 py-0.5 rounded">
                        {cert.certificate_code}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 mt-1 font-display">
                        {cert.course_title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Utfärdat till: <strong className="text-gray-800">{cert.member_name}</strong> • {cert.issue_date}
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-amber-600" />
                      <span className="text-[9px] font-black text-amber-800">{cert.score_percent}%</span>
                    </div>
                  </div>

                  <div className="bg-[#F4F5F7] p-3 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-600">
                      <QrCode className="w-4 h-4 text-gray-500" />
                      <span className="truncate text-[11px] font-mono">{cert.verification_url}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                      Verifierad
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedCertificateModal(cert)}
                      className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Visa A4 Certifikat & QR-kod</span>
                    </button>

                    <button
                      onClick={() => alert(`Länk kopierad: ${cert.verification_url}`)}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1"
                      title="Dela till LinkedIn"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MENTOR MATCHMAKING & SPARRING */}
      {activeTab === 'MENTORS' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-gray-200 space-y-2">
            <h3 className="text-sm font-bold text-gray-900 font-display">
              Boka 1-on-1 Sparring med Nätverkets Mentorer
            </h3>
            <p className="text-xs text-gray-500 max-w-2xl">
              Som Guldmedlem eller via Booster Pack ingår direkta 45-minuters sessioner med etablerade grundare, VC-partners och enterprise-säljcoacher.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mentorSlots.map(slot => {
              const isBookedByUser = slot.is_booked && slot.booked_by_member_id === currentUser.id;

              return (
                <div
                  key={slot.id}
                  className={`bg-white rounded-3xl border p-5 shadow-xs flex flex-col justify-between space-y-4 transition ${
                    isBookedByUser 
                      ? 'border-emerald-300 ring-2 ring-emerald-100' 
                      : slot.is_booked 
                      ? 'border-gray-200 opacity-60' 
                      : 'border-gray-200 hover:border-[#800020]/40'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={slot.mentor_avatar}
                        alt={slot.mentor_name}
                        className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 font-display">
                          {slot.mentor_name}
                        </h4>
                        <p className="text-[11px] text-gray-500 font-medium">
                          {slot.mentor_role} • {slot.company}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#F4F5F7] p-3 rounded-2xl space-y-1 text-xs">
                      <div className="font-bold text-gray-700">Specialitet:</div>
                      <div className="text-gray-600 text-[11px]">{slot.speciality}</div>
                    </div>

                    <div className="space-y-1 text-xs text-gray-700">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#800020]" />
                        <span>{slot.date_str}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{slot.time_slot} ({slot.duration_min} min)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isBookedByUser ? (
                      <div className="w-full py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold text-center border border-emerald-200 flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Din Bokning Bekräftad</span>
                      </div>
                    ) : slot.is_booked ? (
                      <div className="w-full py-2 rounded-xl bg-gray-100 text-gray-400 text-xs font-semibold text-center">
                        Uppbokad av annan medlem
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          onBookMentorSlot(slot.id);
                          onAwardPoints(20, `Bokat mentorsamtal med ${slot.mentor_name}`, 'MEETING_CONFIRMED');
                          alert(`Bokning bekräftad för ${slot.mentor_name} (${slot.date_str} kl ${slot.time_slot})! Kalenderinbjudan och Google Meet-länk har skickats.`);
                        }}
                        className="w-full py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Boka Sparring (+20 BP)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: QUIZ & KUNSKAPSPROV ENGINE */}
      {activeTab === 'QUIZ' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#800020] bg-[#800020]/10 px-2 py-0.5 rounded">
                Kunskapsprov & Certifiering
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1 font-display">
                {selectedCourseForQuiz ? selectedCourseForQuiz.title : 'Allmänt Certifieringsprov: Nätverksarkitektur'}
              </h3>
            </div>
            <span className="text-xs font-bold text-gray-500 font-mono">
              Fråga {currentQuestionIdx + 1} av {quizQuestions.length}
            </span>
          </div>

          {!quizSubmitted ? (
            <div className="space-y-5">
              {(() => {
                const currentQ = quizQuestions[currentQuestionIdx];
                return (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 leading-snug">
                      {currentQ.question}
                    </h4>

                    <div className="space-y-2.5">
                      {currentQ.options.map((opt, oIdx) => {
                        const isSelected = selectedAnswers[currentQ.id] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectAnswer(currentQ.id, oIdx)}
                            className={`w-full text-left p-3.5 rounded-2xl border text-xs transition flex items-start gap-3 ${
                              isSelected
                                ? 'bg-[#800020]/5 border-[#800020] text-gray-900 font-semibold'
                                : 'bg-[#F4F5F7] border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                              isSelected ? 'border-[#800020] bg-[#800020] text-white' : 'border-gray-300 text-gray-500'
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 disabled:opacity-40"
                >
                  Föregående
                </button>

                {currentQuestionIdx < quizQuestions.length - 1 ? (
                  <button
                    disabled={selectedAnswers[quizQuestions[currentQuestionIdx].id] === undefined}
                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <span>Nästa Fråga</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lämna In Prov</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Results Screen */
            <div className="text-center space-y-4 py-4">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                (quizScorePercent ?? 0) >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {(quizScorePercent ?? 0) >= 70 ? <Trophy className="w-8 h-8" /> : <HelpCircle className="w-8 h-8" />}
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 font-display">
                  {(quizScorePercent ?? 0) >= 70 ? 'Grattis, provet är godkänt!' : 'Provet ej godkänt'}
                </h4>
                <div className="text-3xl font-black text-[#800020] font-display mt-1">
                  {quizScorePercent}%
                </div>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  {(quizScorePercent ?? 0) >= 70
                    ? 'Ditt officiella Booster Friends Certifikat har utfärdats och sparats i ditt register med verifierbar QR-kod.'
                    : 'Minst 70% krävs för att erhålla certifikatet. Läs igenom kursmaterialet och försök igen.'}
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setSelectedAnswers({});
                    setCurrentQuestionIdx(0);
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Gör om provet
                </button>
                {(quizScorePercent ?? 0) >= 70 && (
                  <button
                    onClick={() => setActiveTab('CERTIFICATES')}
                    className="px-5 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    <span>Se Mitt Nya Certifikat</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: VERIFIERBART A4 CERTIFIKAT MED QR-KOD (V5 SPEC) */}
      {selectedCertificateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-gray-200 relative animate-in zoom-in-95 space-y-6">
            
            <button
              onClick={() => setSelectedCertificateModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Simulated A4 Certificate Sheet */}
            <div className="border-4 border-[#800020] p-8 rounded-2xl relative bg-gradient-to-b from-amber-50/20 via-white to-amber-50/10 shadow-xs space-y-6 text-center">
              
              {/* Watermark / Header */}
              <div className="space-y-1">
                <div className="text-[11px] font-black uppercase tracking-widest text-[#800020]">
                  Booster Friends Executive Academy
                </div>
                <h2 className="text-2xl font-black text-gray-900 font-display tracking-tight">
                  CERTIFICATE OF COMPLETION
                </h2>
                <div className="text-[11px] text-gray-400 font-serif italic">
                  Detta intygar härmed att
                </div>
              </div>

              {/* Recipient Name */}
              <div className="border-b border-gray-300 pb-2 max-w-md mx-auto">
                <div className="text-xl font-black text-[#800020] font-display">
                  {selectedCertificateModal.member_name}
                </div>
              </div>

              <div className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                framgångsrikt har genomfört och examinerats med godkänt resultat ({selectedCertificateModal.score_percent}%) i:
                <div className="text-base font-bold text-gray-900 font-display mt-1">
                  "{selectedCertificateModal.course_title}"
                </div>
              </div>

              {/* Signatures & QR Section */}
              <div className="pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 items-center text-left">
                
                {/* Instructor Signature */}
                <div className="space-y-1">
                  <div className="font-serif italic text-sm text-gray-800 border-b border-gray-300 pb-1">
                    {selectedCertificateModal.instructor_name}
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium">
                    {selectedCertificateModal.instructor_role}
                  </div>
                </div>

                {/* Seal / Emblem */}
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full border-2 border-[#800020] bg-amber-50 flex items-center justify-center mx-auto text-[#800020] shadow-xs">
                    <Award className="w-7 h-7" />
                  </div>
                  <div className="text-[9px] font-black text-[#800020] uppercase tracking-wider mt-1">
                    VERIFIED SEAL
                  </div>
                </div>

                {/* QR Code & Code */}
                <div className="flex flex-col items-end text-right">
                  <div className="p-1.5 bg-white border border-gray-300 rounded-lg shadow-2xs">
                    <QrCode className="w-12 h-12 text-[#800020]" />
                  </div>
                  <div className="text-[9px] font-mono text-gray-500 mt-1">
                    {selectedCertificateModal.certificate_code}
                  </div>
                  <div className="text-[9px] text-gray-400">
                    Utfärdat: {selectedCertificateModal.issue_date}
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-gray-500 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-[#800020]" />
                <span>Publik verifiering: <strong className="font-mono text-gray-700">{selectedCertificateModal.verification_url}</strong></span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Laddar ner PDF för ${selectedCertificateModal.certificate_code}...`)}
                  className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ladda Ner A4 PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: KÖP BOOSTER PACK */}
      {selectedCourseForUnlock && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-700">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    Lås Upp med Booster Pack
                  </h3>
                  <p className="text-[11px] text-gray-500">Engångsköp med full tillgång</p>
                </div>
              </div>
              <button onClick={() => setSelectedCourseForUnlock(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gray-900 font-display">
                {selectedCourseForUnlock.title}
              </h4>
              <p className="text-xs text-gray-500">
                {selectedCourseForUnlock.description}
              </p>
            </div>

            <div className="bg-[#F4F5F7] p-4 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-gray-600 font-medium">Pris (Engångsavgift):</span>
                <span className="text-xl font-black text-[#800020] font-display">
                  {formatSek(selectedCourseForUnlock.booster_pack_price_sek)}
                </span>
              </div>
              <p className="text-[10px] text-gray-400">
                Inkluderar kursmoduler, instuderingsfrågor, officiellt certifikat med QR-kod och 45 min mentor-sparring.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleUnlockCourse(selectedCourseForUnlock)}
                className="w-full py-2.5 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Betala via Swish / Företagskort</span>
              </button>

              <button
                onClick={() => handleUnlockCourse(selectedCourseForUnlock)}
                className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Building className="w-3.5 h-3.5" />
                <span>Fakturera Bolaget via Fortnox</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    </AdminInspect>
  );
};
