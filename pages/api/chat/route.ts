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
  
    // Buffer the request stream to get the plain text body
    const buffers = [];
    const soapComponents = ['subjective', 'objective', 'assessment and plan', 'description', 'treatment', 'physical exam'];
    const { disease } = await req.json();
    // const messages = soapComponents.map((component) => ({
    // role: 'user',
    // content: `You are a medical assistant. Your goal is to write the most accurate and professional SOAP notes. Write me a ${component} statement for a soap note for a patient with ${disease}.`
  

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'user',
        content: `You are a medical assistant. Your goal is to write the most accurate and professional SOAP notes. Write me a ${soapComponents} statement for a soap note for a patient with ${disease}.`
      }
    ] 
  });
  
  
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}



