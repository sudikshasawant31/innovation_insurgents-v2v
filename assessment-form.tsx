'use client'

import type React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'

interface AssessmentFormProps {
  step: string
  onNext: (data?: any) => void
  onPrev: () => void
  isFirstStep: boolean
  isLastStep: boolean
  formData: AssessmentFormData
  setFormData: React.Dispatch<React.SetStateAction<AssessmentFormData>>
}

export type AssessmentFormData = {
  age: string
  weight: string
  height: string
  symptoms: string[]
  sleepHours: string
  stressLevel: string
  waterIntake: string
  activity: string
  cycleRegular: string
  familyHistory: string[]
}

export default function AssessmentForm({
  step,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
  formData,
  setFormData,
}: AssessmentFormProps) {
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCheckbox = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field as keyof typeof formData].includes(value)
        ? (prev[field as keyof typeof formData] as string[]).filter((item) => item !== value)
        : [...(prev[field as keyof typeof formData] as string[]), value],
    }))
  }

  const handleNext = () => {
    onNext(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {step === 'basic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Enter your age"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Weight (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="Your weight"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Height (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                placeholder="Your height"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Menstrual Cycle</label>
            <select
              value={formData.cycleRegular}
              onChange={(e) => handleInputChange('cycleRegular', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select cycle regularity</option>
              <option value="regular">Regular (25-35 days)</option>
              <option value="irregular">Irregular</option>
              <option value="very-irregular">Very Irregular</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>
      )}

      {step === 'symptoms' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-4">Current Symptoms</label>
            <div className="space-y-3">
              {[
                'Irregular periods',
                'Heavy bleeding',
                'Fatigue',
                'Hair loss',
                'Weight gain',
                'Mood changes',
                'Acne',
                'Severe cramps',
                'Hot flashes',
                'None',
              ].map((symptom) => (
                <motion.label
                  key={symptom}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <input
                    type="checkbox"
                    checked={(formData.symptoms as string[]).includes(symptom)}
                    onChange={() => handleCheckbox('symptoms', symptom)}
                    className="w-5 h-5 rounded border-border"
                  />
                  <span className="text-sm font-medium">{symptom}</span>
                </motion.label>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'lifestyle' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Sleep (hours per night)</label>
            <select
              value={formData.sleepHours}
              onChange={(e) => handleInputChange('sleepHours', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select sleep duration</option>
              <option value="less-5">Less than 5 hours</option>
              <option value="5-7">5-7 hours</option>
              <option value="7-9">7-9 hours</option>
              <option value="more-9">More than 9 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Stress Level</label>
            <div className="flex gap-2">
              {['Low', 'Moderate', 'High', 'Very High'].map((level) => (
                <motion.button
                  key={level}
                  onClick={() => handleInputChange('stressLevel', level)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-2 rounded-lg border font-medium transition-colors ${
                    formData.stressLevel === level
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {level}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Water Intake (glasses per day)</label>
            <input
              type="number"
              value={formData.waterIntake}
              onChange={(e) => handleInputChange('waterIntake', e.target.value)}
              placeholder="How many glasses daily?"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Physical Activity</label>
            <select
              value={formData.activity}
              onChange={(e) => handleInputChange('activity', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary (little to no exercise)</option>
              <option value="light">Light (1-3 days/week)</option>
              <option value="moderate">Moderate (3-5 days/week)</option>
              <option value="very-active">Very Active (6-7 days/week)</option>
            </select>
          </div>
        </div>
      )}

      {step === 'medical' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-4">Family History</label>
            <div className="space-y-3">
              {[
                'PCOS',
                'Thyroid Disease',
                'Diabetes',
                'Heart Disease',
                'Anemia',
                'Autoimmune Disease',
                'None',
              ].map((condition) => (
                <motion.label
                  key={condition}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <input
                    type="checkbox"
                    checked={(formData.familyHistory as string[]).includes(condition)}
                    onChange={() => handleCheckbox('familyHistory', condition)}
                    className="w-5 h-5 rounded border-border"
                  />
                  <span className="text-sm font-medium">{condition}</span>
                </motion.label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4 pt-8 border-t border-border">
        {!isFirstStep && (
          <motion.button
            onClick={onPrev}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </motion.button>
        )}
        <motion.button
          onClick={handleNext}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 ml-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-lg transition-all"
        >
          {isLastStep ? 'Get Results' : 'Continue'}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  )
}
