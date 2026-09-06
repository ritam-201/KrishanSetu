import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  Mic,
  MicOff,
  Send,
  X,
  VolumeX,
  Sparkles,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const AiAssistant: React.FC = () => {
  const { user, queueTokens, payments, language } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /*
   * IMPORTANT:
   * user can be null before login/authentication is completed.
   * Never access user.id or user.name directly.
   */

  const farmerToken =
    queueTokens.find(
      (token) =>
        (user && token.farmerId === user.id) ||
        token.status === 'processing' ||
        token.status === 'next'
    ) || queueTokens[0];

  const farmerPayment =
    payments.find(
      (payment) =>
        user && payment.farmerId === user.id
    ) || payments[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Namaste ${
        user?.name || 'Farmer'
      }! I am your KisanSetu AI Procurement Assistant. Ask me about your token, live queue, MSP rates, or payment updates.`,
      timestamp: 'Just now',
    },
  ]);

  /*
   * Scroll to latest message
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  /*
   * Speech Recognition
   */
  const handleMicToggle = () => {
    const speechWindow = window as any;

    if (
      !(
        'webkitSpeechRecognition' in window ||
        'SpeechRecognition' in window
      )
    ) {
      alert(
        'Speech recognition is not supported in your browser. Please type your message.'
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        speechWindow.SpeechRecognition ||
        speechWindow.webkitSpeechRecognition;

      const recognition = new SpeechRecognition();

      recognition.lang =
        language === 'bn'
          ? 'bn-IN'
          : language === 'hi'
          ? 'hi-IN'
          : 'en-IN';

      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript =
          event.results[0][0].transcript;

        setInput(transcript);
        setIsListening(false);

        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      console.error(
        'Speech recognition error:',
        error
      );

      setIsListening(false);
    }
  };

  /*
   * Text-to-Speech
   */
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang =
      language === 'bn'
        ? 'bn-IN'
        : language === 'hi'
        ? 'hi-IN'
        : 'en-IN';

    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  /*
   * Send Message
   */
  const handleSend = (overrideText?: string) => {
    const query = overrideText ?? input;

    if (!query.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    if (!overrideText) {
      setInput('');
    }

    setTimeout(() => {
      let botReply =
        'I am here to help you navigate KisanSetu. You can ask about your active token, queue status, MSP rates, or payment updates.';

      const lower = query.toLowerCase();

      /*
       * TOKEN
       */
      if (
        lower.includes('token') ||
        lower.includes('next') ||
        lower.includes('when')
      ) {
        botReply = `Your token is ${
          farmerToken?.tokenCode || 'HAR-024'
        }. Your estimated waiting time is ${
          farmerToken?.estimatedWaitMinutes || 36
        } minutes at ${
          farmerToken?.centerName ||
          'Haripur Mandi Hub'
        }.`;
      }

      /*
       * QUEUE
       */
      else if (
        lower.includes('queue') ||
        lower.includes('ahead') ||
        lower.includes('position')
      ) {
        const farmersAhead = farmerToken
          ? Math.max(
              farmerToken.tokenNumber - 23,
              0
            )
          : 5;

        botReply = `You have approximately ${farmersAhead} farmers ahead of you in the queue. Current serving token is HAR-023. Your estimated waiting time is ${
          farmerToken?.estimatedWaitMinutes || 36
        } minutes.`;
      }

      /*
       * PAYMENT
       */
      else if (
        lower.includes('payment') ||
        lower.includes('money') ||
        lower.includes('bank')
      ) {
        const amount =
          farmerPayment?.netPayable || 92526;

        botReply = `Your recent procurement payout of ₹${amount.toLocaleString(
          'en-IN'
        )} is in ${
          farmerPayment?.status ||
          'PFMS Verification'
        }. Expected release: ${
          farmerPayment?.estimatedReleaseDate ||
          'within 2 days'
        }.`;
      }

      /*
       * MSP
       */
      else if (
        lower.includes('msp') ||
        lower.includes('price') ||
        lower.includes('rate')
      ) {
        botReply =
          'The Government MSP rate for Paddy (Grade A) is ₹2,203 per Quintal for the 2026 procurement season.';
      }

      /*
       * BOOKING
       */
      else if (
        lower.includes('book') ||
        lower.includes('slot')
      ) {
        botReply =
          'You can book a procurement slot from your dashboard. Select your crop, quantity, mandi center, date, time slot, and vehicle number.';
      }

      /*
       * CENTER
       */
      else if (
        lower.includes('center') ||
        lower.includes('mandi') ||
        lower.includes('location')
      ) {
        botReply = `Your current procurement center is ${
          farmerToken?.centerName ||
          'your assigned procurement center'
        }.`;
      }

      /*
       * VEHICLE
       */
      else if (
        lower.includes('vehicle') ||
        lower.includes('tractor')
      ) {
        botReply = farmerToken?.vehicleNumber
          ? `Your registered vehicle number is ${farmerToken.vehicleNumber}.`
          : 'No vehicle number is currently available in your active procurement booking.';
      }

      /*
       * GREETING
       */
      else if (
        lower.includes('hello') ||
        lower.includes('hi') ||
        lower.includes('namaste')
      ) {
        botReply =
          'Namaste! How can I assist your harvest procurement today?';
      }

      /*
       * THANK YOU
       */
      else if (
        lower.includes('thank') ||
        lower.includes('thanks')
      ) {
        botReply =
          'You are most welcome! I am always here to help with your KisanSetu procurement journey. 🌾';
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        botMessage,
      ]);

      speakText(botReply);
    }, 600);
  };

  return (
    <>
      {/* AI Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2.5 border border-emerald-400/30"
        title="Open AI Farmer Assistant"
      >
        <Bot className="w-6 h-6 animate-pulse" />

        <span className="text-sm font-bold tracking-wide pr-1">
          Kisan AI
        </span>

        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />

          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
        </span>
      </button>

      {/* AI Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 flex items-center justify-between shadow">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
                  <Sparkles className="w-5 h-5 text-emerald-300" />
                </div>

                <div>
                  <h3 className="font-bold text-base">
                    KisanSetu AI Assistant
                  </h3>

                  <p className="text-xs text-emerald-200">
                    Voice-Enabled Farmer Support
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {isSpeaking && (
                  <button
                    onClick={() => {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    }}
                    className="p-1.5 text-emerald-300 hover:text-white"
                    title="Mute Speech"
                  >
                    <VolumeX className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={() => {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                    setIsOpen(false);
                  }}
                  className="p-1.5 text-emerald-200 hover:text-white rounded-lg"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto flex space-x-2 no-scrollbar text-xs">
              <button
                onClick={() =>
                  handleSend(
                    'When is my next token scheduled?'
                  )
                }
                className="px-3 py-1 bg-white border border-slate-200 hover:border-emerald-500 rounded-full text-slate-700 whitespace-nowrap shadow-xs"
              >
                📅 Next Token?
              </button>

              <button
                onClick={() =>
                  handleSend(
                    'What is my current queue position?'
                  )
                }
                className="px-3 py-1 bg-white border border-slate-200 hover:border-emerald-500 rounded-full text-slate-700 whitespace-nowrap shadow-xs"
              >
                ⏱️ Queue Wait Time?
              </button>

              <button
                onClick={() =>
                  handleSend(
                    'What is the MSP price for Paddy?'
                  )
                }
                className="px-3 py-1 bg-white border border-slate-200 hover:border-emerald-500 rounded-full text-slate-700 whitespace-nowrap shadow-xs"
              >
                🌾 Paddy MSP Rate?
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-emerald-700 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>

                    <span
                      className={`block text-[10px] mt-1 text-right ${
                        msg.sender === 'user'
                          ? 'text-emerald-200'
                          : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
              <button
                onClick={handleMicToggle}
                className={`p-3 rounded-xl transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                }`}
                title={
                  isListening
                    ? 'Listening...'
                    : 'Click to speak'
                }
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
                placeholder={
                  isListening
                    ? 'Listening to voice...'
                    : 'Ask AI a question...'
                }
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />

              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow transition-all"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;