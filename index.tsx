import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// =========================================================================
// 👇👇👇【配置指南：在此处修改您的 APP 信息】👇👇👇
// =========================================================================

const PAGE_TITLE = "米奇喵喵屋"; 

// 1️⃣ 【手动配置区】适合外部网站 (Google, Baidu 等)
// -------------------------------------------------------------------------
const EXTERNAL_APPS = [
  // {
  //   id: 1,
  //   name: "Google",
  //   desc: "全球最大的搜索引擎",
  //   icon: "🔍", 
  //   url: "https://www.google.com"
  // },
  // {
  //   id: 2,
  //   name: "GitHub",
  //   desc: "代码托管与协作平台",
  //   icon: "🐙",
  //   url: "https://github.com"
  // },
  // {
  //   id: 3,
  //   name: "ChatGPT",
  //   desc: "OpenAI 智能助手",
  //   icon: "🤖",
  //   url: "https://chat.openai.com"
  // },
  // {
  //   id: 4,
  //   name: "哔哩哔哩",
  //   desc: "干杯 []~(￣▽￣)~*",
  //   icon: "📺",
  //   url: "https://www.bilibili.com"
  // },
];

// 2️⃣ 【子域名快捷区】适合您自己域名下的服务 (如 blog.xxx.com)
// -------------------------------------------------------------------------
// 💡 原理：如果您当前的网页地址是 nav.example.com
// 填写 "blog" 会自动生成 -> https://blog.example.com
// 填写 "git"  会自动生成 -> https://git.example.com
// 
// 如果您在本地(localhost)调试，这些链接可能无法访问，部署到正式域名后即正常。
const SUBDOMAIN_APPS = [
  /* 解除注释并修改下面的内容来启用：*/
  {
    sub: "bean",     // 子域名前缀
    name: "拼豆大师", // 显示名称
    desc: "将任意图片转化为拼豆图纸，支持颜色集合和品牌",
    icon: "✍️"
  },
  {
    sub: "turtle",
    name: "乌龟对对碰",
    desc: "乌龟对对模拟器",
    icon: "🐢"
  },
  {
    sub: "",
    name: "正在开发中", 
    desc: "正在开发中",
    icon: "📊"
  }

];

// 3️⃣ 【高级设置】
// 如果自动识别的域名不对，可以在这里强制指定您的根域名 (例如 "example.com")
// 留空则自动尝试从浏览器地址栏获取
const FORCE_ROOT_DOMAIN = ""; 

// =========================================================================
// 👆👆👆【配置区域结束】👆👆👆
// =========================================================================

// 工具函数：获取根域名
const getRootDomain = () => {
  if (FORCE_ROOT_DOMAIN) return FORCE_ROOT_DOMAIN;
  
  const hostname = window.location.hostname;
  
  // 本地调试时的特殊处理
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'localhost';
  }

  // 简单的域名解析逻辑：取最后两段 (例如 nav.google.com -> google.com)
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }
  return hostname;
};

const AppCard = ({ app }: { app: any }) => {
  const isImage = app.icon.startsWith('http') || app.icon.startsWith('data:');

  return (
    <a href={app.url} target="_blank" rel="noopener noreferrer" className="app-card">
      <div className="icon-wrapper">
        {isImage ? (
          <img src={app.icon} alt={app.name} className="app-icon-img" />
        ) : (
          <span className="app-icon-text">{app.icon}</span>
        )}
      </div>
      <div className="content-wrapper">
        <h3 className="app-name">{app.name}</h3>
        <p className="app-desc">{app.desc}</p>
        {/* 显示实际链接的小字，方便确认 */}
        <p className="app-url-preview">{new URL(app.url).hostname}</p>
      </div>
    </a>
  );
};

const App = () => {
  const [rootDomain, setRootDomain] = useState('');
  const [allApps, setAllApps] = useState<any[]>([]);

  useEffect(() => {
    // 1. 确定根域名
    const currentRoot = getRootDomain();
    setRootDomain(currentRoot);

    // 2. 处理子域名 App
    const processedSubApps = SUBDOMAIN_APPS.map((item, index) => {
      // 如果是在 localhost，为了演示效果，我们生成 http://sub.localhost
      // 如果是正式环境，生成 https://sub.domain.com
      const protocol = window.location.protocol; 
      const fullUrl = `${protocol}//${item.sub}.${currentRoot}`;
      
      return {
        id: `sub-${index}`,
        name: item.name,
        desc: item.desc,
        icon: item.icon,
        url: fullUrl
      };
    });

    // 3. 合并所有 App (外部 App + 子域名 App)
    setAllApps([...EXTERNAL_APPS, ...processedSubApps]);
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>{PAGE_TITLE}</h1>
        {rootDomain && rootDomain !== 'localhost' && (
          <p className="subtitle">Current Domain: {rootDomain}</p>
        )}
      </header>
      
      <main className="grid">
        {allApps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} {PAGE_TITLE}</p>
      </footer>

      <style>{`
        :root {
          --primary-color: #3b82f6;
          --bg-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          --card-bg: rgba(255, 255, 255, 0.85);
          --text-main: #1f2937;
          --text-sub: #6b7280;
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        body {
          min-height: 100vh;
          background-image: var(--bg-gradient);
          color: var(--text-main);
          font-family: 'Noto Sans SC', sans-serif;
          margin: 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
          padding-top: 2rem;
        }

        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          color: var(--text-main);
        }

        .subtitle {
          margin-top: 0.5rem;
          color: var(--text-sub);
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .app-card {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 1.5rem;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
        }

        .app-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          background: rgba(255, 255, 255, 0.95);
          border-color: var(--primary-color);
        }

        .icon-wrapper {
          width: 56px;
          height: 56px;
          background: rgba(239, 246, 255, 0.8);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.3s;
          font-size: 28px;
        }

        .app-card:hover .icon-wrapper {
          background: #dbeafe;
          transform: scale(1.05);
        }

        .app-icon-img {
          width: 32px;
          height: 32px;
          object-fit: contain;
        }

        .content-wrapper {
          overflow: hidden;
          flex: 1;
        }

        .app-name {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .app-desc {
          margin: 0.25rem 0 0 0;
          font-size: 0.875rem;
          color: var(--text-sub);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .app-url-preview {
          margin: 0.25rem 0 0 0;
          font-size: 0.7rem;
          color: #9ca3af;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .footer {
          text-align: center;
          margin-top: 4rem;
          padding-bottom: 2rem;
          color: var(--text-sub);
          font-size: 0.875rem;
          opacity: 0.8;
        }

        @media (max-width: 640px) {
          .container { padding: 1rem; }
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
