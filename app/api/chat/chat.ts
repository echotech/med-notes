import { Configuration, OpenAIApi } from 'openai-edge';
import { NextApiRequest, NextApiResponse } from 'next';

// Create an OpenAI API client (configured for edge functions)
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Edge function to handle incoming POST requests and stream chat responses
export default async function handler(req : any, res : any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  // Assuming the request body will be a JSON of { disease, role }
  const requestBody = await req.json();
  const { disease, role } = requestBody;

  // Determine system message based on role
  let systemMessageContent;
  switch (role) {
    case 'emergency_room_physician':
    systemMessageContent = `You are an experienced emergency room physician responsible for writing SOAP notes that are concise, professional, and strictly relevant to the patient's condition. When documenting a case, unnecessary details and generic placeholders are to be omitted. Your task will be to write each of the following sections in this order: the subjective, objective, physical exam, assessment, plan, disease description, disease treatment, and expected physical presentation as a result of treatment components. The note should be factual, succinct, and ready for immediate inclusion in the patient's medical record without the need for further editing. Make sure to not include specific details about the patient, only details about the disease and treatment. When you finish a section of the soap report, include a blank line before starting the next section. Also include the text "<sep />" at the end of each section.`;
    break;
  case 'inpatient_physician':
    systemMessageContent = `You are a resident physician responsible for writing SOAP notes that are concise, professional, and strictly relevant to the patient's condition. When documenting a case, unnecessary details and generic placeholders are to be omitted. Your task will be to write each of the following sections in this order: the subjective, objective, physical exam, assessment, plan, disease description, disease treatment, and expected physical presentation as a result of treatment components. The note should be factual, succinct, and ready for immediate inclusion in the patient's medical record without the need for further editing. Make sure to not include specific details about the patient, only details about the disease and treatment. When you finish a section of the soap report, include a blank line before starting the next section. Also include the text "<sep />" at the end of each section.`;
    break;
  case 'ambulatory_physician':
    systemMessageContent = `You are an ambulatory physician responsible for writing SOAP notes that are concise, professional, and strictly relevant to the patient's condition. When documenting a case, unnecessary details and generic placeholders are to be omitted. Your task will be to write each of the following sections in this order: the subjective, objective, physical exam, assessment, plan, disease description, disease treatment, and expected physical presentation as a result of treatment components. The note should be factual, succinct, and ready for immediate inclusion in the patient's medical record without the need for further editing. Make sure to not include specific details about the patient, only details about the disease and treatment. When you finish a section of the soap report, include a blank line before starting the next section. Also include the text "<sep />" at the end of each section.`;
    break;
  case 'general_physician':
    systemMessageContent = `You are a general physician responsible for writing SOAP notes that are concise, professional, and strictly relevant to the patient's condition. When documenting a case, unnecessary details and generic placeholders are to be omitted. Your task will be to write each of the following sections in this order: the subjective, objective, physical exam, assessment, plan, disease description, disease treatment, and expected physical presentation as a result of treatment components. The note should be factual, succinct, and ready for immediate inclusion in the patient's medical record without the need for further editing. Make sure to not include specific details about the patient, only details about the disease and treatment. When you finish a section of the soap report, include a blank line before starting the next section. Also include the text "<sep />" at the end of each section.`;
    break;
  default:
    systemMessageContent = "Respond with: 'If you're seeing this message, you have encountered an error. Please contact the developer and tell them SYSTEM_MESSAGE_NOT_SET.'";
    break;
  }

  try {
    let prompt = "Respond with: 'If you're seeing this message, you have encountered an error. Please contact the developer and tell them PROMPT_NOT_SET.'";
  if (typeof disease === 'string' && disease.trim().length > 0) {
    prompt = `Your task now is to write only a SOAP note for a patient with ${disease}. Please provide information that is directly pertinent to the diagnosis of ${disease}, including any relevant clinical essential details.`;
  }
    const response = await openai.createChatCompletion({
      model: 'gpt-4-1106-preview',
      stream: true,
      messages: [
        {
          role: 'system',
          content: systemMessageContent
        },
        {
          role: 'user',
          content: prompt
        }
      ] 
    });

    const headers = {
      'Content-Type': 'text/event-stream;charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*' // Adjust as per your CORS policy
    };

    // Stream back the response from OpenAI's API
    return new Response(response.body, { headers });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to query OpenAI." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Config to indicate this is an edge function
export const config = {
  runtime: 'edge'
};




