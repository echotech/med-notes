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
    const { disease } = await req.json();
    

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    stream: true,
    messages: [
      {
        role: 'user',
       // content: `You are a medical assistant. Your goal is to write the most accurate and professional SOAP notes. Write me a ${vibe} statement for a soap note for a patient with ${disease}.`
        content: `You are an experienced medical assistant responsible for writing SOAP notes that are concise, professional, and strictly relevant to the patient's condition. When documenting a case, unnecessary details and generic placeholders are to be omitted. Your task now is to write only the subjective, objective, assessment, disease description, disease treatment, and physical result components of a SOAP note for a patient with "${disease}". Please focus solely on this part and provide information that is directly pertinent to the diagnosis of "${disease}", including any relevant clinical findings and essential details. The note should be factual, succinct, and ready for immediate inclusion in the patient's medical record without the need for further editing.`
        
      }
    ] 
  });
  
  
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}



