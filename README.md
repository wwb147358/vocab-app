# 词汇学习 App

一款帮助大学生学习英语词汇的 PWA 应用。

## 功能

- 闪卡模式
- 选择题测试
- 默写练习
- 间隔重复算法
- 学习进度追踪
- 云端同步

## 技术栈

- React 18 + TypeScript
- Vite 5
- TailwindCSS
- Supabase (Auth + PostgreSQL)
- PWA

## 开发

1. 复制环境变量配置文件：
   ```bash
   cp .env.example .env
   ```

2. 填写 Supabase 配置：
   - 在 [Supabase](https://supabase.com) 创建项目
   - 获取 Project URL 和 anon public key
   - 填入 .env 文件

3. 创建数据库表：
   在 Supabase SQL Editor 中执行以下 SQL 创建 vocabularies 和 user_progress 表。

   ```sql
   -- 词汇表
   CREATE TABLE vocabularies (
     id SERIAL PRIMARY KEY,
     word VARCHAR(100) NOT NULL,
     chinese TEXT NOT NULL,
     english_def TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- 用户学习进度
   CREATE TABLE user_progress (
     id SERIAL PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     vocab_id INTEGER REFERENCES vocabularies(id) ON DELETE CASCADE,
     level INTEGER DEFAULT 0,
     next_review TIMESTAMP,
     correct_count INTEGER DEFAULT 0,
     last_reviewed TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW(),
     UNIQUE(user_id, vocab_id)
   );

   -- 启用行级安全
   ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

   -- 创建安全策略
   CREATE POLICY "Users can manage own progress" ON user_progress
     FOR ALL USING (auth.uid() = user_id);
   ```

4. 安装依赖：
   ```bash
   npm install
   ```

5. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 部署

推荐部署到 Vercel 或 Netlify：

```bash
npm run build
```

构建产物在 `dist/` 目录。

## PWA

- 可添加到桌面
- 支持离线浏览闪卡
- 进度同步需要网络