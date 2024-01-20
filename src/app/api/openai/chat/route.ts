import { OpenAIChatStreamPayload } from '@/types/openai/chat';

import { getPreferredRegion } from '../../config';
import { createBizOpenAI } from '../createBizOpenAI';
import { createChatCompletion } from './createChatCompletion';

export const runtime = 'edge';
export const preferredRegion = getPreferredRegion();

export const POST = async (req: Request) => {
  const payload = (await req.json()) as OpenAIChatStreamPayload;

  const openaiOrErrResponse = await createBizOpenAI(req, payload.model,payload.messages);

  // if resOrOpenAI is a Response, it means there is an error,just return it
  if (openaiOrErrResponse.errorResponse instanceof Response) return openaiOrErrResponse.errorResponse;

  return createChatCompletion({ openai: openaiOrErrResponse.openai, payload });
};
