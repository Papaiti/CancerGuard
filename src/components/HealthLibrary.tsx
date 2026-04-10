import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Shield, Apple, Search, Info } from 'lucide-react';

export default function HealthLibrary() {
  const cancerTypes = [
    {
      name: "Lung Cancer",
      prevention: "Avoid tobacco, test for radon, avoid carcinogens at work.",
      screening: "Annual low-dose CT scan for high-risk individuals (ages 50-80 with smoking history).",
      symptoms: ["Persistent cough", "Chest pain", "Shortness of breath", "Coughing up blood"]
    },
    {
      name: "Breast Cancer",
      prevention: "Maintain healthy weight, be physically active, limit alcohol.",
      screening: "Mammograms starting at age 40-50 depending on risk factors.",
      symptoms: ["Lump in breast", "Change in breast shape", "Skin dimpling", "Nipple discharge"]
    },
    {
      name: "Colorectal Cancer",
      prevention: "High-fiber diet, limit red/processed meats, regular exercise.",
      screening: "Colonoscopy or stool-based tests starting at age 45.",
      symptoms: ["Change in bowel habits", "Blood in stool", "Abdominal pain", "Weakness/fatigue"]
    },
    {
      name: "Skin Cancer",
      prevention: "Use sunscreen, wear protective clothing, avoid tanning beds.",
      screening: "Regular skin self-exams and professional dermatological checks.",
      symptoms: ["New or changing moles", "Sores that don't heal", "Pigment spreading", "Itchiness or pain"]
    }
  ];

  const nutritionTips = [
    { title: "Antioxidant Rich", desc: "Berries, leafy greens, and nuts help protect cells from damage." },
    { title: "Fiber Focus", desc: "Whole grains and legumes support digestive health and reduce colon risk." },
    { title: "Cruciferous Power", desc: "Broccoli, cauliflower, and kale contain compounds that may inhibit cancer growth." },
    { title: "Limit Processed", desc: "Reducing processed meats and sugary drinks lowers inflammation levels." }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">OncoGuard Health Library</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Empower yourself with knowledge. Explore our curated resources on cancer prevention, screening, and healthy living.
        </p>
      </div>

      <Tabs defaultValue="prevention" className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="prevention">Prevention & Types</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition & Lifestyle</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="prevention" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cancerTypes.map((type, i) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{type.name}</CardTitle>
                      <Badge variant="secondary">Education</Badge>
                    </div>
                    <CardDescription>Prevention and early detection</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-primary" /> Prevention
                      </h4>
                      <p className="text-sm text-muted-foreground">{type.prevention}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-1">
                        <Search className="w-4 h-4 text-blue-500" /> Screening
                      </h4>
                      <p className="text-sm text-muted-foreground">{type.screening}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-1">
                        <Info className="w-4 h-4 text-yellow-500" /> Key Symptoms
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {type.symptoms.map(s => (
                          <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {nutritionTips.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-primary/5 border-primary/10">
                  <CardContent className="pt-6">
                    <Apple className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-bold mb-2">{tip.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="bg-accent/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                The Role of Lifestyle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  Up to 40% of cancer cases are estimated to be preventable through lifestyle modifications. This includes maintaining a healthy weight, engaging in regular physical activity, and following a diet rich in fruits, vegetables, and whole grains.
                </p>
                <p className="mt-4">
                  Regular screenings are equally important as they can detect cancer at an early, more treatable stage, or even find precancerous lesions that can be removed before they turn into cancer.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
