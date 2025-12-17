# 五险一金计算器项目 - 开发计划文档

## 项目概述

构建一个"五险一金"计算器Web应用，根据预设的员工工资数据和城市社保标准，计算公司为每位员工应缴纳的社保公积金费用。支持多城市计算，保留历史数据记录。

## 技术栈

- **前端框架**: Next.js (App Router)
- **UI/样式**: Tailwind CSS
- **数据库/后端**: Supabase
- **文件处理**: 支持Excel数据上传

## 数据库设计

### 1. cities 表（城市标准表）
```sql
- id (主键, int)
- city_name (城市名, text)
- year (年份, text)
- base_min (社保基数下限, int)
- base_max (社保基数上限, int)
- rate (简化的综合缴纳比例, float, 例如 0.15)
```

### 2. salaries 表（员工工资表）
```sql
- id (主键, int)
- employee_id (员工工号, text)
- employee_name (员工姓名, text)
- month (年份月份, YYYYMM，text)
- salary_amount (该月工资金额, int)
```

### 3. results 表（计算结果表）
```sql
- id (主键, int)
- employee_name (员工姓名, text)
- city_name (城市名称, text)
- avg_salary (年度月平均工资, float)
- contribution_base (最终缴费基数, float)
- company_fee (公司缴纳金额, float)
- calculation_date (计算日期, datetime)
- year (计算年份, text)
```

## 核心业务逻辑

### 计算流程
1. 从 salaries 表读取所有数据
2. 按员工姓名分组，计算每位员工的"年度月平均工资"
3. 支持多城市选择，从 cities 表获取指定城市的社保标准（year, base_min, base_max, rate）
4. 确定每位员工的"最终缴费基数"：
   - 如果年度月平均工资 < base_min → 使用 base_min
   - 如果年度月平均工资 > base_max → 使用 base_max
   - 否则 → 使用年度月平均工资
5. 计算公司应缴纳金额：final_contribution_base × rate
6. 将结果存入 results 表（保留历史记录，每次计算新增记录）

## 前端页面设计

### 1. 主页 (/)
- 功能卡片布局（三个主要入口）
- 卡片一："数据上传" → 链接到 /upload
- 卡片二："结果查询" → 链接到 /results
- 卡片三："城市管理" → 链接到 /cities
- 简洁现代的UI设计

### 2. 数据上传页 (/upload)
- "上传城市数据"按钮：上传城市社保标准Excel到 cities 表
- "上传工资数据"按钮：上传员工工资Excel到 salaries 表
- 城市选择下拉框：选择要计算的城市
- 年份输入：选择计算年份
- "执行计算并存储结果"按钮：触发核心计算逻辑
- 操作状态反馈

### 3. 结果展示页 (/results)
- 城市筛选下拉框：筛选显示不同城市的结果
- 年份筛选下拉框：筛选显示不同年份的结果
- 自动从 results 表获取数据
- 表格展示所有计算结果
- 清晰的表头和数据展示

### 4. 城市管理页 (/cities)
- 展示所有已录入的城市及其社保标准
- 支持编辑和删除城市数据
- 显示每个城市的最后更新时间

## 开发任务清单 (TodoList)

### 阶段一：项目初始化
- [ ] 创建 Next.js 项目
- [ ] 配置 Tailwind CSS
- [ ] 设置 Supabase 项目和配置
- [ ] 创建基础项目结构

### 阶段二：数据库设置
- [ ] 在 Supabase 中创建 cities 表
- [ ] 在 Supabase 中创建 salaries 表
- [ ] 在 Supabase 中创建 results 表（添加city_name, calculation_date, year字段）
- [ ] 设置数据库安全规则（RLS）
- [ ] 准备测试数据（多城市示例）

### 阶段三：核心功能开发
- [ ] 创建 Supabase 客户端配置
- [ ] 实现城市数据上传 API（Excel 解析）
- [ ] 实现工资数据上传 API（Excel 解析，增量添加）
- [ ] 开发多城市核心计算函数
- [ ] 实现结果存储到数据库的函数（保留历史）

### 阶段四：前端页面开发
- [ ] 开发主页布局和卡片组件
- [ ] 实现数据上传页面和功能（支持城市和工资分别上传）
- [ ] 开发结果展示页面和表格组件（支持城市和年份筛选）
- [ ] 开发城市管理页面
- [ ] 添加页面间导航

### 阶段五：集成测试
- [ ] 测试多城市数据上传功能
- [ ] 验证多城市计算逻辑正确性
- [ ] 测试历史数据保留功能
- [ ] 测试结果筛选功能
- [ ] 优化用户体验和错误处理

### 阶段六：优化和部署
- [ ] 性能优化
- [ ] 响应式设计调整
- [ ] 错误处理完善
- [ ] 部署配置

## 关键技术实现要点

### Excel 数据处理
- 使用 xlsx 库解析 Excel 文件
- 分别处理城市数据和工资数据格式
- 数据验证和格式转换
- 增量添加逻辑（避免重复数据）

### 多城市计算逻辑
- 城市选择和年份选择
- 批量计算多个城市的员工数据
- 历史数据管理（每次计算新增记录）

### 前端交互优化
- 文件上传进度显示
- 计算状态实时反馈
- 城市和年份筛选功能
- 表格数据排序和搜索

## 项目文件结构
```
/
├── app/
│   ├── page.js (主页)
│   ├── upload/page.js (数据上传页)
│   ├── results/page.js (结果展示页)
│   └── cities/page.js (城市管理页)
├── components/
│   ├── Card.js (卡片组件)
│   ├── UploadButton.js (上传按钮组件)
│   ├── ResultTable.js (结果表格组件)
│   ├── CitySelector.js (城市选择器)
│   └── YearSelector.js (年份选择器)
├── lib/
│   ├── supabase.js (Supabase 客户端)
│   ├── calculations.js (计算逻辑)
│   └── excelParser.js (Excel解析)
└── public/ (静态资源)
```

## 数据表字段说明

### cities 表字段说明
- `city_name`: 城市名称，如"佛山"、"广州"、"深圳"等
- `year`: 适用年份，如"2024"
- `base_min`: 社保缴费基数下限
- `base_max`: 社保缴费基数上限
- `rate`: 综合缴纳比例（公司承担部分）

### salaries 表字段说明
- `employee_id`: 员工工号，唯一标识
- `employee_name`: 员工姓名
- `month`: 工资月份，格式为YYYYMM，如"202401"
- `salary_amount`: 该月工资金额

### results 表字段说明
- `employee_name`: 员工姓名
- `city_name`: 计算使用的城市
- `avg_salary`: 年度月平均工资
- `contribution_base`: 最终缴费基数
- `company_fee`: 公司应缴纳金额
- `calculation_date`: 计算执行的日期时间
- `year`: 计算对应的年份

## 注意事项

1. **多城市支持**：确保计算逻辑支持不同城市的不同标准
2. **增量数据**：工资数据上传时避免重复，可根据员工和月份判断
3. **历史记录**：每次计算都新增记录，保留完整的计算历史
4. **数据筛选**：结果页面支持按城市和年份筛选查看
5. **无需认证**：公开使用，简化权限控制
6. **数据验证**：上传数据的格式验证和清理
7. **性能考虑**：大量数据时的计算和展示性能优化