import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqSearch, setFaqSearch] = useState('');

  const faqs = [
    {
      q: 'How do I book a procurement slot on KisanSetu?',
      a: 'Log in with your registered mobile number or Aadhaar. Navigate to "Procurement Schedule", choose your crop type (Paddy, Wheat, Mustard), select your nearest Mandi APMC center, and pick an open morning or afternoon slot. You will immediately receive a digital Mandi Pass with a confirmed QR code and Token number.'
    },
    {
      q: 'Can I change my procurement center or reschedule my slot?',
      a: 'Yes. Up to 12 hours before your scheduled arrival time, you can reschedule your slot or select another procurement center within your district without any penalty.'
    },
    {
      q: 'How does the live queue system work?',
      a: 'When you book a slot, you are assigned a digital token (e.g. #24). Our real-time queue tracks vehicle arrival, weighbridge processing, and inspection. You can view the live counter from your phone, see how many farmers are ahead of you, and arrive only when your turn is imminent.'
    },
    {
      q: 'What happens if my crop does not meet moisture standards?',
      a: 'Our on-site NABL-calibrated testing kit checks moisture immediately. If Paddy exceeds the 14% moisture threshold, the Mandi provides a drying apron facility or permits re-testing within 48 hours. A clear digital lab certificate is generated explaining exact parameters.'
    },
    {
      q: 'How quickly is the MSP payment credited to my bank account?',
      a: 'Once the procurement officer approves the electronic weighbridge slip and generates the Mandi Acceptance Certificate (J-Form), the payment request is routed via the Public Financial Management System (PFMS). Funds are credited directly to your Aadhaar-linked bank account within 24 to 48 banking hours.'
    },
    {
      q: 'Can I receive notifications on SMS and WhatsApp?',
      a: 'Yes. KisanSetu automatically dispatches SMS and WhatsApp messages for gate pass confirmation, live queue reminders (when you are 2 tokens away), crop test completion, and bank payment credit alerts.'
    },
    {
      q: 'Can I use the platform in Bengali (বাংলা) or Hindi (हिन्दी)?',
      a: 'Yes. KisanSetu is fully localized. You can toggle between English, বাংলা, and हिन्दी from the top navigation bar or inside your notification preferences at any time.'
    }
  ];

  const filteredFaqs = faqs.filter(
    f => f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <section id="faq-section" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Have Questions? We Have Answers.
          </h2>
          <p className="mt-3 text-base text-slate-600 font-normal">
            Everything you need to know about digital slot booking, token queueing, and MSP payments.
          </p>

          {/* FAQ Search Bar */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search farmer questions (e.g., payment, moisture, slot)..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-200 shadow-2xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-base font-bold text-slate-900">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-emerald-600 text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
