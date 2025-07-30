import React, { useState, useEffect } from 'react';
import { Company } from '../types';
import { Copy, Send, Loader, Sparkles, X, RefreshCw, Building, User, Briefcase, MapPin } from 'lucide-react';
import * as webllm from "@mlc-ai/web-llm";

interface AIEmailGeneratorProps {
  company: Company;
  onClose: () => void;
}

// Global engine instance to avoid reloading
let globalEngine: webllm.MLCEngineInterface | null = null;

// Real AI email generation using WebLLM
const generateRealAIEmail = async (company: Company, onProgress?: (message: string) => void): Promise<string> => {
  const { companyName, firstName, lastName, industry, state, address } = company;
  
  try {
    onProgress?.('🤖 Initializing AI model...');
    
    // Initialize WebLLM engine if not already done
    if (!globalEngine) {
      onProgress?.('📥 Loading language model (first time may take a moment)...');
      
      globalEngine = new webllm.MLCEngine();
      
      // Use a lightweight model that actually works in browsers
      await globalEngine.reload("Llama-3.2-1B-Instruct-q4f32_1-MLC", {
        temperature: 0.8,
        top_p: 0.9,
      });
    }
    
         onProgress?.('✨ Generating content...');
    
    // Create a focused prompt for email generation
    const prompt = `You are a professional email writer helping international job seekers write compelling work and travel application emails.

Write a personalized, engaging email to apply for work opportunities at ${companyName}, a ${industry} company in ${state}, Australia.

COMPANY DETAILS:
- Company: ${companyName}
- Contact: ${firstName} ${lastName}
- Industry: ${industry}
- Location: ${state}, Australia
- Address: ${address}

REQUIREMENTS:
- Write a complete email with subject line
- Be professional but warm and personable
- Mention specific interest in the ${industry.toLowerCase()} industry
- Express enthusiasm for Australian culture and work experience
- Show genuine interest in the location (${state})
- Keep it concise but compelling
- Include a clear call to action

EMAIL:`;

    const response = await globalEngine.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 400,
      stream: false,
    });

    let generatedContent = response.choices[0]?.message?.content || '';
    
    // Clean up and format the response
    generatedContent = generatedContent.trim();
    
    // If no subject line, add one
    if (!generatedContent.includes('Subject:')) {
      generatedContent = `Subject: Work & Travel Application - International Candidate\n\n${generatedContent}`;
    }
    
    // Add signature placeholders if not present
    if (!generatedContent.includes('[Your Name]')) {
      generatedContent += `\n\nBest regards,\n[Your Name]\n[Your Phone Number]\n[Your Email Address]`;
    }
    
    onProgress?.('🎯 Email generation complete!');
    
    return generatedContent;
    
  } catch (error) {
    console.error('WebLLM generation failed:', error);
    onProgress?.('⚠️ AI generation failed, using fallback...');
    
    // Fallback to enhanced template system
    return generateFallbackEmail(company);
  }
};

// Enhanced fallback system with more variety
const generateFallbackEmail = (company: Company): string => {
  const { companyName, firstName, lastName, industry, state, address } = company;
  
  const openingStyles = [
    `I hope this email finds you well. I'm writing to express my strong interest in work and travel opportunities with ${companyName}.`,
    `I'm reaching out regarding potential work exchange opportunities with your ${industry.toLowerCase()} team at ${companyName}.`,
    `I hope you're having a great day! I'm excited to inquire about work and travel positions with ${companyName}.`,
    `Greetings from an enthusiastic international candidate! I'm very interested in joining ${companyName}'s team.`,
    `I trust this email finds you well. I'm writing to explore work and cultural exchange opportunities with ${companyName}.`
  ];

  const motivationStyles = [
    `As someone passionate about ${industry.toLowerCase()} and cultural exchange, I believe ${companyName} would be the perfect place to grow professionally while experiencing authentic Australian life.`,
    `Your ${industry.toLowerCase()} operation in ${state} caught my attention, and I'm eager to contribute my skills while immersing myself in the local community.`,
    `The opportunity to work with ${companyName} while exploring the beautiful region of ${state} is exactly what I'm looking for in my Australian adventure.`,
    `I'm drawn to ${companyName} not just for the professional experience in ${industry.toLowerCase()}, but also for the chance to be part of the ${state} community.`,
    `Combining work experience in ${industry.toLowerCase()} with cultural immersion in ${state} represents my ideal work and travel opportunity.`
  ];

  const closingStyles = [
    `I'm flexible with timing and fully committed to contributing meaningfully to your team. Could we arrange a conversation to discuss how I might fit with ${companyName}?`,
    `I'm ready to start whenever suits your needs and am committed to the full duration of any placement. I'd love to discuss how I can contribute to your success.`,
    `My schedule is flexible, and I'm prepared for a long-term commitment. Would you be open to a brief chat about potential opportunities?`,
    `I can adapt to your timeline and am serious about making a positive impact at ${companyName}. Perhaps we could discuss this further?`,
    `I'm available to start when convenient for you and am dedicated to being a valuable team member. Could we explore this opportunity together?`
  ];

  const subjects = [
    'Work & Travel Opportunity - Enthusiastic International Candidate',
    'International Work Exchange Application',
    'Work & Cultural Exchange Inquiry',
    'Eager Candidate for Work & Travel Program',
    'Work & Travel Partnership Opportunity'
  ];

  const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
  const randomOpening = openingStyles[Math.floor(Math.random() * openingStyles.length)];
  const randomMotivation = motivationStyles[Math.floor(Math.random() * motivationStyles.length)];
  const randomClosing = closingStyles[Math.floor(Math.random() * closingStyles.length)];

  return `Subject: ${randomSubject}

Dear ${firstName} ${lastName},

${randomOpening}

${randomMotivation}

As an international candidate, I offer:
• Strong work ethic and adaptability
• Fresh perspectives and cultural diversity
• Genuine enthusiasm for both work and community involvement
• Commitment to the full duration of any placement

${randomClosing}

Thank you for considering my application. I look forward to the possibility of contributing to ${companyName} while experiencing the wonderful culture of ${state}.

Best regards,
[Your Name]
[Your Phone Number]
[Your Email Address]

P.S. I'm particularly excited about exploring ${address.split(',')[0]} and becoming part of the local community!`;
};

const AIEmailGenerator: React.FC<AIEmailGeneratorProps> = ({ company, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [editableEmail, setEditableEmail] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string>('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgressMessage('🚀 Starting AI generation...');
    
    try {
      const email = await generateRealAIEmail(company, (message) => {
        setProgressMessage(message);
      });
      
      setGeneratedEmail(email);
      setEditableEmail(email);
    } catch (error) {
      console.error('Generation failed:', error);
      // Fallback to template system
      setProgressMessage('Using enhanced templates...');
      const email = generateFallbackEmail(company);
      setGeneratedEmail(email);
      setEditableEmail(email);
    } finally {
      setIsGenerating(false);
      setProgressMessage('');
    }
  };

  // Auto-generate email when component mounts
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editableEmail);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 5000);
  };

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(company.email);
    setIsEmailCopied(true);
    setTimeout(() => setIsEmailCopied(false), 2000);
  };

  const handleSendEmail = () => {
    const subject = editableEmail.split('\n')[0].replace('Subject: ', '');
    const body = editableEmail.split('\n').slice(2).join('\n');
    const mailtoUrl = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-2">
                <Sparkles className="w-6 h-6" />
              </div>
                              <div>
                  <h2 className="text-xl font-bold">AI Email Generator</h2>
                </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6">
            {/* Company Info */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <div className="flex items-center flex-wrap gap-1.5">
                <span className="text-xs font-medium text-gray-600 mr-1">Generating for:</span>
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors cursor-pointer group relative"
                  title={`Click to copy email: ${company.email}`}
                >
                  <Building className="w-2.5 h-2.5" />
                  <span>{company.companyName}</span>
                  {isEmailCopied ? (
                    <span className="text-green-600 ml-1 text-xs">✓</span>
                  ) : (
                    <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                  )}
                </button>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <User className="w-2.5 h-2.5" />
                  <span>{company.firstName} {company.lastName}</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Briefcase className="w-2.5 h-2.5" />
                  <span>{company.industry}</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>{company.state}</span>
                </span>
              </div>
            </div>

            {/* Generating State */}
            {isGenerating && (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Loader className="w-5 h-5 animate-spin text-purple-600" />
                  <p className="text-sm">{progressMessage || '🤖 Initializing AI model...'}</p>
                </div>
              </div>
            )}

            {/* Generated Email */}
            {generatedEmail && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">Your Personalized Email</h4>
                  </div>
                  <div className="bg-gray-50 rounded-xl border-l-4 border-purple-500 overflow-hidden">
                    <textarea
                      value={editableEmail}
                      onChange={(e) => setEditableEmail(e.target.value)}
                      className="w-full h-32 p-4 text-sm text-gray-800 font-mono leading-relaxed bg-transparent border-none resize-none focus:outline-none focus:ring-0"
                      placeholder="Your email content will appear here..."
                    />
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-100 text-xs text-gray-500">
                      <span>{editableEmail.length} characters</span>
                      <button
                        onClick={() => setEditableEmail(generatedEmail)}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Reset to Original
                      </button>
                    </div>
                  </div>
                </div>

                {/* Regenerate Button */}
                <div className="text-center">
                  <button
                    onClick={handleGenerate}
                    className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Generate Different Version</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Action Buttons */}
        {generatedEmail && (
          <div className="border-t border-gray-200 bg-white p-6">
            <div className="flex items-center space-x-3">
                              <button
                  onClick={handleCopy}
                  className={`flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3 font-medium rounded-xl transition-all duration-300 ${
                    isCopied 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  <span>{isCopied ? 'Copied!' : 'Copy Email'}</span>
                </button>
              
              <button
                onClick={handleSendEmail}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
              >
                <Send className="w-4 h-4" />
                <span>Send Email</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIEmailGenerator; 