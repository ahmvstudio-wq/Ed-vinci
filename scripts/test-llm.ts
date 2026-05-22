import { callLLM } from '../src/utils/llm';

async function test() {
  console.log('Testing callLLM()...');
  try {
    const prompt = `
    You are a JSON generator.
    Output only JSON in the exact format:
    { "status": string, "message": string }
    No markdown, no explanation.
    `;
    const user = "Say hello world";
    
    const response = await callLLM(prompt, user);
    console.log('Raw response:', response);
    
    const parsed = JSON.parse(response);
    console.log('Parsed JSON:', parsed);
    console.log('✅ Success! callLLM() returns valid parsed JSON.');
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

test();
