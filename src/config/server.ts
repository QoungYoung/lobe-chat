/* eslint-disable sort-keys-fix/sort-keys-fix , typescript-sort-keys/interface */

import { OpenAIChatMessage} from "@/types/openai/chat";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_CODE?: string;
      CUSTOM_MODELS?: string;

      OPENAI_API_KEY?: string;
      OPENAI_PROXY_URL?: string;

      AZURE_API_KEY?: string;
      AZURE_API_VERSION?: string;
      USE_AZURE_OPENAI?: string;

      IMGUR_CLIENT_ID?: string;

      AGENTS_INDEX_URL?: string;

      PLUGINS_INDEX_URL?: string;
      PLUGIN_SETTINGS?: string;
    }
  }
}

// we apply a free imgur app to get a client id
// refs: https://apidocs.imgur.com/
const DEFAULT_IMAGUR_CLIENT_ID = 'e415f320d6e24f9';

export const getServerConfig = () => {
  if (typeof process === 'undefined') {
    throw new Error('[Server Config] you are importing a server-only module outside of server');
  }

  // region format: iad1,sfo1
  let regions: string[] = [];
  if (process.env.OPENAI_FUNCTION_REGIONS) {
    regions = process.env.OPENAI_FUNCTION_REGIONS.split(',');
  }

  const ACCESS_CODES = process.env.ACCESS_CODE?.split(',').filter(Boolean) || [];

  return {
    ACCESS_CODES,
    CUSTOM_MODELS: process.env.CUSTOM_MODELS,

    SHOW_ACCESS_CODE_CONFIG: !!ACCESS_CODES.length,

    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_PROXY_URL: process.env.OPENAI_PROXY_URL,
    OPENAI_FUNCTION_REGIONS: regions,

    AZURE_API_KEY: process.env.AZURE_API_KEY,
    AZURE_API_VERSION: process.env.AZURE_API_VERSION,
    USE_AZURE_OPENAI: process.env.USE_AZURE_OPENAI === '1',

    IMGUR_CLIENT_ID: process.env.IMGUR_CLIENT_ID || DEFAULT_IMAGUR_CLIENT_ID,

    AGENTS_INDEX_URL: !!process.env.AGENTS_INDEX_URL
      ? process.env.AGENTS_INDEX_URL
      : 'https://chat-agents.lobehub.com',

    PLUGINS_INDEX_URL: !!process.env.PLUGINS_INDEX_URL
      ? process.env.PLUGINS_INDEX_URL
      : 'https://chat-plugins.lobehub.com',

    PLUGIN_SETTINGS: process.env.PLUGIN_SETTINGS,
  };
};
export const checkAuthCode = async (authCode: string,message:OpenAIChatMessage[], model: string) => {
  // 定义你的API端点
  const url = 'http://66.42.61.208:8000/auth/authCode';
  const bodyData = {
    model:model,
    msg:message,
    authCode:authCode
  }
  console.log(bodyData);

  // 使用fetch发送POST请求
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 设置内容类型为 JSON
    },
    body: JSON.stringify(bodyData) // 将对象转换为 JSON 字符串
  })
  .then(response => {
    // 确认响应的HTTP状态码是200
    if (response.ok) {
      return response.json(); // 将响应数据转换成JSON
    }
    throw new Error('Network response was not ok.');
  })
  .then(data => {
    // 处理返回的数据
    return data;
  })
  .catch(error => {
    console.log(error);

    // 处理任何在请求过程中发生的错误
    return false;
  });
}
