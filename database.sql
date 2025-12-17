-- 五险一金计算器数据库表结构
-- 在 Supabase 的 SQL 编辑器中执行以下脚本

-- 创建城市社保标准表
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INTEGER NOT NULL,
  base_max INTEGER NOT NULL,
  rate FLOAT NOT NULL
);

-- 创建员工工资表
CREATE TABLE salaries (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount INTEGER NOT NULL
);

-- 创建计算结果表
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  employee_name TEXT NOT NULL,
  city_name TEXT NOT NULL,
  avg_salary FLOAT NOT NULL,
  contribution_base FLOAT NOT NULL,
  company_fee FLOAT NOT NULL,
  calculation_date TIMESTAMP DEFAULT NOW(),
  year TEXT NOT NULL
);

-- 创建索引以提高查询性能
CREATE INDEX idx_cities_city_year ON cities(city_name, year);
CREATE INDEX idx_salaries_employee_month ON salaries(employee_name, month);
CREATE INDEX idx_results_city_year ON results(city_name, year);

-- 启用行级安全策略（可选）
-- ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- 允许所有操作（仅用于开发环境）
-- CREATE POLICY "Allow all operations on cities" ON cities FOR ALL USING (true);
-- CREATE POLICY "Allow all operations on salaries" ON salaries FOR ALL USING (true);
-- CREATE POLICY "Allow all operations on results" ON results FOR ALL USING (true);

-- 插入示例数据（可选）
INSERT INTO cities (city_name, year, base_min, base_max, rate) VALUES
('佛山', '2024', 3000, 20000, 0.15),
('广州', '2024', 3500, 25000, 0.16),
('深圳', '2024', 4000, 30000, 0.17);

INSERT INTO salaries (employee_id, employee_name, month, salary_amount) VALUES
('E001', '张三', '202401', 8000),
('E001', '张三', '202402', 8000),
('E001', '张三', '202403', 8000),
('E002', '李四', '202401', 12000),
('E002', '李四', '202402', 12000),
('E002', '李四', '202403', 12000),
('E003', '王五', '202401', 5000),
('E003', '王五', '202402', 5000),
('E003', '王五', '202403', 5000);