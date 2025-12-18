export default function DebugPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>环境变量调试页面</h1>

      <div style={{ background: '#f5f5f5', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>页面加载测试</h2>
        <p>如果你能看到这个页面，说明路由工作正常。</p>
        <p>时间：{new Date().toLocaleString()}</p>
      </div>

      <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>环境变量状态</h2>
        <p>由于安全限制，浏览器无法直接访问服务端环境变量。</p>
        <p>请访问 API 端点来测试： <a href="/api/test-supabase" style={{ color: '#0066cc' }}>查看环境变量状态</a></p>
      </div>

      <div style={{ background: '#d4edda', border: '1px solid #c3e6cb', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>测试步骤</h2>
        <ol>
          <li>点击上面的链接测试API端点</li>
          <li>检查返回的JSON数据中的环境变量状态</li>
          <li>如果环境变量缺失，请检查Vercel设置</li>
        </ol>
      </div>
    </div>
  )
}