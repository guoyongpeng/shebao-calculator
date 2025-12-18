'use client'

import { useState } from 'react'
import { parseCitiesExcel, parseSalariesExcel } from '@/lib/excelParser'

export default function DebugExcelPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setResult(null)

    try {
      console.log('File name:', file.name)
      console.log('File size:', file.size)
      console.log('File type:', file.type)

      // 检查文件扩展名
      const isCitiesFile = file.name.toLowerCase().includes('city')

      if (isCitiesFile) {
        const data = await parseCitiesExcel(file)
        setResult({
          type: 'cities',
          data: data,
          count: data.length,
          sample: data.slice(0, 3)
        })
      } else {
        const data = await parseSalariesExcel(file)
        setResult({
          type: 'salaries',
          data: data,
          count: data.length,
          sample: data.slice(0, 3)
        })
      }
    } catch (error) {
      console.error('Parse error:', error)
      setResult({
        error: error instanceof Error ? error.message : '解析失败',
        details: error
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Excel解析调试工具</h1>

      <div style={{ background: '#f5f5f5', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>上传Excel文件进行调试</h2>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          style={{ margin: '10px 0', padding: '10px' }}
        />
        {loading && <p>正在解析...</p>}
      </div>

      {result && (
        <div style={{ background: '#fff', border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
          <h2>解析结果</h2>

          {result.error ? (
            <div style={{ color: 'red' }}>
              <h3>错误信息:</h3>
              <p>{result.error}</p>
              <details>
                <summary>详细错误信息</summary>
                <pre>{JSON.stringify(result.details, null, 2)}</pre>
              </details>
            </div>
          ) : (
            <div>
              <p><strong>文件类型:</strong> {result.type === 'cities' ? '城市数据' : '工资数据'}</p>
              <p><strong>解析条数:</strong> {result.count}</p>

              {result.count > 0 && (
                <div>
                  <h3>前3条数据示例:</h3>
                  <pre style={{ background: '#f8f9fa', padding: '10px', overflow: 'auto' }}>
                    {JSON.stringify(result.sample, null, 2)}
                  </pre>
                </div>
              )}

              {result.count === 0 && (
                <div style={{ color: 'orange' }}>
                  <h3>⚠️ 解析到0条数据</h3>
                  <p>请检查Excel文件格式：</p>
                  {result.type === 'cities' ? (
                    <ul>
                      <li>确保列名包含：city_name, year, base_min, base_max, rate</li>
                      <li>city_name 和 year 列不能为空</li>
                    </ul>
                  ) : (
                    <ul>
                      <li>确保列名包含：employee_id, employee_name, month, salary_amount</li>
                      <li>employee_id, employee_name, month 列不能为空</li>
                      <li>salary_amount 必须大于0</li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ background: '#e7f3ff', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h3>使用说明：</h3>
        <ol>
          <li>选择包含城市数据或工资数据的Excel文件</li>
          <li>查看解析结果和条数</li>
          <li>如果解析到0条，检查列名和数据完整性</li>
        </ol>
      </div>
    </div>
  )
}