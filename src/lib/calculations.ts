import { supabase } from './supabase'

export interface CityStandard {
  city_name: string
  year: string
  base_min: number
  base_max: number
  rate: number
}

export interface EmployeeSalary {
  employee_name: string
  total_salary: number
  month_count: number
  avg_salary: number
}

export interface CalculationResult {
  employee_name: string
  city_name: string
  avg_salary: number
  contribution_base: number
  company_fee: number
  year: string
}

export async function getCityStandard(cityName: string, year: string): Promise<CityStandard | null> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('city_name', cityName)
    .eq('year', year)
    .single()

  if (error) {
    console.error('获取城市标准失败:', error)
    return null
  }

  return data
}

export async function getEmployeeSalariesByYear(year: string): Promise<EmployeeSalary[]> {
  // 获取指定年份的所有工资数据
  const { data: salaries, error } = await supabase
    .from('salaries')
    .select('*')
    .like('month', `${year}%`)

  if (error) {
    console.error('获取工资数据失败:', error)
    return []
  }

  // 按员工分组并计算平均工资
  const employeeMap = new Map<string, { total: number; count: number }>()

  salaries.forEach((salary: any) => {
    const name = salary.employee_name
    const amount = salary.salary_amount

    if (employeeMap.has(name)) {
      const existing = employeeMap.get(name)!
      employeeMap.set(name, {
        total: existing.total + amount,
        count: existing.count + 1
      })
    } else {
      employeeMap.set(name, {
        total: amount,
        count: 1
      })
    }
  })

  // 转换为EmployeeSalary数组
  const results: EmployeeSalary[] = []
  employeeMap.forEach((value, key) => {
    results.push({
      employee_name: key,
      total_salary: value.total,
      month_count: value.count,
      avg_salary: Math.round(value.total / value.count)
    })
  })

  return results
}

export function calculateContributionBase(avgSalary: number, baseMin: number, baseMax: number): number {
  if (avgSalary < baseMin) {
    return baseMin
  } else if (avgSalary > baseMax) {
    return baseMax
  } else {
    return avgSalary
  }
}

export async function calculateContributions(cityName: string, year: string): Promise<CalculationResult[]> {
  // 1. 获取城市社保标准
  const cityStandard = await getCityStandard(cityName, year)
  if (!cityStandard) {
    throw new Error(`未找到${cityName}${year}年的社保标准`)
  }

  // 2. 获取员工工资数据
  const employeeSalaries = await getEmployeeSalariesByYear(year)
  if (employeeSalaries.length === 0) {
    console.warn('未找到工资数据')
    return []
  }

  // 3. 计算每位员工的缴费金额
  const results: CalculationResult[] = []
  employeeSalaries.forEach(employee => {
    // 确定缴费基数
    const contributionBase = calculateContributionBase(
      employee.avg_salary,
      cityStandard.base_min,
      cityStandard.base_max
    )

    // 计算公司缴费金额
    const companyFee = Math.round(contributionBase * cityStandard.rate * 100) / 100

    results.push({
      employee_name: employee.employee_name,
      city_name: cityName,
      avg_salary: employee.avg_salary,
      contribution_base: contributionBase,
      company_fee: companyFee,
      year: year
    })
  })

  return results
}

export async function saveCalculationResults(results: CalculationResult[]): Promise<void> {
  if (results.length === 0) return

  // 准备插入数据
  const insertData = results.map(result => ({
    employee_name: result.employee_name,
    city_name: result.city_name,
    avg_salary: result.avg_salary,
    contribution_base: result.contribution_base,
    company_fee: result.company_fee,
    year: result.year
  }))

  // 批量插入到results表
  const { error } = await supabase
    .from('results')
    .insert(insertData)

  if (error) {
    throw new Error(`保存计算结果失败: ${error.message}`)
  }
}

export async function getCalculationResults(cityName?: string, year?: string): Promise<any[]> {
  let query = supabase
    .from('results')
    .select('*')
    .order('calculation_date', { ascending: false })

  if (cityName) {
    query = query.eq('city_name', cityName)
  }

  if (year) {
    query = query.eq('year', year)
  }

  const { data, error } = await query

  if (error) {
    console.error('获取计算结果失败:', error)
    return []
  }

  return data || []
}

export async function getAvailableCities(): Promise<string[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('city_name')
    .order('city_name')

  if (error) {
    console.error('获取城市列表失败:', error)
    return []
  }

  // 去重
 city.city_name) as string[])] as string[]
  return cities
}

export async function getAvailableYears(): Promise<string[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('year')
    .order('year', { ascending: false })

  if (error) {
    console.error('获取年份列表失败:', error)
    return []
  }

  // 去重
  item.year) as string[])] as string[]
  return years
}
