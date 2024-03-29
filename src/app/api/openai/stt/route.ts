import { OpenAISTTPayload } from '@lobehub/tts';
import { createOpenaiAudioTranscriptions } from '@lobehub/tts/server';

import { getPreferredRegion } from '../../config';
import { createBizOpenAI } from '../createBizOpenAI';
import OpenAI from 'openai';

export const runtime = 'edge';
export const preferredRegion = getPreferredRegion();

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const speechBlob = formData.get('speech') as Blob;
  const optionsString = formData.get('options') as string;
  const payload = {
    options: JSON.parse(optionsString),
    speech: speechBlob,
  } as OpenAISTTPayload;

  const openaiOrErrResponse = await createBizOpenAI(req, payload.options.model,[]);

  // if resOrOpenAI is a Response, it means there is an error,just return it
  if (openaiOrErrResponse.errorResponse  instanceof Response) return openaiOrErrResponse.errorResponse;

  const res = await createOpenaiAudioTranscriptions({ openai: openaiOrErrResponse.openai as OpenAI, payload });

  return new Response(JSON.stringify(res), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
};
