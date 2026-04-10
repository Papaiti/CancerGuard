import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { HealthData } from '@/src/types';
import { ChevronRight, ChevronLeft, Activity, Heart, User, AlertTriangle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.number().min(0).max(120),
  gender: z.enum(['male', 'female', 'other']),
  isSmoker: z.boolean(),
  smokingYears: z.number().optional(),
  familyHistory: z.boolean(),
  familyHistoryDetails: z.string().optional(),
  geneticHistory: z.boolean(),
  geneticHistoryDetails: z.string().optional(),
  symptoms: z.array(z.string()),
  weight: z.number().min(1),
  height: z.number().min(1),
  alcoholConsumption: z.enum(['none', 'occasional', 'regular']),
  physicalActivity: z.enum(['sedentary', 'moderate', 'active']),
  dietType: z.string(),
  useActionableDevices: z.boolean(),
  deviceTypes: z.array(z.string()).optional(),
  familyHistoryTypes: z.array(z.string()).optional(),
  geneticMarkers: z.array(z.string()).optional(),
});

interface AssessmentFormProps {
  onSubmit: (data: HealthData) => void;
  isLoading: boolean;
}

export default function AssessmentForm({ onSubmit, isLoading }: AssessmentFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<HealthData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: 30,
      gender: 'male',
      isSmoker: false,
      familyHistory: false,
      familyHistoryTypes: [],
      geneticHistory: false,
      geneticMarkers: [],
      symptoms: [],
      weight: 70,
      height: 170,
      alcoholConsumption: 'none',
      physicalActivity: 'moderate',
      dietType: 'Balanced',
      useActionableDevices: false,
      deviceTypes: [],
    }
  });

  const isSmoker = watch('isSmoker');
  const familyHistory = watch('familyHistory');
  const familyHistoryTypes = watch('familyHistoryTypes') || [];
  const geneticHistory = watch('geneticHistory');
  const geneticMarkers = watch('geneticMarkers') || [];
  const useActionableDevices = watch('useActionableDevices');
  const deviceTypes = watch('deviceTypes') || [];
  const symptoms = watch('symptoms');

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const toggleSymptom = (symptom: string) => {
    const current = symptoms || [];
    if (current.includes(symptom)) {
      setValue('symptoms', current.filter(s => s !== symptom));
    } else {
      setValue('symptoms', [...current, symptom]);
    }
  };

  const toggleDevice = (device: string) => {
    const current = deviceTypes || [];
    if (current.includes(device)) {
      setValue('deviceTypes', current.filter(d => d !== device));
    } else {
      setValue('deviceTypes', [...current, device]);
    }
  };

  const toggleFamilyCancer = (type: string) => {
    const current = familyHistoryTypes || [];
    if (current.includes(type)) {
      setValue('familyHistoryTypes', current.filter(t => t !== type));
    } else {
      setValue('familyHistoryTypes', [...current, type]);
    }
  };

  const toggleGeneticMarker = (marker: string) => {
    const current = geneticMarkers || [];
    if (current.includes(marker)) {
      setValue('geneticMarkers', current.filter(m => m !== marker));
    } else {
      setValue('geneticMarkers', [...current, marker]);
    }
  };

  const commonSymptoms = [
    'Unexplained weight loss',
    'Persistent cough',
    'Changes in bowel habits',
    'Unusual bleeding',
    'Lumps or thickening',
    'Persistent pain',
    'Fatigue',
    'Skin changes'
  ];

  const actionableDevices = [
    'Smart Watch (Heart Rate/Sleep)',
    'Continuous Glucose Monitor',
    'Smart Scale',
    'Blood Pressure Monitor',
    'Fitness Tracker'
  ];

  const commonFamilyCancers = [
    'Breast Cancer',
    'Colon Cancer',
    'Lung Cancer',
    'Prostate Cancer',
    'Pancreatic Cancer',
    'Ovarian Cancer',
    'Melanoma',
    'Leukemia'
  ];

  const commonGeneticMarkers = [
    'BRCA1 Mutation',
    'BRCA2 Mutation',
    'Lynch Syndrome (MLH1/MSH2)',
    'TP53 Mutation (Li-Fraumeni)',
    'APC Mutation (FAP)',
    'PALB2 Mutation',
    'CHEK2 Mutation'
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">Step {step} of {totalSteps}</span>
          <span className="text-sm font-medium">{Math.round((step / totalSteps) * 100)}% Complete</span>
        </div>
        <Progress value={(step / totalSteps) * 100} className="h-2" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>Let's start with some basic details about you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...register('name')} placeholder="Enter your full name" />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" {...register('age', { valueAsNumber: true })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <select 
                        id="gender" 
                        className="w-full p-2 border rounded-md bg-background"
                        {...register('gender')}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input id="weight" type="number" {...register('weight', { valueAsNumber: true })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input id="height" type="number" {...register('height', { valueAsNumber: true })} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="button" onClick={nextStep} className="ml-auto">
                    Next <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Lifestyle & Habits
                  </CardTitle>
                  <CardDescription>Your daily habits and devices play a significant role in your health risk.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="isSmoker" checked={isSmoker} onCheckedChange={(checked) => setValue('isSmoker', !!checked)} />
                    <Label htmlFor="isSmoker">Do you smoke?</Label>
                  </div>
                  {isSmoker && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                      <Label htmlFor="smokingYears">For how many years?</Label>
                      <Input id="smokingYears" type="number" {...register('smokingYears', { valueAsNumber: true })} />
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="alcohol">Alcohol Consumption</Label>
                    <select id="alcohol" className="w-full p-2 border rounded-md bg-background" {...register('alcoholConsumption')}>
                      <option value="none">None</option>
                      <option value="occasional">Occasional</option>
                      <option value="regular">Regular</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity">Physical Activity</Label>
                    <select id="activity" className="w-full p-2 border rounded-md bg-background" {...register('physicalActivity')}>
                      <option value="sedentary">Sedentary</option>
                      <option value="moderate">Moderate</option>
                      <option value="active">Active</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox id="useActionableDevices" checked={useActionableDevices} onCheckedChange={(checked) => setValue('useActionableDevices', !!checked)} />
                      <Label htmlFor="useActionableDevices" className="font-medium">Do you use actionable health devices?</Label>
                    </div>
                    {useActionableDevices && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {actionableDevices.map((device) => (
                          <div key={device} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-accent cursor-pointer transition-colors" onClick={() => toggleDevice(device)}>
                            <Checkbox id={device} checked={deviceTypes.includes(device)} />
                            <Label htmlFor={device} className="cursor-pointer text-xs">{device}</Label>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ChevronLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Next <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    History & Genetics
                  </CardTitle>
                  <CardDescription>Genetics and family history can influence your predisposition to certain conditions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="familyHistory" checked={familyHistory} onCheckedChange={(checked) => setValue('familyHistory', !!checked)} />
                      <Label htmlFor="familyHistory" className="font-medium">Family history of cancer?</Label>
                    </div>
                    {familyHistory && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {commonFamilyCancers.map((type) => (
                            <div key={type} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-accent cursor-pointer transition-colors" onClick={() => toggleFamilyCancer(type)}>
                              <Checkbox id={type} checked={familyHistoryTypes.includes(type)} />
                              <Label htmlFor={type} className="cursor-pointer text-xs">{type}</Label>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="familyHistoryDetails">Additional details (e.g., relationship, age at diagnosis)</Label>
                          <Input id="familyHistoryDetails" {...register('familyHistoryDetails')} placeholder="e.g. Father had colon cancer at 55" />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="pt-4 border-t space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="geneticHistory" checked={geneticHistory} onCheckedChange={(checked) => setValue('geneticHistory', !!checked)} />
                      <Label htmlFor="geneticHistory" className="font-medium">Known genetic predispositions?</Label>
                    </div>
                    {geneticHistory && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {commonGeneticMarkers.map((marker) => (
                            <div key={marker} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-accent cursor-pointer transition-colors" onClick={() => toggleGeneticMarker(marker)}>
                              <Checkbox id={marker} checked={geneticMarkers.includes(marker)} />
                              <Label htmlFor={marker} className="cursor-pointer text-xs">{marker}</Label>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="geneticHistoryDetails">Additional details</Label>
                          <Input id="geneticHistoryDetails" {...register('geneticHistoryDetails')} placeholder="e.g. BRCA1 mutation detected" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ChevronLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Next <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                    Current Symptoms
                  </CardTitle>
                  <CardDescription>Are you experiencing any of the following symptoms?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {commonSymptoms.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-accent cursor-pointer transition-colors" onClick={() => toggleSymptom(symptom)}>
                        <Checkbox id={symptom} checked={symptoms?.includes(symptom)} />
                        <Label htmlFor={symptom} className="cursor-pointer text-sm">{symptom}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="diet">Diet Type</Label>
                    <Input id="diet" {...register('dietType')} placeholder="e.g. High fiber, vegetarian, keto" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ChevronLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Analyzing...' : 'Submit Assessment'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
