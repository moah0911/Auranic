import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UploadScreen from '@/components/UploadScreen';
import ScanningScreen from '@/components/ScanningScreen';
import ResultsScreen from '@/components/ResultsScreen';
import { AnalysisResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, Music2 } from "lucide-react";

type AppState = 'upload' | 'scanning' | 'results';
type AnalysisType = 'image' | 'song';

export default function Home() {
  const { user } = useAuth();
  const [state, setState] = useState<AppState>('upload');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('image');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [songName, setSongName] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const { toast } = useToast();

  // Handle file selection for image analysis
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
    setAnalysisType('image');
    
    // Submit the file for analysis
    analyzeImage(file);
  };

  // Handle song name submission for song analysis
  const handleSongSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songName.trim()) {
      toast({
        title: "Song name required",
        description: "Please enter a song name to analyze its vibe",
        variant: "destructive"
      });
      return;
    }
    
    // Change to scanning state
    setState('scanning');
    setAnalysisType('song');
    
    // Submit the song name for analysis
    analyzeSong(songName);
  };

  // Analyze image through API
  const analyzeImage = async (file: File) => {
    try {
      setIsAnalyzing(true);
      const formData = new FormData();
      formData.append('image', file);

      // Use the guest endpoint if not logged in, or user endpoint if logged in
      const endpoint = user ? '/api/analyze/image' : '/api/analyze/image/guest';
      
      const response = await fetch(endpoint, {
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
        setIsAnalyzing(false);
      }, 3500);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error analyzing image",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setState('upload');
      setIsAnalyzing(false);
    }
  };

  // Analyze song through API
  const analyzeSong = async (name: string) => {
    try {
      setIsAnalyzing(true);
      
      // Use the guest endpoint if not logged in, or user endpoint if logged in
      const endpoint = user ? '/api/analyze/song' : '/api/analyze/song/guest';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songName: name }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to analyze song');
      }

      const data = await response.json();
      setResult(data);
      
      // After a delay to show the scanning animation, switch to results
      setTimeout(() => {
        setState('results');
        setIsAnalyzing(false);
      }, 3500);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error analyzing song",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setState('upload');
      setIsAnalyzing(false);
    }
  };

  // Reset and go back to upload screen
  const handleScanAgain = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSongName('');
    setResult(null);
    setState('upload');
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      
      <main className="flex-grow px-4 py-8 flex flex-col items-center justify-center">
        {state === 'upload' && (
          <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              AURANIC
            </h1>
            <p className="text-xl text-center mb-8 text-gray-300">
              Reveal your mystical aura and rizz signature
            </p>

            <Tabs defaultValue="image" className="w-full max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-900/50">
                <TabsTrigger value="image" className="data-[state=active]:bg-purple-900/30">
                  <Camera className="mr-2 h-4 w-4" />
                  Face Aura
                </TabsTrigger>
                <TabsTrigger value="song" className="data-[state=active]:bg-pink-900/30">
                  <Music2 className="mr-2 h-4 w-4" />
                  Song Vibe
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="image">
                <Card className="border-purple-700 bg-black/70 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-center text-2xl">Upload Face or Character</CardTitle>
                    <CardDescription className="text-center text-gray-400">
                      Discover the mystical aura and rizz in human faces and Ghibli characters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UploadScreen onFileSelect={handleFileSelect} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="song">
                <Card className="border-pink-700 bg-black/70 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-center text-2xl">Enter Song Name</CardTitle>
                    <CardDescription className="text-center text-gray-400">
                      Reveal the mystical energy and rizz vibrations of any song
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSongSubmit} className="space-y-4">
                      <Input
                        type="text"
                        placeholder="Enter song name (e.g. 'Bohemian Rhapsody')"
                        value={songName}
                        onChange={(e) => setSongName(e.target.value)}
                        className="bg-gray-900/60 border-gray-700 text-white"
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-pink-700 to-purple-700 hover:from-pink-800 hover:to-purple-800"
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          "Analyze Song Vibe"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {state === 'scanning' && (
          <>
            {analysisType === 'image' && previewUrl && (
              <ScanningScreen previewUrl={previewUrl} />
            )}
            {analysisType === 'song' && (
              <div className="w-full max-w-xl flex flex-col items-center justify-center space-y-8 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  Analyzing vibrations in "{songName}"...
                </div>
                <div className="w-full max-w-md h-64 relative overflow-hidden border-2 border-purple-600 rounded-lg bg-black/20 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Music2 className="h-24 w-24 text-purple-500 opacity-30" />
                  </div>
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                  <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                    <div className="h-2 w-64 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-400 to-pink-600 w-2/3 animate-pulse"></div>
                    </div>
                    <div className="text-sm text-gray-400">Reading mystical sound waves...</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {state === 'results' && result && (
          <ResultsScreen result={result} onScanAgain={handleScanAgain} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
