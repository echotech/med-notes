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
  
    //const soapComponents = ['subjective', 'objective', 'assessment and plan', 'description', 'treatment', 'physical exam'];
    const { vibe, disease } = await req.json();
    

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'user',
       // content: `You are a medical assistant. Your goal is to write the most accurate and professional SOAP notes. Write me a ${vibe} statement for a soap note for a patient with ${disease}.`
        content: `You are a medical assistant skilled in creating concise and professional SOAP notes for patient documentation with no unnecessary commentary. Provide a statement for a SOAP note for a patient diagnosed with ${disease}. Include only relevant clinical findings and necessary patient information. Avoid any placeholders and ensure the text is ready for inclusion in medical records. Include only the ${vibe} section.`
        
      }
    ] 
  });
  
  
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}



