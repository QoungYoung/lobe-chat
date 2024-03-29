import { OpenAITTSPayload } from '@lobehub/tts';
import { createOpenaiAudioSpeech } from '@lobehub/tts/server';

import { getPreferredRegion } from '../../config';
import { createBizOpenAI } from '../createBizOpenAI';
import OpenAI from 'openai';

export const runtime = 'edge';
export const preferredRegion = getPreferredRegion();

export const POST = async (req: Request) => {
  const payload = (await req.json()) as OpenAITTSPayload;

  const openaiOrErrResponse = await createBizOpenAI(req, payload.options.model,[]);

  // if resOrOpenAI is a Response, it means there is an error,just return it
  if (openaiOrErrResponse.errorResponse instanceof Response) return openaiOrErrResponse.errorResponse;

  return await createOpenaiAudioSpeech({ openai: openaiOrErrResponse.openai as OpenAI, payload });
};
