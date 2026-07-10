'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Assessment hooks
export function useAssessments() {
  return useQuery({
    queryKey: ['assessments'],
    queryFn: async () => {
      const res = await api.get('/assessment')
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateAssessment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/assessment', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] })
      queryClient.invalidateQueries({ queryKey: ['recommendations'] })
    },
  })
}

// Mood hooks
export function useMoodHistory(days = 30) {
  return useQuery({
    queryKey: ['mood', days],
    queryFn: async () => {
      const res = await api.get(`/mood?days=${days}`)
      return res.data
    },
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    staleTime: 1 * 60 * 1000,
  })
}

export function useLogMood() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/mood', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood'] })
    },
  })
}

// Recommendations hooks
export function useRecommendations() {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const res = await api.get('/recommendations')
      return res.data
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000,
  })
}

// Emergency contacts hooks
export function useEmergencyContacts() {
  return useQuery({
    queryKey: ['emergency-contacts'],
    queryFn: async () => {
      const res = await api.get('/emergency')
      return res.data
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useAddEmergencyContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/emergency', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] })
    },
  })
}

export function useUpdateEmergencyContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put('/emergency', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] })
    },
  })
}

export function useDeleteEmergencyContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/emergency?id=${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] })
    },
  })
}

// Dashboard overview
export function useDashboardData() {
  const assessments = useAssessments()
  const mood = useMoodHistory()
  const recommendations = useRecommendations()

  return {
    assessments,
    mood,
    recommendations,
    isLoading: assessments.isLoading || mood.isLoading || recommendations.isLoading,
  }
}
