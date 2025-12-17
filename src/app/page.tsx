import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Upload, Calculator, Building, Database } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      title: '数据上传',
      description: '上传城市社保标准和员工工资数据',
      icon: Upload,
      href: '/upload',
      color: 'bg-blue-500'
    },
    {
      title: '结果查询',
      description: '查看已计算的社保费用结果',
      icon: Calculator,
      href: '/results',
      color: 'bg-green-500'
    },
    {
      title: '城市管理',
      description: '管理各城市的社保标准设置',
      icon: Building,
      href: '/cities',
      color: 'bg-purple-500'
    },
    {
      title: '数据测试',
      description: '查看数据库中的原始数据',
      icon: Database,
      href: '/test',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            五险一金计算器
          </h1>
          <p className="text-lg text-gray-600">
            多城市社保公积金费用计算工具
          </p>
          <div className="mt-8 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">使用步骤</h2>
            <div className="grid md:grid-cols-4 gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium text-gray-800">上传城市标准</p>
                  <p className="text-sm text-gray-600">导入各城市社保基数</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium text-gray-800">上传工资数据</p>
                  <p className="text-sm text-gray-600">导入员工工资记录</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium text-gray-800">执行计算</p>
                  <p className="text-sm text-gray-600">选择城市和年份</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <p className="font-medium text-gray-800">查看结果</p>
                  <p className="text-sm text-gray-600">分析费用明细</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link key={feature.title} href={feature.href}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`${feature.color} p-4 rounded-full text-white`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {feature.title}
                    </h2>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}