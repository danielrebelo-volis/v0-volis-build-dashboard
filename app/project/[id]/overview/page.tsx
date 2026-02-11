'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard-header'
import { ArrowLeft, Download, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

export default function ProjectOverview({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedActivity, setSelectedActivity] = useState('all')
  const [selectedWorkfront, setSelectedWorkfront] = useState('all')
  const [selectedOwner, setSelectedOwner] = useState('all')
  const [selectedCostMonth, setSelectedCostMonth] = useState('last-month')
  const [sortBy, setSortBy] = useState<'value' | 'plannedProgress' | 'actualProgress' | 'earnedValue' | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Data Quality Tab State
  const [dailyReportViewBy, setDailyReportViewBy] = useState('7days')
  const [dailyReportDateRange, setDailyReportDateRange] = useState({ start: '', end: '' })
  const [shiftViewBy, setShiftViewBy] = useState('7days')
  const [activityViewBy, setActivityViewBy] = useState('7days')
  const [shiftDateRange, setShiftDateRange] = useState({ start: '', end: '' })
  const [activityDateRange, setActivityDateRange] = useState({ start: '', end: '' })

  const project = {
    name: 'Metro Tower Development',
    city: 'Lisbon',
    country: 'Portugal',
    typology: 'Commercial',
    client: 'Investor Group ABC',
    contractValue: '$24.5M',
    manager: 'John Silva',
  }

  const progressData = [
    { week: '1', planned: 5, estimated: 4, actual: 3 },
    { week: '2', planned: 10, estimated: 8, actual: 5 },
    { week: '3', planned: 15, estimated: 14, actual: 8 },
    { week: '4', planned: 20, estimated: 18, actual: 12 },
    { week: '5', planned: 28, estimated: 26, actual: 18 },
    { week: '6', planned: 36, estimated: 34, actual: 25 },
    { week: '7', planned: 45, estimated: 42, actual: 34 },
    { week: '8', planned: 55, estimated: 51, actual: 45 },
    { week: '9', planned: 65, estimated: 60, actual: 50 },
  ]

  const costData = [
    { week: '1', baseline: 3.2, estimated: 3.2, actual: 3.3 },
    { week: '2', baseline: 6.1, estimated: 6.8, actual: 7.0 },
    { week: '3', baseline: 9.2, estimated: 10.1, actual: 10.3 },
    { week: '4', baseline: 12.4, estimated: 13.6, actual: 14.1 },
    { week: '5', baseline: 15.1, estimated: 17.5, actual: 18.0 },
    { week: '6', baseline: 19.1, estimated: 21.8, actual: 22.5 },
    { week: '7', baseline: 24.6, estimated: 26.5, actual: 27.5 },
    { week: '8', baseline: 28.4, estimated: 31.6, actual: 33.3 },
    { week: '9', baseline: 33.5, estimated: 37.1, actual: 40.0 },
  ]

  const getFilteredProgressData = () => {
    if (selectedActivity === 'all' && selectedWorkfront === 'all' && selectedOwner === 'all') {
      return progressData
    }
    return progressData.map(d => ({
      ...d,
      actual: Math.max(d.actual * 0.8, d.actual * (Math.random() * 0.3 + 0.7)),
      estimated: d.estimated * 0.9,
    }))
  }

  const getFilteredCostData = () => {
    if (selectedActivity === 'all' && selectedWorkfront === 'all' && selectedOwner === 'all') {
      return costData
    }
    return costData.map(d => ({
      ...d,
      actual: d.actual * 1.05,
      estimated: d.estimated * 1.02,
    }))
  }

  const activities = [
    { name: 'Site Preparation', value: 2.1, total_planned: '1000 m³', planned: '900 m³', executed: '850 m³', expected_completeness: (900 / 1000).toFixed(2), actual_completeness: 85, earnedValue: 1.785, status: 'Ongoing', estimated_execution: '750 m³', actual_execution: '650 m³', forecast_deadline: '15/03/2024' },
    { name: 'Foundation Work', value: 5.2, total_planned: '2000 m³', planned: '1400 m³', executed: '1200 m³', expected_completeness: (1400 / 2000).toFixed(2), actual_completeness: 60, earnedValue: 3.12, status: 'Ongoing', estimated_execution: '1100 m³', actual_execution: '900 m³', forecast_deadline: '20/04/2024' },
    { name: 'Structure Assembly', value: 8.5, total_planned: '150 units', planned: '110 units', executed: '90 units', expected_completeness: (110 / 150).toFixed(2), actual_completeness: 60, earnedValue: 5.1, status: 'Ongoing', estimated_execution: '80 units', actual_execution: '65 units', forecast_deadline: '10/05/2024' },
    { name: 'Mechanical Systems', value: 4.3, total_planned: '45 systems', planned: '10 units', executed: '0 units', expected_completeness: (10 / 45).toFixed(2), actual_completeness: 0, earnedValue: 0, status: 'Not Started', estimated_execution: '5 units', actual_execution: '0 units', forecast_deadline: '15/06/2024' },
    { name: 'Finishing Works', value: 4.4, total_planned: '50 areas', planned: '10 areas', executed: '5 areas', expected_completeness: (10 / 50).toFixed(2), actual_completeness: 10, earnedValue: 0.44, status: 'Not Started', estimated_execution: '8 areas', actual_execution: '3 areas', forecast_deadline: '20/06/2024' },
    { name: 'Electrical Installation', value: 3.8, total_planned: '120 circuits', planned: '80 circuits', executed: '65 circuits', expected_completeness: (80 / 120).toFixed(2), actual_completeness: 54, earnedValue: 2.052, status: 'Ongoing', estimated_execution: '70 circuits', actual_execution: '55 circuits', forecast_deadline: '25/05/2024' },
    { name: 'Plumbing Systems', value: 2.9, total_planned: '85 connections', planned: '60 connections', executed: '55 connections', expected_completeness: (60 / 85).toFixed(2), actual_completeness: 65, earnedValue: 1.885, status: 'Ongoing', estimated_execution: '58 connections', actual_execution: '48 connections', forecast_deadline: '22/05/2024' },
    { name: 'HVAC Installation', value: 6.7, total_planned: '35 units', planned: '25 units', executed: '18 units', expected_completeness: (25 / 35).toFixed(2), actual_completeness: 51, earnedValue: 3.417, status: 'Ongoing', estimated_execution: '20 units', actual_execution: '15 units', forecast_deadline: '30/05/2024' },
    { name: 'Exterior Cladding', value: 3.2, total_planned: '800 m²', planned: '500 m²', executed: '420 m²', expected_completeness: (500 / 800).toFixed(2), actual_completeness: 53, earnedValue: 1.696, status: 'Ongoing', estimated_execution: '450 m²', actual_execution: '380 m²', forecast_deadline: '28/05/2024' },
    { name: 'Interior Partitions', value: 2.6, total_planned: '650 m²', planned: '400 m²', executed: '350 m²', expected_completeness: (400 / 650).toFixed(2), actual_completeness: 54, earnedValue: 1.404, status: 'Ongoing', estimated_execution: '375 m²', actual_execution: '320 m²', forecast_deadline: '26/05/2024' },
    { name: 'Roofing Works', value: 4.1, total_planned: '1200 m²', planned: '1000 m²', executed: '950 m²', expected_completeness: (1000 / 1200).toFixed(2), actual_completeness: 79, earnedValue: 3.239, status: 'Ongoing', estimated_execution: '980 m²', actual_execution: '870 m²', forecast_deadline: '18/05/2024' },
    { name: 'Flooring Installation', value: 1.9, total_planned: '900 m²', planned: '300 m²', executed: '180 m²', expected_completeness: (300 / 900).toFixed(2), actual_completeness: 20, earnedValue: 0.38, status: 'Not Started', estimated_execution: '250 m²', actual_execution: '150 m²', forecast_deadline: '10/07/2024' },
    { name: 'Painting & Decoration', value: 1.5, total_planned: '1100 m²', planned: '200 m²', executed: '50 m²', expected_completeness: (200 / 1100).toFixed(2), actual_completeness: 5, earnedValue: 0.075, status: 'Not Started', estimated_execution: '150 m²', actual_execution: '40 m²', forecast_deadline: '15/07/2024' },
  ]

  const economicTable = activities.map(activity => ({
    activity: activity.name,
    completeness: activity.completeness,
    baseline: activity.value * (activity.completeness / 100),
    actual: activity.value * (activity.completeness / 100) * 1.08,
  }))

  const costBreakdownData = [
    { category: 'Labour (MDO)', planned: 12.5, estimated: 12.8, actual: 13.2 },
    { category: 'Materials', planned: 8.3, estimated: 8.6, actual: 9.1 },
    { category: 'Equipment', planned: 5.2, estimated: 5.4, actual: 5.8 },
    { category: 'Indirect Costs', planned: 6.1, estimated: 6.3, actual: 6.7 },
    { category: 'Subcontracted', planned: 7.4, estimated: 7.7, actual: 8.2 },
  ]

  const getFilteredCostBreakdownData = () => {
    if (selectedActivity === 'all' && selectedWorkfront === 'all') {
      return costBreakdownData
    }
    return costBreakdownData.map(d => ({
      ...d,
      actual: d.actual * 0.95,
      planned: d.planned * 0.92,
      estimated: d.estimated * 0.93,
    }))
  }

  const handleSort = (column: 'value' | 'plannedProgress' | 'actualProgress' | 'earnedValue') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('desc')
    }
  }

  const getSortedActivities = () => {
    if (!sortBy) return activities

    const sorted = [...activities].sort((a, b) => {
      let aValue: number = 0
      let bValue: number = 0

      switch (sortBy) {
        case 'value':
          aValue = a.value
          bValue = b.value
          break
        case 'plannedProgress':
          aValue = parseFloat(a.expected_completeness)
          bValue = parseFloat(b.expected_completeness)
          break
        case 'actualProgress':
          aValue = a.actual_completeness
          bValue = b.actual_completeness
          break
        case 'earnedValue':
          aValue = a.earnedValue
          bValue = b.earnedValue
          break
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    })

    return sorted
  }

  // Data Quality Tab Data
  const dataQualityKPIs = [
    { label: 'Daily Report Files Uploaded', value: '235' },
    { label: 'Total Recorded Tasks', value: '6' },
    { label: 'Total Working Hours', value: '78.1k' },
    { label: 'Unique Reporting Days', value: '75' },
    { label: 'Unique Employees Logged', value: '225' },
    { label: 'Unique Equipment Used', value: '23' },
  ]

  const dataErrorsCompact = [
    { filename: 'Daily_Report_2024_02_01.csv', activity: 'Site Preparation', qty: 3 },
    { filename: 'Daily_Report_2024_02_02.csv', activity: 'Foundation Work', qty: 1 },
    { filename: 'Daily_Report_2024_02_03.csv', activity: 'Structure Assembly', qty: 5 },
  ]

  const dataErrorsDetailed = [
    { report: 'Daily_Report_2024_02_01.csv', dateUpdate: '2024-02-01', activity: 'Site Prep', issue: 'Employee with multiple records', qty: 2 },
    { report: 'Daily_Report_2024_02_01.csv', dateUpdate: '2024-02-01', activity: 'Site Prep', issue: 'Missing equipment ID', qty: 1 },
    { report: 'Daily_Report_2024_02_02.csv', dateUpdate: '2024-02-02', activity: 'Foundation', issue: 'Invalid working hours', qty: 1 },
    { report: 'Daily_Report_2024_02_03.csv', dateUpdate: '2024-02-03', activity: 'Structure', issue: 'Duplicate entries', qty: 3 },
    { report: 'Daily_Report_2024_02_03.csv', dateUpdate: '2024-02-03', activity: 'Structure', issue: 'Timestamp mismatch', qty: 2 },
  ]

  // Daily report files data with actual and expected uploads
  const dailyReportFilesData7Days = [
    { date: 'Jan 25', actual: 8, expected: 10 },
    { date: 'Jan 26', actual: 12, expected: 15 },
    { date: 'Jan 27', actual: 10, expected: 12 },
    { date: 'Jan 28', actual: 15, expected: 18 },
    { date: 'Jan 29', actual: 14, expected: 20 },
    { date: 'Jan 30', actual: 18, expected: 20 },
    { date: 'Jan 31', actual: 16, expected: 18 },
  ]

  const dailyReportFilesData30Days = [
    { date: 'Jan 04', actual: 6, expected: 10 }, { date: 'Jan 05', actual: 9, expected: 12 }, { date: 'Jan 06', actual: 7, expected: 10 },
    { date: 'Jan 07', actual: 11, expected: 15 }, { date: 'Jan 08', actual: 13, expected: 16 }, { date: 'Jan 09', actual: 10, expected: 12 },
    { date: 'Jan 10', actual: 14, expected: 18 }, { date: 'Jan 11', actual: 12, expected: 14 }, { date: 'Jan 12', actual: 15, expected: 18 },
    { date: 'Jan 13', actual: 16, expected: 20 }, { date: 'Jan 14', actual: 14, expected: 16 }, { date: 'Jan 15', actual: 18, expected: 22 },
    { date: 'Jan 16', actual: 17, expected: 20 }, { date: 'Jan 17', actual: 19, expected: 22 }, { date: 'Jan 18', actual: 16, expected: 18 },
    { date: 'Jan 19', actual: 20, expected: 24 }, { date: 'Jan 20', actual: 18, expected: 20 }, { date: 'Jan 21', actual: 21, expected: 25 },
    { date: 'Jan 22', actual: 22, expected: 26 }, { date: 'Jan 23', actual: 19, expected: 22 }, { date: 'Jan 24', actual: 23, expected: 27 },
    { date: 'Jan 25', actual: 8, expected: 10 }, { date: 'Jan 26', actual: 12, expected: 15 }, { date: 'Jan 27', actual: 10, expected: 12 },
    { date: 'Jan 28', actual: 15, expected: 18 }, { date: 'Jan 29', actual: 14, expected: 20 }, { date: 'Jan 30', actual: 18, expected: 20 },
    { date: 'Jan 31', actual: 16, expected: 18 },
  ]

  const dailyReportFilesData6Months = [
    { date: 'Sep', actual: 280, expected: 320 }, { date: 'Oct', actual: 310, expected: 350 }, { date: 'Nov', actual: 290, expected: 330 },
    { date: 'Dec', actual: 320, expected: 360 }, { date: 'Jan', actual: 340, expected: 380 }, { date: 'Feb', actual: 300, expected: 340 },
  ]

  // Reports by shift data - only 3 shifts (Morning, Afternoon, Night)
  const reportsByShiftData7Days = [
    { date: 'Jan 25', 'Morning': 3, 'Afternoon': 2, 'Night': 1 },
    { date: 'Jan 26', 'Morning': 4, 'Afternoon': 3, 'Night': 2 },
    { date: 'Jan 27', 'Morning': 3, 'Afternoon': 3, 'Night': 2 },
    { date: 'Jan 28', 'Morning': 5, 'Afternoon': 4, 'Night': 2 },
    { date: 'Jan 29', 'Morning': 4, 'Afternoon': 4, 'Night': 3 },
    { date: 'Jan 30', 'Morning': 5, 'Afternoon': 5, 'Night': 3 },
    { date: 'Jan 31', 'Morning': 4, 'Afternoon': 5, 'Night': 3 },
  ]

  const reportsByShiftData30Days = [
    { date: 'Jan 04', 'Morning': 2, 'Afternoon': 2, 'Night': 1 }, { date: 'Jan 05', 'Morning': 3, 'Afternoon': 2, 'Night': 1 },
    { date: 'Jan 06', 'Morning': 2, 'Afternoon': 3, 'Night': 2 }, { date: 'Jan 07', 'Morning': 4, 'Afternoon': 3, 'Night': 2 },
    { date: 'Jan 08', 'Morning': 3, 'Afternoon': 4, 'Night': 2 }, { date: 'Jan 09', 'Morning': 3, 'Afternoon': 3, 'Night': 2 },
    { date: 'Jan 10', 'Morning': 5, 'Afternoon': 4, 'Night': 2 }, { date: 'Jan 11', 'Morning': 4, 'Afternoon': 3, 'Night': 3 },
    { date: 'Jan 12', 'Morning': 5, 'Afternoon': 4, 'Night': 2 }, { date: 'Jan 13', 'Morning': 5, 'Afternoon': 5, 'Night': 3 },
    { date: 'Jan 14', 'Morning': 4, 'Afternoon': 4, 'Night': 2 }, { date: 'Jan 15', 'Morning': 6, 'Afternoon': 5, 'Night': 3 },
    { date: 'Jan 16', 'Morning': 5, 'Afternoon': 5, 'Night': 3 }, { date: 'Jan 17', 'Morning': 6, 'Afternoon': 6, 'Night': 3 },
    { date: 'Jan 18', 'Morning': 5, 'Afternoon': 4, 'Night': 2 }, { date: 'Jan 19', 'Morning': 7, 'Afternoon': 6, 'Night': 3 },
    { date: 'Jan 20', 'Morning': 6, 'Afternoon': 5, 'Night': 3 }, { date: 'Jan 21', 'Morning': 7, 'Afternoon': 7, 'Night': 3 },
    { date: 'Jan 22', 'Morning': 7, 'Afternoon': 6, 'Night': 4 }, { date: 'Jan 23', 'Morning': 6, 'Afternoon': 6, 'Night': 3 },
    { date: 'Jan 24', 'Morning': 7, 'Afternoon': 7, 'Night': 4 }, { date: 'Jan 25', 'Morning': 3, 'Afternoon': 2, 'Night': 1 },
    { date: 'Jan 26', 'Morning': 4, 'Afternoon': 3, 'Night': 2 }, { date: 'Jan 27', 'Morning': 3, 'Afternoon': 3, 'Night': 2 },
    { date: 'Jan 28', 'Morning': 5, 'Afternoon': 4, 'Night': 2 }, { date: 'Jan 29', 'Morning': 4, 'Afternoon': 4, 'Night': 3 },
    { date: 'Jan 30', 'Morning': 5, 'Afternoon': 5, 'Night': 3 }, { date: 'Jan 31', 'Morning': 4, 'Afternoon': 5, 'Night': 3 },
  ]

  const reportsByActivityData = [
    { date: 'Jan 25', 'Sleepers-Production': 3, 'Ballast': 2, 'Flashbutt-Welding': 2, 'Inspection': 1, total: 8 },
    { date: 'Jan 26', 'Sleepers-Production': 5, 'Ballast': 3, 'Flashbutt-Welding': 3, 'Inspection': 1, total: 12 },
    { date: 'Jan 27', 'Sleepers-Production': 4, 'Ballast': 3, 'Flashbutt-Welding': 2, 'Inspection': 1, total: 10 },
    { date: 'Jan 28', 'Sleepers-Production': 6, 'Ballast': 4, 'Flashbutt-Welding': 4, 'Inspection': 1, total: 15 },
    { date: 'Jan 29', 'Sleepers-Production': 5, 'Ballast': 4, 'Flashbutt-Welding': 4, 'Inspection': 1, total: 14 },
    { date: 'Jan 30', 'Sleepers-Production': 8, 'Ballast': 5, 'Flashbutt-Welding': 4, 'Inspection': 1, total: 18 },
    { date: 'Jan 31', 'Sleepers-Production': 7, 'Ballast': 4, 'Flashbutt-Welding': 4, 'Inspection': 1, total: 16 },
    { date: 'Feb 01', 'Sleepers-Production': 9, 'Ballast': 6, 'Flashbutt-Welding': 4, 'Inspection': 1, total: 20 },
    { date: 'Feb 02', 'Sleepers-Production': 10, 'Ballast': 7, 'Flashbutt-Welding': 4, 'Inspection': 1, total: 22 },
  ]

  // Filter logic for daily report files
  const getFilteredDailyReportData = () => {
    if (dailyReportViewBy === '7days') {
      return dailyReportFilesData7Days
    } else if (dailyReportViewBy === '30days') {
      return dailyReportFilesData30Days
    } else if (dailyReportViewBy === '6months') {
      return dailyReportFilesData6Months
    }
    return dailyReportFilesData7Days
  }

  // Filter logic for shift graph
  const getFilteredShiftData = () => {
    let data

    if (shiftViewBy === '7days') {
      data = reportsByShiftData7Days
    } else if (shiftViewBy === '30days') {
      data = reportsByShiftData30Days
    } else if (shiftViewBy === '6months') {
      // For 6 months, aggregate by month
      data = [
        { date: 'Sep', 'Morning': 65, 'Afternoon': 55, 'Night': 28 },
        { date: 'Oct', 'Morning': 72, 'Afternoon': 62, 'Night': 31 },
        { date: 'Nov', 'Morning': 68, 'Afternoon': 58, 'Night': 29 },
        { date: 'Dec', 'Morning': 75, 'Afternoon': 65, 'Night': 32 },
        { date: 'Jan', 'Morning': 80, 'Afternoon': 70, 'Night': 35 },
        { date: 'Feb', 'Morning': 70, 'Afternoon': 63, 'Night': 30 },
      ]
    }

    if (shiftDateRange.start && shiftDateRange.end) {
      data = data.filter(d => {
        const dateStr = d.date.replace(' ', '-')
        return dateStr >= shiftDateRange.start && dateStr <= shiftDateRange.end
      })
    }

    return data || reportsByShiftData7Days
  }

  // Filter logic for activity graph
  const getFilteredActivityData = () => {
    let data

    if (activityViewBy === '7days') {
      data = reportsByActivityData.slice(-7)
    } else if (activityViewBy === '30days') {
      // For 30 days, use extended data
      data = dailyReportFilesData30Days.map(d => ({
        date: d.date,
        'Sleepers-Production': Math.ceil(d.actual * 0.45),
        'Ballast': Math.ceil(d.actual * 0.32),
        'Flashbutt-Welding': Math.ceil(d.actual * 0.18),
        'Inspection': Math.ceil(d.actual * 0.05),
        total: d.actual,
      }))
    } else if (activityViewBy === '6months') {
      // For 6 months, show by month
      data = [
        { date: 'Sep', 'Sleepers-Production': 126, 'Ballast': 90, 'Flashbutt-Welding': 50, 'Inspection': 14, total: 280 },
        { date: 'Oct', 'Sleepers-Production': 140, 'Ballast': 99, 'Flashbutt-Welding': 56, 'Inspection': 15, total: 310 },
        { date: 'Nov', 'Sleepers-Production': 131, 'Ballast': 93, 'Flashbutt-Welding': 52, 'Inspection': 14, total: 290 },
        { date: 'Dec', 'Sleepers-Production': 144, 'Ballast': 102, 'Flashbutt-Welding': 58, 'Inspection': 16, total: 320 },
        { date: 'Jan', 'Sleepers-Production': 153, 'Ballast': 109, 'Flashbutt-Welding': 61, 'Inspection': 17, total: 340 },
        { date: 'Feb', 'Sleepers-Production': 135, 'Ballast': 96, 'Flashbutt-Welding': 54, 'Inspection': 15, total: 300 },
      ]
    }

    if (activityDateRange.start && activityDateRange.end) {
      data = data.filter(d => {
        const dateStr = d.date.replace(' ', '-')
        return dateStr >= activityDateRange.start && dateStr <= activityDateRange.end
      })
    }

    return data || reportsByActivityData.slice(-7)
  }

  const dailyReportFilesData = [
    { date: 'Jan 25', actual: 8, expected: 10 },
    { date: 'Jan 26', actual: 12, expected: 15 },
    { date: 'Jan 27', actual: 10, expected: 12 },
    { date: 'Jan 28', actual: 15, expected: 18 },
    { date: 'Jan 29', actual: 14, expected: 20 },
    { date: 'Jan 30', actual: 18, expected: 20 },
    { date: 'Jan 31', actual: 16, expected: 18 },
  ]

  return (
    <div className="min-h-screen bg-background grid-background">
      <DashboardHeader />

      <main className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <Link href={`/project/PRJ-007`}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Project
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Project Overview - {project.name}</h1>
            <p className="text-sm text-muted-foreground mt-2">{project.city}, {project.country} | {project.typology}</p>
          </div>
          <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-border/50 mb-8">
          {['overview', 'progress', 'economic', 'data-quality'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-semibold text-sm transition-all ${activeTab === tab
                ? 'text-foreground border-b-2 border-foreground'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                <SelectTrigger className="w-48 bg-secondary border-border/50">
                  <SelectValue placeholder="Activities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="a1">Site Preparation</SelectItem>
                  <SelectItem value="a2">Foundation Work</SelectItem>
                  <SelectItem value="a3">Structure Assembly</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedWorkfront} onValueChange={setSelectedWorkfront}>
                <SelectTrigger className="w-48 bg-secondary border-border/50">
                  <SelectValue placeholder="Workfronts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Workfronts</SelectItem>
                  <SelectItem value="section1">Section 1</SelectItem>
                  <SelectItem value="section2">Section 2</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedOwner} onValueChange={setSelectedOwner}>
                <SelectTrigger className="w-48 bg-secondary border-border/50">
                  <SelectValue placeholder="Activity Owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Owners</SelectItem>
                  <SelectItem value="mota">Mota-Engil</SelectItem>
                  <SelectItem value="sub1">Subcontractor 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Production S-Curve */}
            <div className="glass-card rounded-lg p-4 mb-6 border border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-4">Production S-Curve</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getFilteredProgressData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0,200,255,0.3)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="planned" stroke="#999999" name="Baseline" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="estimated" stroke="#00c8ff" name="Estimated" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="actual" stroke="#00ff88" name="Actual" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Row 1: Timeline Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Start Date</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Planned</span>
                    <span className="font-mono text-lg font-bold text-foreground">01/01/2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Actual</span>
                    <span className="font-mono text-lg font-bold text-success">01/02/2024</span>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">End Date</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Planned</span>
                    <span className="font-mono text-lg font-bold text-foreground">12/31/2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estimated</span>
                    <span className="font-mono text-lg font-bold text-destructive">01/12/2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Cumulative Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Planned Progress</p>
                <p className="font-mono text-5xl font-bold text-foreground">75%</p>
              </div>

              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Actual Cumulative Progress</p>
                <p className="font-mono text-5xl font-bold text-destructive">50%</p>
              </div>
            </div>

            {/* Row 3: Velocity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Avg. Weekly Progress (Last 4 weeks)</p>
                <div className="space-y-3">
                  <p className="font-mono text-3xl font-bold text-foreground">8.5%</p>
                  <p className="text-xs text-muted-foreground">Trend: <span className="text-success">+1.3% vs prior week</span></p>
                </div>
              </div>

              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Required Weekly Progress</p>
                <div className="space-y-3">
                  <p className="font-mono text-3xl font-bold text-foreground">7.8%</p>
                  <p className="text-xs text-muted-foreground">Target to meet deadline</p>
                </div>
              </div>
            </div>

            {/* Row 4: Earned Value */}
            <div className="glass-card rounded-lg p-4 border border-border/50 gap-4 mb-6">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Earned Value (EV) - Economic Value of Work Performed</p>
              <p className="font-mono text-4xl font-bold text-foreground">€15.46M</p>
              <p className="text-xs text-muted-foreground mt-2">Total value of completed activities based on 50% cumulative progress</p>
            </div>

            <div className="glass-card rounded-lg p-4 border border-border/50 gap-4 mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Activity Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Activity</th>
                      <th
                        className="text-left text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => handleSort('value')}
                      >
                        Value (€M) {sortBy === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Total execution planned</th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Estimated execution</th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Actual execution</th>
                      <th
                        className="text-left text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => handleSort('earnedValue')}
                      >
                        Earned Value (€M) {sortBy === 'earnedValue' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Forecast Deadline</th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedActivities().map((activity, idx) => (
                      <tr key={idx} className="border-b border-border/30 hover:bg-secondary/20">
                        <td className="py-3 text-foreground">{activity.name}</td>
                        <td className="py-3 text-foreground">€{activity.value.toFixed(1)}M</td>
                        <td className="py-3 text-muted-foreground">{activity.total_planned}</td>
                        <td className="py-3 text-muted-foreground">{activity.estimated_execution}</td>
                        <td className="py-3 text-muted-foreground">{activity.actual_execution}</td>
                        <td className="py-3 text-foreground">€{activity.earnedValue.toFixed(2)}M</td>
                        <td className="py-3 text-muted-foreground">{activity.forecast_deadline}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-1 rounded ${activity.status === 'Finished' ? 'bg-success/20 text-success' :
                            activity.status === 'Ongoing' ? 'bg-accent/20 text-accent' :
                              'bg-muted/30 text-muted-foreground'
                            }`}>
                            {activity.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Project Info */}
            <h2 className="text-lg font-semibold text-foreground mb-4 mt-8">Project Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Client</p>
                <p className="text-lg font-semibold text-foreground">{project.client}</p>
              </div>
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Project Manager</p>
                <p className="text-lg font-semibold text-foreground">{project.manager}</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-foreground mb-4 mt-8">Contract Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Contract Value</p>
                <p className="text-lg font-semibold text-foreground">€25.0 M</p>
              </div>
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Construction Cost</p>
                <p className="text-lg font-semibold text-foreground">€23.0 M</p>
              </div>
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Contract Deadline</p>
                <p className="text-lg font-semibold text-foreground">March 1, 2026</p>
              </div>
            </div>

            {/* Production Progress Control Section */}
            <h2 className="text-lg font-semibold text-foreground mb-4 mt-8">Production Progress Control</h2>

            {/* Production Control KPIs - 6 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
              <div className="glass-card rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Planned Accum. Progress</p>
                <p className="text-2xl font-bold text-foreground">75%</p>
              </div>
              <div className="glass-card rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Avg. Weekly Advance</p>
                <p className="text-2xl font-bold text-foreground">8.5%</p>
              </div>
              <div className="glass-card rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Current Delay</p>
                <p className="text-2xl font-bold text-chart-4">2 weeks</p>
              </div>
              <div className="glass-card rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Actual Accum. Progress</p>
                <p className="text-2xl font-bold text-destructive">50%</p>
              </div>
              <div className="glass-card rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Required Weekly Advance</p>
                <p className="text-2xl font-bold text-foreground">7.8%</p>
              </div>
              <div className="glass-card rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">AI Forecast Deadline</p>
                <p className="text-2xl font-bold text-foreground">March 15, 2026</p>
              </div>
            </div>

            {/* Production S-Curve */}
            <div className="glass-card rounded-lg p-4 mb-6 border border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-4">Production S-Curve</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0,200,255,0.3)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="planned" stroke="#999999" name="Baseline" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="estimated" stroke="#00c8ff" name="Estimated" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="actual" stroke="#00ff88" name="Actual" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Activity Table */}
            <div className="glass-card rounded-lg p-4 border border-border/50 mb-8">
              <h3 className="text-sm font-semibold text-foreground mb-4">Activity Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Activity</th>
                      <th
                        className="text-left text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => handleSort('value')}
                      >
                        Value (€M) {sortBy === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Total execution planned</th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Estimated execution</th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Actual execution</th>
                      <th
                        className="text-left text-xs text-muted-foreground font-semibold py-2 cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => handleSort('earnedValue')}
                      >
                        Earned Value (€M) {sortBy === 'earnedValue' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Forecast Deadline</th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedActivities().map((activity, idx) => (
                      <tr key={idx} className="border-b border-border/30 hover:bg-secondary/20">
                        <td className="py-3 text-foreground">{activity.name}</td>
                        <td className="py-3 text-foreground">€{activity.value.toFixed(1)}M</td>
                        <td className="py-3 text-muted-foreground">{activity.total_planned}</td>
                        <td className="py-3 text-muted-foreground">{activity.estimated_execution}</td>
                        <td className="py-3 text-muted-foreground">{activity.actual_execution}</td>
                        <td className="py-3 text-foreground">€{activity.earnedValue.toFixed(2)}M</td>
                        <td className="py-3 text-muted-foreground">{activity.forecast_deadline}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-1 rounded ${activity.status === 'Finished' ? 'bg-success/20 text-success' :
                            activity.status === 'Ongoing' ? 'bg-accent/20 text-accent' :
                              'bg-muted/30 text-muted-foreground'
                            }`}>
                            {activity.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Economic Control Section */}
            <h2 className="text-lg font-semibold text-foreground mb-4 mt-8">Economic Control</h2>

            {/* Economic Control KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Implicit Industrial Cost (CI)</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current</span>
                    <span className="text-lg font-bold text-foreground">€38.0M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-lg font-bold text-foreground">€68.5M</span>
                  </div>
                </div>
              </div>
              <div className="glass-card rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Operating Margin </p>
                <p className="text-3xl font-bold text-foreground">8.2%</p>
                <p className="text-xs text-muted-foreground mt-2">Baseline OM: 12.0%</p>
              </div>
            </div>

            {/* Cost S-Curve */}
            <div className="glass-card rounded-lg p-4 mb-6 border border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-4">Economic S-Curve</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0,200,255,0.3)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="baseline" stroke="#999999" name="Baseline" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="estimated" stroke="#00c8ff" name="Estimated" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="actual" stroke="#ff6b6b" name="Actual" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Economic Table */}
            <div className="glass-card rounded-lg p-4 border border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-4">Economic Summary Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Activity</th>
                      <th className="text-center text-xs text-muted-foreground font-semibold py-2">Baseline Cost<br />(for progress %)</th>
                      <th className="text-center text-xs text-muted-foreground font-semibold py-2">Actual Cost<br />(for progress %)</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Total Baseline</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Total Estimated</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Float</th>
                    </tr>
                  </thead>
                  <tbody>
                    {economicTable.map((row, idx) => {
                      const totalBaseline = row.baseline / (row.completeness / 100);
                      const totalEstimated = row.actual / (row.completeness / 100) * 1.05;
                      const floatWeeks = 2 - Math.floor(idx / 2);
                      return (
                        <tr key={idx} className="border-b border-border/30 hover:bg-secondary/20">
                          <td className="py-3 text-foreground">{row.activity}</td>
                          <td className="py-3 text-center text-foreground">€{row.baseline.toFixed(2)}M ({row.completeness}%)</td>
                          <td className="py-3 text-center text-foreground">€{row.actual.toFixed(2)}M ({row.completeness}%)</td>
                          <td className="py-3 text-right text-foreground">€{totalBaseline.toFixed(1)}M</td>
                          <td className="py-3 text-right text-foreground">€{totalEstimated.toFixed(1)}M</td>
                          <td className={`py-3 text-right font-semibold ${floatWeeks === 0 ? 'text-destructive' : 'text-foreground'}`}>{floatWeeks}w</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Data Quality Tab */}
        {activeTab === 'data-quality' && (
          <>
            {/* Top KPI Cards - 6 grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {dataQualityKPIs.map((kpi, idx) => (
                <div key={idx} className="glass-card rounded-lg p-4 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-2 truncate">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Data Errors Section - Two Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Compact Data Errors Table - Top Right */}
              <div className="lg:col-span-1">
                <div className="glass-card rounded-lg p-4 border border-border/50">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Data Errors Summary</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left text-muted-foreground font-semibold py-2">Daily Report</th>
                          <th className="text-left text-muted-foreground font-semibold py-2">Activity</th>
                          <th className="text-right text-muted-foreground font-semibold py-2">Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataErrorsCompact.map((error, idx) => (
                          <tr key={idx} className="border-b border-border/30 hover:bg-secondary/20">
                            <td className="py-2 text-foreground truncate text-xs">{error.filename.substring(0, 15)}...</td>
                            <td className="py-2 text-muted-foreground">{error.activity}</td>
                            <td className="py-2 text-right text-foreground font-semibold text-xs">{error.qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Placeholder for spacing - will be replaced with detailed table below */}
              <div className="lg:col-span-2"></div>
            </div>

            {/* Detailed Data Errors Table - Full Width */}
            <div className="glass-card rounded-lg p-4 border border-border/50 mb-8">
              <h3 className="text-sm font-semibold text-foreground mb-4">Detailed Data Issues</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Daily Report</th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Date Update</th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Activity</th>
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Issue</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataErrorsDetailed.map((error, idx) => (
                      <tr key={idx} className="border-b border-border/30 hover:bg-secondary/20">
                        <td className="py-3 text-foreground">{error.report}</td>
                        <td className="py-3 text-muted-foreground">{error.dateUpdate}</td>
                        <td className="py-3 text-foreground">{error.activity}</td>
                        <td className="py-3 text-destructive text-sm">{error.issue}</td>
                        <td className="py-3 text-right text-foreground font-semibold">{error.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Data Ingestion Timeline Charts */}
            <h2 className="text-lg font-semibold text-foreground mb-6 mt-8">Data Ingestion Timelines</h2>

            {/* Chart 1: Daily Report Files */}
            <div className="glass-card rounded-lg p-4 border border-border/50 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-sm font-semibold text-foreground">Daily Report Files Uploaded</h3>
                <div className="flex flex-wrap gap-2">
                  {/* View By Dropdown */}
                  <Select value={dailyReportViewBy} onValueChange={setDailyReportViewBy}>
                    <SelectTrigger className="w-40 bg-secondary text-base border-foreground font-semibold">
                      <SelectValue placeholder="View by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Filter Button */}

                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getFilteredDailyReportData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0,200,255,0.3)' }}
                  />
                  <Legend />
                  <Bar dataKey="actual" fill="#00c8ff" name="Actual" radius={[4, 4, 0, 0]} label={{ position: 'inside', fill: '#fff', fontSize: 11 }} />
                  <Bar dataKey="expected" fill="#ffd700" name="Expected" radius={[4, 4, 0, 0]} label={{ position: 'inside', fill: '#000', fontSize: 11 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2: Daily Report Files by Shift */}
            <div className="glass-card rounded-lg p-4 border border-border/50 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-sm font-semibold text-foreground">Daily Report Files by Shift</h3>
                <div className="flex flex-wrap gap-2">
                  {/* View By Dropdown */}
                  <Select value={shiftViewBy} onValueChange={setShiftViewBy}>
                    <SelectTrigger className="w-40 bg-secondary text-base font-semibold border-foreground">
                      <SelectValue placeholder="View by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Filter Button */}

                </div>
              </div>

              {/* Total Reports Display */}
              <div className="mb-3 text-right">
                <span className="text-foreground font-semibold">
                  Total Reports: {getFilteredShiftData().reduce((sum, d) => sum + (d['Morning'] || 0) + (d['Afternoon'] || 0) + (d['Night'] || 0), 0)}
                </span>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getFilteredShiftData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0,200,255,0.3)' }} />
                  <Legend />
                  <Bar dataKey="Morning" stackId="a" fill="#00c8ff" label={{ position: 'top', fill: '#fff', fontSize: 10 }} />
                  <Bar dataKey="Afternoon" stackId="a" fill="#ffa500" label={{ position: 'top', fill: '#fff', fontSize: 10 }} />
                  <Bar dataKey="Night" stackId="a" fill="#9333ea" label={{ position: 'top', fill: '#fff', fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 3: Daily Report Files by Activity - 100% Stacked */}
            <div className="glass-card rounded-lg p-4 border border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-sm font-semibold text-foreground">Daily Report Files by Activity</h3>
                <div className="flex flex-wrap gap-2">
                  {/* View By Dropdown */}
                  <Select value={activityViewBy} onValueChange={setActivityViewBy}>
                    <SelectTrigger className="w-40 bg-secondary text-base font-semibold border-foreground">
                      <SelectValue placeholder="View by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Filter Button */}

                </div>
              </div>

              {/* Total Reports Display */}
              <div className="mb-3 text-right">
                <span className="text-foreground font-semibold">
                  Total Reports: {getFilteredActivityData().reduce((sum, d) => sum + d.total, 0)}
                </span>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getFilteredActivityData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0,200,255,0.3)' }} />
                  <Legend />
                  <Bar dataKey="Sleepers-Production" stackId="a" fill="#00c8ff" />
                  <Bar dataKey="Ballast" stackId="a" fill="#00ff88" />
                  <Bar dataKey="Flashbutt-Welding" stackId="a" fill="#ffa500" />
                  <Bar dataKey="Inspection" stackId="a" fill="#ff6b6b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Economic Tab */}
        {activeTab === 'economic' && (
          <>
            {/* Top Section - Financial Health KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="glass-card rounded-lg p-6 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">Industrial Cost (CI)</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Spend</p>
                    <p className="text-4xl font-bold text-foreground">€38.0M</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
                    <p className="text-3xl font-bold text-accent">€68.5M</p>
                  </div>
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground">Budget Utilization: 55.4%</p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg p-6 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">Earned Value (EV)</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current EV</p>
                    <p className="text-4xl font-bold text-success">€35.2M</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cost Performance Index (CPI)</p>
                    <p className="text-3xl font-bold text-destructive">0.93</p>
                  </div>
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground">Actual vs EV: -€2.8M (Under-performing)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Economic S-Curve with Filters */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-4 mb-6">
                <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                  <SelectTrigger className="w-48 bg-secondary border-border/50">
                    <SelectValue placeholder="Filter by Activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="a1">A1 - Site Prep</SelectItem>
                    <SelectItem value="a2">A2 - Foundation</SelectItem>
                    <SelectItem value="a3">A3 - Structure</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedWorkfront} onValueChange={setSelectedWorkfront}>
                  <SelectTrigger className="w-48 bg-secondary border-border/50">
                    <SelectValue placeholder="Filter by Workfront" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Workfronts</SelectItem>
                    <SelectItem value="section1">Section 1</SelectItem>
                    <SelectItem value="section2">Section 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="glass-card rounded-lg p-4 border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-4">Economic S-Curve</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={getFilteredCostData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0,200,255,0.3)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="baseline" stroke="#999999" name="Baseline" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="actual" stroke="#ff6b6b" name="Actual" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost Breakdown by Nature */}
            <div className="glass-card rounded-lg p-4 border border-border/50 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-sm font-semibold text-foreground">Cost Breakdown by Nature</h3>
                <Select value={selectedCostMonth} onValueChange={setSelectedCostMonth}>
                  <SelectTrigger className="w-52 bg-secondary border-border/50">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-month">Last Month (March)</SelectItem>
                    <SelectItem value="february">February</SelectItem>
                    <SelectItem value="january">January</SelectItem>
                    <SelectItem value="december-2025">December 2025</SelectItem>
                    <SelectItem value="november-2025">November 2025</SelectItem>
                    <SelectItem value="october-2025">October 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getFilteredCostBreakdownData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="category" stroke="rgba(255,255,255,0.5)" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0,200,255,0.3)' }} formatter={(value) => `€${value.toFixed(1)}M`} />
                  <Legend />
                  <Bar dataKey="planned" fill="#999999" name="Planned" />
                  <Bar dataKey="estimated" fill="#00c8ff" name="Estimated Cost" />
                  <Bar dataKey="actual" fill="#ff6b6b" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card rounded-lg p-4 border border-border/50 gap-6 mb-8">
              <h3 className="text-sm font-semibold text-foreground mb-4">Economic Summary Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs text-muted-foreground font-semibold py-2">Activity</th>
                      <th className="text-center text-xs text-muted-foreground font-semibold py-2">Baseline Cost<br />(for progress %)</th>
                      <th className="text-center text-xs text-muted-foreground font-semibold py-2">Actual Cost<br />(for progress %)</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Total Baseline</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Total Estimated</th>
                      <th className="text-right text-xs text-muted-foreground font-semibold py-2">Float</th>
                    </tr>
                  </thead>
                  <tbody>
                    {economicTable.map((row, idx) => {
                      const totalBaseline = row.baseline / (row.completeness / 100);
                      const totalEstimated = row.actual / (row.completeness / 100) * 1.05;
                      const floatWeeks = 2 - Math.floor(idx / 2);
                      return (
                        <tr key={idx} className="border-b border-border/30 hover:bg-secondary/20">
                          <td className="py-3 text-foreground">{row.activity}</td>
                          <td className="py-3 text-center text-foreground">€{row.baseline.toFixed(2)}M ({row.completeness}%)</td>
                          <td className="py-3 text-center text-foreground">€{row.actual.toFixed(2)}M ({row.completeness}%)</td>
                          <td className="py-3 text-right text-foreground">€{totalBaseline.toFixed(1)}M</td>
                          <td className="py-3 text-right text-foreground">€{totalEstimated.toFixed(1)}M</td>
                          <td className={`py-3 text-right font-semibold ${floatWeeks === 0 ? 'text-destructive' : 'text-foreground'}`}>{floatWeeks}w</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </>
        )}
      </main>
    </div>
  )
}
