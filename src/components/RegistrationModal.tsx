import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, Dumbbell, Sparkles, ArrowRight, User, Mail, Phone } from 'lucide-react';

export const RegistrationModal: React.FC = () => {
  const {
    isRegistrationOpen,
    setIsRegistrationOpen,
    selectedServiceForJoin,
    setSelectedServiceForJoin,
    services,
    registerNewMember,
    setRole,
    language
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(() => {
    return selectedServiceForJoin ? [selectedServiceForJoin] : ['Group Aerobics & Cardio'];
  });
  const [hasChild, setHasChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState<number>(7);
  const [childNotes, setChildNotes] = useState('');

  // Emergency Contact
  const [emName, setEmName] = useState('');
  const [emRelationship, setEmRelationship] = useState('Spouse');
  const [emPhone, setEmPhone] = useState('');
  const [waiverSigned, setWaiverSigned] = useState(false);

  const [completedMember, setCompletedMember] = useState<any | null>(null);

  if (!isRegistrationOpen) return null;

  const handleClose = () => {
    setIsRegistrationOpen(false);
    setSelectedServiceForJoin(null);
    setCompletedMember(null);
    setStep(1);
  };

  const toggleService = (title: string) => {
    setSelectedServices((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!fullName || !email || !phone) return;
      setStep(2);
    } else if (step === 2) {
      if (selectedServices.length === 0) return;
      setStep(3);
    } else if (step === 3) {
      if (!emName || !emPhone || !waiverSigned) return;

      const newMember = registerNewMember({
        fullName,
        email,
        phone,
        services: selectedServices,
        emergencyContact: {
          name: emName,
          relationship: emRelationship,
          phone: emPhone
        },
        childProfile:
          hasChild || selectedServices.some((s) => s.toLowerCase().includes('taekwondo'))
            ? {
                childName: childName || 'Junior Athlete',
                age: Number(childAge),
                beltRank: 'White Belt (New Registrant)',
                medicalNotes: childNotes || 'No specific notes entered'
              }
            : undefined
      });

      setCompletedMember(newMember);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#ffffff] border border-[#dadce0] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Google Form Dialog Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f3f4] bg-[#f8fafd]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center text-white">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1f1f1f]">
                TM Sports Member Onboarding
              </h3>
              <p className="text-[11px] text-[#5f6368]">
                {completedMember ? 'Registration Complete' : `Step ${step} of 3 · Google Workspace Enrollment`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-[#747775] hover:text-[#1f1f1f] hover:bg-[#e0e2ec] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {completedMember ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-[#c4eed0] text-[#137333] rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-semibold text-[#1f1f1f]">
                  Application Submitted
                </h4>
                <div className="text-xs text-[#b06000] font-medium mt-1">
                  Status: PENDING COACH VERIFICATION
                </div>
              </div>

              <div className="bg-[#f8fafd] p-4 rounded-2xl border border-[#e0e2ec] text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Applicant Name:</span>
                  <span className="text-[#1f1f1f] font-semibold">{completedMember.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Account ID:</span>
                  <span className="text-[#1f1f1f] font-mono">{completedMember.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Pass Barcode:</span>
                  <span className="text-[#1a73e8] font-mono font-semibold">{completedMember.qrCodeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Selected Disciplines:</span>
                  <span className="text-[#1f1f1f] font-medium text-right max-w-[240px]">
                    {completedMember.services.join(', ')}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#5f6368] leading-relaxed max-w-md mx-auto">
                Coach Marcus Vance will review your enrollment and issue your digital Google Wallet pass. You will receive an alert once approved.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setRole('pending');
                    handleClose();
                  }}
                  className="px-6 py-2.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors shadow-xs"
                >
                  View as Pending Applicant in Dashboard
                </button>
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 text-xs font-medium text-[#444746] hover:bg-[#f1f3f4] border border-[#dadce0] rounded-full transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleNext} className="space-y-4">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#444746] mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Michael Thorne"
                      required
                      className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="m.thorne@domain.com"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#444746] mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#e8f0fe] rounded-2xl border border-[#d2e3fc] text-xs text-[#1a73e8]">
                    Registration is open for athletic members residing in USA & Canada.
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-4">
                  <label className="block text-xs font-medium text-[#444746]">
                    Select Training Discipline(s)
                  </label>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {services.map((srv) => {
                      const isSelected = selectedServices.includes(srv.title);
                      return (
                        <div
                          key={srv.id}
                          onClick={() => toggleService(srv.title)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                            isSelected
                              ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]'
                              : 'bg-[#ffffff] border-[#dadce0] text-[#444746] hover:bg-[#f8fafd]'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-[#1f1f1f]">{srv.title}</div>
                            <div className="text-[11px] text-[#5f6368]">{srv.scheduleSummary}</div>
                          </div>
                          <span className="font-semibold text-[#1f1f1f]">${srv.pricingMonthly}/mo</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Kids Taekwondo Profile */}
                  {(selectedServices.some((s) => s.toLowerCase().includes('taekwondo')) || hasChild) && (
                    <div className="p-4 bg-[#f8fafd] rounded-2xl border border-[#dadce0] space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#b06000]">
                        <Sparkles className="w-3.5 h-3.5 text-[#fbbc04]" />
                        <span>Youth Taekwondo Student Profile</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-[#444746] mb-1">
                            Child's Full Name
                          </label>
                          <input
                            type="text"
                            value={childName}
                            onChange={(e) => setChildName(e.target.value)}
                            placeholder="e.g. Leo Thorne"
                            className="w-full px-3 py-2 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-[#444746] mb-1">
                            Age (5–12)
                          </label>
                          <input
                            type="number"
                            min={5}
                            max={16}
                            value={childAge}
                            onChange={(e) => setChildAge(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="block text-xs font-medium text-[#444746]">
                      Emergency Contact
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={emName}
                        onChange={(e) => setEmName(e.target.value)}
                        placeholder="Contact Name"
                        required
                        className="w-full px-3 py-2 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                      />
                      <input
                        type="tel"
                        value={emPhone}
                        onChange={(e) => setEmPhone(e.target.value)}
                        placeholder="Contact Phone"
                        required
                        className="w-full px-3 py-2 bg-[#ffffff] border border-[#dadce0] rounded-xl text-xs text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8]"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#f8fafd] rounded-2xl border border-[#dadce0] text-xs text-[#5f6368] space-y-2">
                    <div className="font-semibold text-[#1f1f1f]">Athletic Participation Terms</div>
                    <p className="line-clamp-2">
                      I agree to standard sports readiness guidelines and confirm that I (and any registered minor child) am fit for conditioning.
                    </p>
                    <label className="flex items-center gap-2 cursor-pointer pt-1 text-[#1f1f1f] font-medium">
                      <input
                        type="checkbox"
                        checked={waiverSigned}
                        onChange={(e) => setWaiverSigned(e.target.checked)}
                        className="w-4 h-4 text-[#1a73e8] rounded border-[#dadce0]"
                      />
                      <span>I agree to the club waiver and terms</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-[#f1f3f4]">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                    className="px-5 py-2 text-xs font-medium text-[#444746] hover:bg-[#f1f3f4] border border-[#dadce0] rounded-full transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  disabled={step === 3 && !waiverSigned}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-[#dadce0] disabled:text-[#747775] rounded-full transition-all shadow-xs"
                >
                  <span>{step === 3 ? 'Submit Application' : 'Next'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
