import OpenAI from 'openai';

import { checkAuth } from '@/app/api/auth';
import { getServerConfig } from '@/config/server';
import { getOpenAIAuthFromRequest } from '@/const/fetch';
import { ChatErrorType, ErrorType } from '@/types/fetch';

import { createErrorResponse } from '../errorResponse';
import { createAzureOpenai } from './createAzureOpenai';
import { createOpenai } from './createOpenai';
import { OpenAIChatMessage } from '@/types/openai/chat';

/**
 * createOpenAI Instance with Auth and azure openai support
 * if auth not pass ,just return error response
 */

type OpenAIResult = {
  errorResponse?: Response;
  openai?: OpenAI;

};
export const createBizOpenAI = async (req: Request, model: string,messages: OpenAIChatMessage[]): Promise<OpenAIResult> => {
  const { apiKey, accessCode, endpoint, useAzure, apiVersion } = getOpenAIAuthFromRequest(req);
  const result = await checkAuth({ accessCode, apiKey,messages,model});

  if (!result.auth) {
    return { errorResponse: createErrorResponse(result.error as ErrorType) };
  }

  let openai: OpenAI;

  const { USE_AZURE_OPENAI } = getServerConfig();
  const useAzureOpenAI = useAzure || USE_AZURE_OPENAI;

  try {
    if (useAzureOpenAI) {
      openai = createAzureOpenai({ apiVersion, endpoint, model, userApiKey: apiKey });
    } else {
      openai = createOpenai(apiKey, endpoint);
    }
  } catch (error) {
    if ((error as Error).cause === ChatErrorType.NoAPIKey) {
      return { errorResponse: createErrorResponse(ChatErrorType.NoAPIKey)};
    }

    console.error(error); // log error to trace it
    return { errorResponse: createErrorResponse(ChatErrorType.InternalServerError) };
  }

  return { openai }; // 成功时返回 OpenAI 实例
};
