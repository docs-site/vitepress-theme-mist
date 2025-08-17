<h1 align="center">vitepress-theme-mist config</h1>

## 一、工作区外

首先安装`vitepress-theme-mist`：

```bash
npm i -D ..\vitepress-theme-mist\dist\vitepress-theme-mist\
npm i vitepress-theme-mist
```

然后在`.vitepress/config.mts`中添加以下内容：

```typescript
import { defineMistConfig } from "vitepress-theme-mist/config"; 

const myThemeConfig = defineMistConfig({ 
    useTheme: true,
    themeConfig: {
      logo: '/favicon.svg', // 导航栏标题的logo
      footer: {
        message: '前路漫漫亦灿灿',
        copyright: 'Copyright © 2019-present 苏木'
      }
    }
  }
);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: myThemeConfig,
  //......
}
```

## 二、工作区内

### 1. 基本用法

然后就是工作区内的vitepress站点怎么使用？我们在`.vitepress/config.mts`中添加：

```bash
import { defineMistConfig } from "../../../packages/config";
```

然后就和上面一样：

```typescript
import { defineMistConfig } from "vitepress-theme-mist/config"; 

const myThemeConfig = defineMistConfig({ 
    useTheme: true,
    themeConfig: {
      logo: '/favicon.svg', // 导航栏标题的logo
      footer: {
        message: '前路漫漫亦灿灿',
        copyright: 'Copyright © 2019-present 苏木'
      }
    }
  }
);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: myThemeConfig,
  //......
}
```

### 2. 一个问题

上面要写三级的相对路径，但是想一下，我们前面不是在tsconfig.base.json映射过了:

```json
{
  //......
    "paths": {                            // 路径映射，用于模块解析的别名配置
      "@mist/*": ["packages/*"]           // 将 @mist/* 映射到 packages/* 目录
    }
  }
}

```

直接用这个@mist不就可以了：

```typescript
import { defineMistConfig } from "@mist/config";
```

实际报错了：

```bash
failed to load config from D:\sumu_blog\vitepress-theme-mist\docs\src\.vitepress\config.mts
failed to start server. error:
Unknown file extension ".ts" for D:\sumu_blog\vitepress-theme-mist\packages\config\index.ts
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for D:\sumu_blog\vitepress-theme-mist\packages\config\index.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:219:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:245:36)
    at defaultLoad (node:internal/modules/esm/load:120:22)
    at async ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:580:32) 
```

后面搞懂了再补充吧。
