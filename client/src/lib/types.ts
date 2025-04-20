export interface AnalysisResult {
  auraScore: number;
  rizzScore: number;
  mysticTitle: string;
  analysisText: string;
}

export interface ImageAnalysis {
  id: number;
  imageId: string;
  auraScore: number;
  rizzScore: number;
  mysticTitle: string;
  analysisText: string;
  createdAt: Date;
}

export interface InsertImageAnalysis {
  imageId: string;
  auraScore: number;
  rizzScore: number;
  mysticTitle: string;
  analysisText: string;
}
