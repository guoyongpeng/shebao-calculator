'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Building, Edit, Trash2, Plus } from 'lucide-react'

interface CityData {
  id: number
  city_name: string
  year: string
  base_min: number
  base_max: number
  rate: number
}

export default function CitiesPage() {
  const [cities, setCities] = useState<CityData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCity, setEditingCity] = useState<CityData | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    city_name: '',
    year: '',
    base_min: '',
    base_max: '',
    rate: ''
  })

  // 加载城市数据
  const loadCities = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('city_name', { ascending: true })

      if (error) throw error
      setCities(data || [])
    } catch (error) {
      console.error('加载城市数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 组件挂载时加载数据
  useEffect(() => {
    loadCities()
  }, [])

  // 格式化比例显示
  const formatRate = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`
  }

  // 格式化金额
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount)
  }

  // 处理编辑
  const handleEdit = (city: CityData) => {
    setEditingCity(city)
    setFormData({
      city_name: city.city_name,
      year: city.year,
      base_min: city.base_min.toString(),
      base_max: city.base_max.toString(),
      rate: city.rate.toString()
    })
    setShowAddForm(true)
  }

  // 处理添加新城市
  const handleAdd = () => {
    setEditingCity(null)
    setFormData({
      city_name: '',
      year: '',
      base_min: '',
      base_max: '',
      rate: ''
    })
    setShowAddForm(true)
  }

  // 处理保存
  const handleSave = async () => {
    try {
      const saveData = {
        city_name: formData.city_name,
        year: formData.year,
        base_min: Number(formData.base_min),
        base_max: Number(formData.base_max),
        rate: Number(formData.rate)
      }

      if (editingCity) {
        // 更新
        const { error } = await supabase
          .from('cities')
          .update(saveData)
          .eq('id', editingCity.id)

        if (error) throw error
      } else {
        // 新增
        const { error } = await supabase
          .from('cities')
          .insert(saveData)

        if (error) throw error
      }

      setShowAddForm(false)
      loadCities()
    } catch (error) {
      alert('保存失败: ' + error)
    }
  }

  // 处理删除
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条记录吗？')) return

    try {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadCities()
    } catch (error) {
      alert('删除失败: ' + error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Building className="w-8 h-8" />
                城市管理
              </h1>
              <p className="text-gray-600 mt-2">管理各城市的社保公积金标准</p>
            </div>
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              添加城市
            </Button>
          </div>

          {/* 添加/编辑表单 */}
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingCity ? '编辑城市' : '添加城市'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      城市名称
                    </label>
                    <input
                      type="text"
                      value={formData.city_name}
                      onChange={(e) => setFormData({ ...formData, city_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      年份
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="例如: 2024"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      社保基数下限
                    </label>
                    <input
                      type="number"
                      value={formData.base_min}
                      onChange={(e) => setFormData({ ...formData, base_min: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      社保基数上限
                    </label>
                    <input
                      type="number"
                      value={formData.base_max}
                      onChange={(e) => setFormData({ ...formData, base_max: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      缴费比例
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      placeholder="例如: 0.15 (15%)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <Button onClick={handleSave}>
                      {editingCity ? '更新' : '保存'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      取消
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 城市列表 */}
          <Card>
            <CardHeader>
              <CardTitle>城市列表</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <p className="mt-2 text-gray-600">加载中...</p>
                </div>
              ) : cities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无城市数据，请添加城市社保标准
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
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
                          缴费比例
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cities.map((city) => (
                        <tr key={city.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {city.city_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {city.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(city.base_min)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(city.base_max)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatRate(city.rate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(city)}
                                className="flex items-center gap-1"
                              >
                                <Edit className="w-3 h-3" />
                                编辑
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(city.id)}
                                className="flex items-center gap-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                                删除
                              </Button>
                            </div>
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