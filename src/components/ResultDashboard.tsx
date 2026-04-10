import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AssessmentResult } from '@/src/types';
import { ShieldCheck, AlertCircle, Info, Calendar, ClipboardList, Stethoscope, Printer, Download, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { auth } from '@/src/lib/firebase';

interface ResultDashboardProps {
  result: AssessmentResult;
  onReset: () => void;
}

export default function ResultDashboard({ result, onReset }: ResultDashboardProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const user = auth.currentUser;

  const handleDownload = async () => {
    if (!reportRef.current) return;
    
    setIsDownloading(true);
    try {
      // Create a canvas from the report element
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200, // Force desktop width for consistent layout
        onclone: (clonedDoc) => {
          // Ensure print-only elements are visible in the clone
          const printOnly = clonedDoc.getElementsByClassName('print-only');
          for (let i = 0; i < printOnly.length; i++) {
            (printOnly[i] as HTMLElement).style.display = 'block';
          }
          // Ensure no-print elements are hidden in the clone
          const noPrint = clonedDoc.getElementsByClassName('no-print');
          for (let i = 0; i < noPrint.length; i++) {
            (noPrint[i] as HTMLElement).style.display = 'none';
          }
          
          // Fix for oklch issues by converting computed styles to inline RGB styles
          const allElements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i] as HTMLElement;
            try {
              const computedStyle = window.getComputedStyle(el);
              
              // Force colors to RGB/HSL which html2canvas supports
              if (computedStyle.color.includes('oklch')) {
                el.style.color = 'currentColor'; // Fallback
              }
              if (computedStyle.backgroundColor.includes('oklch')) {
                el.style.backgroundColor = 'transparent'; // Fallback
              }
              
              // More aggressive: replace all colors with their computed values
              // Browsers usually return computed colors as rgb() or rgba()
              const color = computedStyle.color;
              const bgColor = computedStyle.backgroundColor;
              const borderColor = computedStyle.borderColor;
              
              if (!color.includes('oklch')) el.style.color = color;
              if (!bgColor.includes('oklch')) el.style.backgroundColor = bgColor;
              if (!borderColor.includes('oklch')) el.style.borderColor = borderColor;
            } catch (e) {
              // Skip elements that can't be processed
            }
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
        hotfixes: ['px_scaling']
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CancerGuard_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 'Medium': return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'High': return 'text-rose-500 bg-rose-50 border-rose-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-emerald-500 hover:bg-emerald-600';
      case 'Medium': return 'bg-amber-500 hover:bg-amber-600';
      case 'High': return 'bg-rose-500 hover:bg-rose-600';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6" ref={reportRef}>
      <div className="flex justify-between items-center no-print">
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">Assessment Results</h2>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="flex items-center gap-2 border-primary/20 hover:bg-primary/5"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </Button>
          <button 
            onClick={onReset}
            className="text-sm font-medium text-primary hover:underline"
          >
            New Assessment
          </button>
        </div>
      </div>

      {/* Report Header (Visible in PDF/Print) */}
      <div className="print-only mb-8 border-b pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-primary" fill="currentColor" />
          <h1 className="text-2xl font-bold">CancerGuard Health Report</h1>
        </div>
        <p className="text-sm text-slate-500 font-medium">Personalized Cancer Risk Assessment for {user?.displayName || (result.summary.split(' ')[2] === 'user' ? result.summary.split(' ')[3] : 'Patient')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle>Risk Score</CardTitle>
            <CardDescription>Overall calculated risk index</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * result.riskScore) / 100}
                  className={result.riskLevel === 'High' ? 'text-rose-500' : result.riskLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{result.riskScore}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
            <Badge className={`mt-4 ${getRiskBadge(result.riskLevel)}`}>
              {result.riskLevel} Risk
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-t-4 border-t-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-secondary" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 leading-relaxed">
              {result.summary}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="w-4 h-4" />
              Assessed on {new Date(result.timestamp).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Recommendations
            </CardTitle>
            <CardDescription>Personalized steps to reduce your risk</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-600">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-500" />
              Suggested Screenings
            </CardTitle>
            <CardDescription>Medical tests you should discuss with your doctor</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.suggestedScreenings.map((screening, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-slate-600">{screening}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Alert variant="default" className="bg-amber-50 border-amber-200 no-print">
        <Info className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-700">Medical Disclaimer</AlertTitle>
        <AlertDescription className="text-amber-600">
          This assessment is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </AlertDescription>
      </Alert>

      <div className="print-only mt-12 pt-8 border-t text-center text-xs text-slate-400">
        Report generated by CancerGuard AI Health Assistant. Visit cancerguard.health for more information.
      </div>
    </div>
  );
}

