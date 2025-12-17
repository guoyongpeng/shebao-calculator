'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCalculationResults, getAvailableCities, getAvailableYears } from '@/lib/calculations'
import { Eye, TrendingUp, Users, DollarSign, AlertCircle } from 'lucide-react'

interface ResultItem {
  id: number
  employee_name: string
  city_name: string
  avg_salary: number
  contribution_base: number
  company_fee: number
  calculation_date: string
  year: string
}

export default function ResultsPage() {
  const [results, setResults] = useState<ResultItem[]>([])
  const [loading, setLoading] = useState(true)
  const [cities, setCities] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  // 加载选项数据
  const loadOptions = async () => {
    const [citiesList, yearsList] = await Promise.all([
      getAvailableCities(),
      getAvailableYears()
    ])
    setCities(citiesList)
    setYears(yearsList)
  }

  // 加载结果数据
  const loadResults = async () => {
    setLoading(true)
    try {
      const data = await getCalculationResults(selectedCity || undefined, selectedYear || undefined)
      setResults(data)
    } catch (error) {
      console.error('加载结果失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 格式化金额
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // 组件挂载时加载数据
  useEffect(() => {
    loadOptions()
    loadResults()
  }, [])

  // 筛选条件变化时重新加载
  useEffect(() => {
    loadResults()
  }, [selectedCity, selectedYear])

  // 计算总费用
  const totalCompanyFee = results.reduce((sum, result) => sum + result.company_fee, 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Eye className="w-8 h-8" />
              结果查询
            </h1>
            <p className="text-gray-600 mt-2">查看已计算的社保费用结果</p>
            {results.length === 0 && !loading && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-medium">暂无计算结果</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    请先前往"数据上传"页面上传城市标准和工资数据，然后执行计算
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 统计卡片 */}
          {results.length > 0 && (
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm">员工总数</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {new Set(results.map(r => r.employee_name)).size}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm">计算记录</p>
                      <p className="text-2xl font-bold text-green-900">{results.length}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm">平均工资</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {formatCurrency(Math.round(results.reduce((sum, r) => sum + r.avg_salary, 0) / results.length))}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm">总缴费</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {formatCurrency(totalCompanyFee)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 筛选器 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>筛选条件</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    城市
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">全部城市</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    年份
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">全部年份</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    共 {results.length} 条记录
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 结果表格 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>计算结果</span>
                {totalCompanyFee > 0 && (
                  <span className="text-lg font-normal">
                    总费用: {formatCurrency(totalCompanyFee)}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <p className="mt-2 text-gray-600">加载中...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无数据，请先上传数据并执行计算
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          员工姓名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          城市
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          年份
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          平均工资
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          缴费基数
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          公司缴费
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          计算时间
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.map((result) => (
                        <tr key={result.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {result.employee_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.city_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(result.avg_salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(result.contribution_base)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            {formatCurrency(result.company_fee)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(result.calculation_date)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}