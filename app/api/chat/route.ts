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
  const { disease } = await req.json();
  let prompt = "What is 2+2?"
  if (typeof disease === 'string' && disease.trim().length > 0) {
    prompt = `Your task now is to write an answer to a junior attending if pertinent and a SOAP note for a patient hospitalized with ${disease}. Please provide information that is directly pertinent to the diagnosis of ${disease}, including any relevant clinical essential details.`;
  }
  const response = await openai.createChatCompletion({
    model: 'gpt-4-1106-preview',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You are an experienced hospitalist, a senior attending training junior attendings and residents.  You are responsible answering questions and writing admission notes that are concise, professional, and strictly relevant to the patient's condition. When answering a question or documenting a case, unnecessary details and generic placeholders are to be omitted. Your task will be to repeat the query verbatim then answer the question posed by the resident or junior attending and write each of the following sections in this order: You asked about, Answer to the question, the chief complaint, history of present illness, physical exam, medical decision making, rational for hospitalization, assessment, plan, disease description, disease treatment, and expected physical presentation as a result of treatment components, Uptodate.com links to learn more. The note should be factual, succinct, and ready for immediate inclusion in the patient's medical record without the need for further editing. Make sure to not include specific details about the patient, only details about the disease and treatment. When you finish a section of the soap report, include a blank line before starting the next section.`
      },
      {
        role: 'user',
        content: prompt
      }
    ] 
  });
  
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}



