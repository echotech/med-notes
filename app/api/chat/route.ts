import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
const soapComponents = ['subjective', 'objective', 'assessment and plan', 'description', 'treatment', 'physical exam'];
  const messages = soapComponents.map((component) => ({
    role: 'user',
    content: `Write me a ${component} statement for a soap note for a patient with ${disease}.`
  }));

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: messages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
