import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Testing Supabase connection...')

    // 检查环境变量
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Not found')
    console.log('Supabase Key:', supabaseKey ? 'Found' : 'Not found')

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: 'Environment variables not found',
          url: supabaseUrl ? 'Found' : 'Not found',
          key: supabaseKey ? 'Found' : 'Not found'
        },
        { status: 500 }
      )
    }

    // 测试连接
    const supabase = getSupabase()
    const { data, error } = await supabase.from('cities').select('count', { count: 'exact', head: true })

    if (error) {
      console.error('Supabase connection error:', error)
      return NextResponse.json(
        {
          error: 'Supabase connection failed',
          details: error.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      citiesCount: data?.[0]?.count || 0,
      url: supabaseUrl,
      keyValid: supabaseKey.length > 0
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}