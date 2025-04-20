import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UploadScreen from '@/components/UploadScreen';
import ScanningScreen from '@/components/ScanningScreen';
import ResultsScreen from '@/components/ResultsScreen';
import { AnalysisResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type AppState = 'upload' | 'scanning' | 'results';

export default function Home() {
  const [state, setState] = useState<AppState>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string || null);
    };
    reader.readAsDataURL(file);
    
    // Change to scanning state
    setState('scanning');
    
    // Submit the file for analysis
    analyzeImage(file);
  };

  const analyzeImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setResult(data);
      
      // After a delay to show the scanning animation, switch to results
      setTimeout(() => {
        setState('results');
      }, 3500);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error analyzing image",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setState('upload');
    }
  };

  const handleScanAgain = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setState('upload');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow px-4 py-6 flex flex-col items-center justify-center">
        {state === 'upload' && (
          <UploadScreen onFileSelect={handleFileSelect} />
        )}
        
        {state === 'scanning' && previewUrl && (
          <ScanningScreen previewUrl={previewUrl} />
        )}
        
        {state === 'results' && result && (
          <ResultsScreen result={result} onScanAgain={handleScanAgain} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
