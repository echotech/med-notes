import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = 'edge';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Buffer the request stream to get the plain text body
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const disease = Buffer.concat(buffers).toString(); // Convert the Buffer to a string

    // ... perform operations with the `disease` variable

    // When done, send back the response
    res.status(200).send(notes);
  } else {
    // Handle any other HTTP methods as needed
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
