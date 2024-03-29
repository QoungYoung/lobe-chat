import { OpenAIImagePayload } from '@/types/openai/image';

import { createBizOpenAI } from '../createBizOpenAI';
import { createImageGeneration } from './createImageGeneration';
import OpenAI from 'openai';

export const runtime = 'edge';

export const POST = async (req: Request) => {
  const payload = (await req.json()) as OpenAIImagePayload;

  const openaiOrErrResponse = await createBizOpenAI(req, payload.model,[]);
  // if resOrOpenAI is a Response, it means there is an error,just return it
  if (openaiOrErrResponse.errorResponse instanceof Response) return openaiOrErrResponse.errorResponse;

  return createImageGeneration({ openai: openaiOrErrResponse.openai as OpenAI, payload });
};
