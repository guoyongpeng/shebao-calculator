'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, Calculator, Eye } from 'lucide-react'
import { parseCitiesExcel, parseSalariesExcel } from '@/lib/excelParser'
import { getSupabase } from '@/lib/supabase'
import { calculateContributions, saveCalculationResults, getAvailableCities, getAvailableYears } from '@/lib/calculations'

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [cities, setCities] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  // 加载城市和年份列表
  const loadOptions = async () => {
    const [citiesList, yearsList] = await Promise.all([
      getAvailableCities(),
      getAvailableYears()
    ])
    setCities(citiesList)
    setYears(yearsList)
  }

  // 处理城市数据上传
  const handleCityUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage(null)

    try {
      const cityData = await parseCitiesExcel(file)

      // 检查重复数据
      const { data: existingData, error: fetchError } = await getSupabase()
        .from('cities')
        .select('city_name, year')
        .in(
          cityData.map(c => `(${c.city_name},${c.year})`),
          {
            city_name: cityData.map(c => c.city_name),
            year: cityData.map(c => c.year)
          }
        )

      if (fetchError) throw fetchError

      // 过滤掉已存在的数据
      const existingKeys = new Set(
        (Array.isArray(existingData) ? existingData : []).map((item: any) => `${item.city_name}|${item.year}`)
      )

      const newCityData = cityData.filter(city =>
        !existingKeys.has(`${city.city_name}|${city.year}`)
      )

      const duplicateCount = cityData.length - newCityData.length

      if (newCityData.length === 0) {
        setMessage({
          type: 'error',
          text: `所有数据都已存在，跳过 ${duplicateCount} 条重复数据`
        })
      } else {
        // 只上传新数据
        const { error } = await getSupabase()
          .from('cities')
          .insert(newCityData)

        if (error) throw error

        setMessage({
          type: 'success',
          text: `成功上传 ${newCityData.length} 条新数据${duplicateCount > 0 ? `，跳过 ${duplicateCount} 条重复数据` : ''}`
        })
        loadOptions() // 重新加载选项
      }
    } catch (error) {
      setMessage({ type: 'error', text: `上传失败: ${error}` })
    } finally {
      setUploading(false)
      if (event.target) event.target.value = '' // 清空文件选择
    }
  }

  // 处理工资数据上传
  const handleSalaryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage(null)

    try {
      const salaryData = await parseSalariesExcel(file)

      // 检查重复数据（根据employee_id和month）
      const employeeMonthPairs = salaryData.map(s => `(${s.employee_id},${s.month})`)
      const { data: existingData, error: fetchError } = await getSupabase()
        .from('salaries')
        .select('employee_id, month')
        .or(
          employeeMonthPairs.map((pair) => {
            const [empId, month] = pair.slice(1, -1).split(',')
            return `employee_id.eq.${empId},month.eq.${month}`
          }).join(',')
        )

      if (fetchError) throw fetchError

      // 过滤掉已存在的数据
      const existingKeys = new Set(
        (Array.isArray(existingData) ? existingData : []).map((item: any) => `${item.employee_id}|${item.month}`)
      )

      const newSalaryData = salaryData.filter(salary =>
        !existingKeys.has(`${salary.employee_id}|${salary.month}`)
      )

      const duplicateCount = salaryData.length - newSalaryData.length

      if (newSalaryData.length === 0) {
        setMessage({
          type: 'error',
          text: `所有数据都已存在，跳过 ${duplicateCount} 条重复数据`
        })
      } else {
        // 只上传新数据
        const { error } = await getSupabase()
          .from('salaries')
          .insert(newSalaryData)

        if (error) throw error

        setMessage({
          type: 'success',
          text: `成功上传 ${newSalaryData.length} 条新数据${duplicateCount > 0 ? `，跳过 ${duplicateCount} 条重复数据` : ''}`
        })
      }
    } catch (error) {
      setMessage({ type: 'error', text: `上传失败: ${error}` })
    } finally {
      setUploading(false)
      if (event.target) event.target.value = '' // 清空文件选择
    }
  }

  // 执行计算
  const handleCalculation = async () => {
    if (!selectedCity || !selectedYear) {
      setMessage({ type: 'error', text: '请选择城市和年份' })
      return
    }

    setCalculating(true)
    setMessage(null)

    try {
      // 计算社保费用
      const results = await calculateContributions(selectedCity, selectedYear)

      if (results.length === 0) {
        setMessage({ type: 'error', text: '未找到工资数据' })
        return
      }

      // 保存结果
      await saveCalculationResults(results)

      setMessage({
        type: 'success',
        text: `成功计算并保存 ${results.length} 条结果。点击"结果查询"查看详细信息。`
      })
    } catch (error) {
      setMessage({ type: 'error', text: `计算失败: ${error}` })
    } finally {
      setCalculating(false)
    }
  }

  // 页面加载时获取城市和年份列表
  useEffect(() => {
    loadOptions()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 快速导航 */}
          <div className="mb-6 p-3 bg-gray-100 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                当前位置：<span className="font-medium">数据上传</span>
              </p>
              <a
                href="/results"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                查看计算结果
              </a>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">数据上传与计算</h1>
            <p className="text-gray-600 mt-2">上传数据并执行社保费用计算</p>
          </div>

          {/* 消息提示 */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              <div className="flex items-center justify-between">
                <span>{message.text}</span>
                {message.type === 'success' && message.text.includes('计算并保存') && (
                  <a
                    href="/results"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    查看结果
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* 上传城市数据 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  上传城市数据
                </CardTitle>
                <CardDescription>
                  上传城市社保标准数据（Excel格式）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Excel文件应包含以下列：<br />
                    city_name, year, base_min, base_max, rate
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleCityUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      disabled:opacity-50"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 上传工资数据 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  上传工资数据
                </CardTitle>
                <CardDescription>
                  上传员工工资数据（Excel格式）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Excel文件应包含以下列：<br />
                    employee_id, employee_name, month, salary_amount
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleSalaryUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-50 file:text-green-700
                      hover:file:bg-green-100
                      disabled:opacity-50"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 计算区域 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                执行计算
              </CardTitle>
              <CardDescription>
                选择城市和年份，计算社保费用
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    选择城市
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">请选择城市</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    选择年份
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">请选择年份</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleCalculation}
                  disabled={calculating || !selectedCity || !selectedYear}
                  className="w-full"
                >
                  {calculating ? '计算中...' : '执行计算'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}