'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UploadArtworkSlide from '../components/UploadArtworkSlide';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    designName: '',
    upiId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG or JPG)');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a design file');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const submissionData = new FormData();
      submissionData.append('name', formData.name);
      submissionData.append('phone', formData.phone);
      submissionData.append('designName', formData.designName);
      submissionData.append('upiId', formData.upiId);
      submissionData.append('file', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: submissionData,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage(`Thank you ${formData.name}! Your design "${formData.designName}" has been submitted successfully. We'll review it and get back to you soon.`);
        
        // Reset form
        setSelectedFile(null);
        setPreview(null);
        setFormData({
          name: '',
          phone: '',
          designName: '',
          upiId: '',
        });
        
        // Clear file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
      } else {
        throw new Error(result.error || 'Failed to submit design');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage('Sorry, there was an error submitting your design. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-300 relative overflow-hidden">
      <Navbar />
      <div className="z-10 relative mt-10">
        <UploadArtworkSlide />
      </div>
      
      {/* Desktop Background Image */}
      <div className="hidden md:block w-[1200px] h-[1560px] mx-auto relative z-0 mt-5">
        <Image
          src="/background/background7.jpg"
          alt="Abstract art background"
          width={1200}
          height={1080}
          priority
        />
      </div>
      
      {/* Mobile Background Image */}
      <div className="md:hidden absolute inset-0 z-0 h-full">
        <Image
          src="/background/background.jpg" 
          alt="Mobile background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Success Message */}
      {submitMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg max-w-md mx-4">
          <div className="flex items-center justify-between">
            <span>{submitMessage}</span>
            <button 
              onClick={() => setSubmitMessage('')}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="md:absolute inset-0 flex items-center justify-center z-10 mb-[5px]">
        <div className="w-full md:w-[700px] mx-4 md:mx-0 rounded-3xl overflow-hidden border border-white/20 shadow-xl bg-white/10 backdrop-blur-sm mt-4 md:mt-0 mb-20 md:mb-[5px]">
          <div className="p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif tracking-tight">
              Share Your Creativity
            </h1>
            <p className="text-gray-300 mb-6 md:mb-8 text-base md:text-lg">
              Upload your design and earn commissions with every purchase.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Design File (PNG/JPG)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-8 pb-10 md:pt-10 md:pb-12 rounded-xl bg-transparent">
                  <div className="space-y-3 text-center bg-transparent">
                    {preview ? (
                      <div className="mt-2">
                        <img
                          src={preview}
                          alt="Design preview"
                          className="rounded-lg border border-gray-400 max-h-60 object-contain mx-auto"
                        />
                      </div>
                    ) : (
                      <svg
                        className="mx-auto h-16 w-16 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <div className="flex justify-center text-sm text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <span>Choose a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Artist Info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                {['name', 'phone', 'designName', 'upiId'].map(field => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-300 mb-2 capitalize"
                    >
                      {field === 'upiId' ? 'UPI ID (For commissions)' : field === 'designName' ? 'Design Name' : field === 'phone' ? 'Phone Number' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      name={field}
                      id={field}
                      required
                      className="mt-1 block w-full bg-white/5 border border-white/10 rounded-lg shadow-sm py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={(formData as any)[field]}
                      onChange={handleInputChange}
                      placeholder={field === 'upiId' ? 'yourname@upi' : field === 'phone' ? '+91 XXXXXXXXXX' : ''}
                    />
                  </div>
                ))}
              </div>

              {/* Commission Info */}
              <div className="bg-purple-900/30 p-4 md:p-5 rounded-xl border border-purple-500/20">
                <h3 className="text-sm font-medium text-purple-200">Commission Program</h3>
                <p className="mt-2 text-sm text-purple-100">
                  You'll earn 20% of the profit every time someone buys your design. 
                  We'll send your commission to your UPI ID at the end of each month.
                </p>
              </div>

              {/* Submit */}
              <div className="pt-2 md:pt-4">
                <button
                  type="submit"
                  disabled={!selectedFile || isSubmitting}
                  className={`w-full flex justify-center items-center py-3 md:py-4 px-6 rounded-xl shadow-lg text-base md:text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ${
                    !selectedFile || isSubmitting 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:shadow-purple-500/20'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Design'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative md:absolute bottom-0 w-full z-20">
        <Footer />
      </div>
    </div>
  );
}