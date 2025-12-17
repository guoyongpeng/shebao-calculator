# 五险一金计算器

一个基于 Next.js + Supabase 的多城市社保公积金费用计算工具。

## 功能特性

- ✅ 多城市支持：支持不同城市的社保公积金标准
- ✅ Excel数据上传：支持批量导入城市标准和员工工资数据
- ✅ 增量数据管理：避免重复导入相同数据
- ✅ 历史记录保留：保留所有计算历史，支持查询和筛选
- ✅ 实时计算：根据工资和基数自动计算公司应缴费用

## 技术栈

- **前端**：Next.js 15 (App Router)
- **样式**：Tailwind CSS
- **数据库**：Supabase (PostgreSQL)
- **Excel处理**：xlsx
- **图标**：Lucide React

## 项目结构

```
├── src/
│   ├── app/                # Next.js App Router 页面
│   │   ├── page.tsx       # 主页
│   │   ├── upload/        # 数据上传页
│   │   ├── results/       # 结果展示页
│   │   └── cities/        # 城市管理页
│   ├── components/        # React组件
│   │   └── ui/           # UI基础组件
│   └── lib/              # 工具函数
│       ├── supabase.ts   # Supabase客户端
│       ├── excelParser.ts # Excel解析
│       ├── calculations.ts # 计算逻辑
│       └── utils.ts      # 通用工具
```

## 快速开始

### 1. 克隆项目

```bash
git clone [your-repo-url]
cd shebao
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 Supabase

1. 访问 [Supabase](https://supabase.com) 创建新项目
2. 在项目设置中获取 API URL 和 anon key
3. 创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 创建数据表

在 Supabase 的 SQL 编辑器中执行 `database.sql` 中的脚本。

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 使用说明

### 1. 城市数据上传

Excel文件格式要求：
- 文件格式：.xlsx 或 .xls
- 必需列：city_name, year, base_min, base_max, rate
- 示例：
  ```
  city_name | year | base_min | base_max | rate
  佛山      | 2024 | 3000     | 20000    | 0.15
  ```

### 2. 工资数据上传

Excel文件格式要求：
- 文件格式：.xlsx 或 .xls
- 必需列：employee_id, employee_name, month, salary_amount
- 示例：
  ```
  employee_id | employee_name | month   | salary_amount
  E001        | 张三          | 202401  | 8000
  ```

### 3. 计算社保费用

1. 选择城市和年份
2. 点击"执行计算"
3. 系统将自动：
   - 计算每位员工的年度月平均工资
   - 根据城市标准确定缴费基数
   - 计算公司应缴纳金额
   - 保存结果到数据库

### 4. 查询结果

在结果页面可以：
- 筛选查看不同城市和年份的结果
- 查看详细的计算明细
- 查看总费用汇总

## 核心计算逻辑

```javascript
// 1. 计算年度月平均工资
avgSalary = totalSalaryOfYear / monthCount

// 2. 确定缴费基数
if (avgSalary < baseMin) {
  contributionBase = baseMin
} else if (avgSalary > baseMax) {
  contributionBase = baseMax
} else {
  contributionBase = avgSalary
}

// 3. 计算公司缴费
companyFee = contributionBase * rate
```

## 开发指南

### 添加新功能

1. 在 `src/lib` 中添加业务逻辑
2. 在 `src/components` 中创建组件
3. 在 `src/app` 中创建页面
4. 更新路由配置

### 样式定制

项目使用 Tailwind CSS，可以在 `tailwind.config.ts` 中自定义主题。

### 部署

#### Vercel 部署（推荐）

```bash
npm run build
```

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 自动部署完成

#### Docker 部署

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 注意事项

1. **数据安全**：生产环境请配置适当的 RLS 策略
2. **性能优化**：大量数据时考虑分页和索引优化
3. **错误处理**：上传前验证 Excel 格式
4. **备份策略**：定期备份 Supabase 数据

## 常见问题

### Q: 如何修改城市数据？
A: 访问城市管理页面，可以编辑或删除城市记录。

### Q: 支持哪些 Excel 格式？
A: 支持 .xlsx 和 .xls 格式，确保列名正确。

### Q: 计算结果可以导出吗？
A: 目前在结果页面查看，可自行从表格复制数据。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License