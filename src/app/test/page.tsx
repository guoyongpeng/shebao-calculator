'use client'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase'

interface City {
  id: number
  city_name: string
  year: string
  base_min: number
  base_max: number
  rate: number
  created_at?: string
}

interface Salary {
  id: number
  employee_id: string
  employee_name: string
  month: string
  salary_amount: number
  created_at?: string
}

interface Result {
  id: number
  employee_name: string
  city_name: string
  avg_salary: number
  contribution_base: number
  company_fee: number
  calculation_date: string
  year: string
  created_at?: string
}

export default function TestPage() {
  const [cities, setCities] = useState<City[]>([])
  const [salaries, setSalaries] = useState<Salary[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // 获取 cities 表数据
      const { data: citiesData, error: citiesError } = await getSupabase()
        .from('cities')
        .select('*')
        .order('created_at', { ascending: false })

      if (citiesError) throw citiesError

      // 获取 salaries 表数据
      const { data: salariesData, error: salariesError } = await getSupabase()
        .from('salaries')
        .select('*')
        .order('created_at', { ascending: false })

      if (salariesError) throw salariesError

      // 获取 results 表数据
      const { data: resultsData, error: resultsError } = await getSupabase()
        .from('results')
        .select('*')
        .order('calculation_date', { ascending: false })

      if (resultsError) throw resultsError

      setCities(citiesData || [])
      setSalaries(salariesData || [])
      setResults(resultsData || [])
    } catch (err: any) {
      setError(err.message || '获取数据失败')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">数据库测试页面</h1>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">加载数据中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">数据库测试页面</h1>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">数据库测试页面</h1>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            刷新数据
          </button>
        </div>

        {/* 数据统计 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Cities 表</h3>
            <p className="text-3xl font-bold text-blue-600">{cities.length}</p>
            <p className="text-gray-500">条记录</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Salaries 表</h3>
            <p className="text-3xl font-bold text-green-600">{salaries.length}</p>
            <p className="text-gray-500">条记录</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Results 表</h3>
            <p className="text-3xl font-bold text-purple-600">{results.length}</p>
            <p className="text-gray-500">条记录</p>
          </div>
        </div>

        {/* Cities 表数据 */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Cities 表数据</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    城市名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    年份
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    基数下限
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    基数上限
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    缴纳比例
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  cities.map((city) => (
                    <tr key={city.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {city.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {city.city_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {city.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {city.base_min.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {city.base_max.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(city.rate * 100).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {city.created_at ? new Date(city.created_at).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Salaries 表数据 */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Salaries 表数据</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    员工工号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    员工姓名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    月份
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    工资金额
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salaries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  salaries.slice(0, 20).map((salary) => (
                    <tr key={salary.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {salary.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {salary.employee_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {salary.employee_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {salary.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ¥{salary.salary_amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {salary.created_at ? new Date(salary.created_at).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {salaries.length > 20 && (
              <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600">
                显示前 20 条记录，共 {salaries.length} 条
              </div>
            )}
          </div>
        </div>

        {/* Results 表数据 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Results 表数据</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    员工姓名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    城市
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    月平均工资
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    缴费基数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    公司缴纳
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    年份
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    计算日期
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  results.slice(0, 20).map((result) => (
                    <tr key={result.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.employee_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.city_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ¥{result.avg_salary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ¥{result.contribution_base.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ¥{result.company_fee.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.calculation_date ? new Date(result.calculation_date).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {results.length > 20 && (
              <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600">
                显示前 20 条记录，共 {results.length} 条
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}