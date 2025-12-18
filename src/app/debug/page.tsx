'use client'

export default function DebugPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not found'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Found' : 'Not found'

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">环境变量调试页面</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">环境变量检查</h2>

          <div className="space-y-2">
            <div className="border-b pb-2">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
              <span className="ml-2 text-blue-600">{supabaseUrl}</span>
            </div>

            <div className="border-b pb-2">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              <span className={`ml-2 ${supabaseKey === 'Found' ? 'text-green-600' : 'text-red-600'}`}>
                {supabaseKey}
              </span>
            </div>

            <div className="border-b pb-2">
              <span className="font-medium">NODE_ENV:</span>
              <span className="ml-2">{process.env.NODE_ENV}</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>注意：</strong>这个页面仅用于调试，包含敏感信息，请不要在生产环境中暴露。
          </p>
        </div>
      </div>
    </div>
  )
}