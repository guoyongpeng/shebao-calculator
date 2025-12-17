import * as XLSX from 'xlsx'

export interface CityData {
  city_name: string
  year: string
  base_min: number
  base_max: number
  rate: number
}

export interface SalaryData {
  employee_id: string
  employee_name: string
  month: string
  salary_amount: number
}

export function parseCitiesExcel(file: File): Promise<CityData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        const citiesData = jsonData.map((row: any) => ({
          city_name: row.city_name || '',
          year: String(row.year || ''),
          base_min: Number(row.base_min || 0),
          base_max: Number(row.base_max || 0),
          rate: Number(row.rate || 0)
        }))

        resolve(citiesData.filter(city => city.city_name && city.year))
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    reader.readAsBinaryString(file)
  })
}

export function parseSalariesExcel(file: File): Promise<SalaryData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        const salariesData = jsonData.map((row: any) => ({
          employee_id: String(row.employee_id || ''),
          employee_name: row.employee_name || '',
          month: String(row.month || ''),
          salary_amount: Number(row.salary_amount || 0)
        }))

        resolve(salariesData.filter(salary =>
          salary.employee_id &&
          salary.employee_name &&
          salary.month &&
          salary.salary_amount > 0
        ))
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    reader.readAsBinaryString(file)
  })
}