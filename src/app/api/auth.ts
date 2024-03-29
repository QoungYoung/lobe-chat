import { checkAuthCode } from '@/config/server';
import { ChatErrorType } from '@/types/fetch';
import { OpenAIChatMessage } from '@/types/openai/chat';

interface AuthConfig {
  accessCode?: string | null;
  apiKey?: string | null;
  messages: OpenAIChatMessage[]
  model: string;

}

export const checkAuth = async ({ apiKey, accessCode,messages,model }: AuthConfig) => {
  // const { ACCESS_CODES } = getServerConfig();

  // if apiKey exist
  if (apiKey) {
    return { auth: true };
  }

  // if accessCode doesn't exist
  // if (!ACCESS_CODES.length) return { auth: true };

  if (!accessCode || ! await checkAuthCode(accessCode,messages,model)) {
    return { auth: false, error: ChatErrorType.InvalidAccessCode };
  }

  return { auth: true };
};
