export async function handlePetRequest(url, request, env) {
  if (request.method === 'GET') {
    try {
      const { results } = await env.DB.prepare("SELECT * FROM pet_state WHERE id = 1").all();
      let pet = results[0];
      if (!pet) {
        pet = { name: 'Cloud Cat', exp: 0, level: 1 };
      }
      return new Response(JSON.stringify(pet), { 
        headers: { 'Content-Type': 'application/json' } 
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
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

      return new Response(JSON.stringify({ success: true, exp: currentExp, level }), { 
        headers: { 'Content-Type': 'application/json' } 
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}
