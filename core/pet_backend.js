import { jsonResponse, errorResponse } from './utils.js';

export async function handlePetRequest(url, request, env) {
  if (request.method === 'GET') {
    try {
      const { results } = await env.DB.prepare("SELECT * FROM pet_state WHERE id = 1").all();
      let pet = results[0];
      if (!pet) {
        pet = { name: 'Cloud Cat', exp: 0, level: 1 };
      }
      return jsonResponse(pet);
    } catch (e) {
      return errorResponse(e.message);
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const action = body.action || 'feed';
      
      const expGain = action === 'feed' ? 10 : (action === 'play' ? 15 : 5);
      
      // Get current exp
      const { results } = await env.DB.prepare("SELECT exp FROM pet_state WHERE id = 1").all();
      let currentExp = results[0] ? results[0].exp : 0;
      
      currentExp += expGain;
      const level = Math.floor(currentExp / 100) + 1;

      await env.DB.prepare("UPDATE pet_state SET exp = ?, level = ? WHERE id = 1")
        .bind(currentExp, level)
        .run();

      return jsonResponse({ success: true, exp: currentExp, level });
    } catch (e) {
      return errorResponse(e.message);
    }
  }

  return new Response("Method not allowed", { status: 405 });
}
