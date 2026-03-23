import '@supabase/functions-js/edge-runtime.d.ts';

console.log('Hello from Functions!');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY is not set' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { destination, existingActivities } = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are a travel planning assistant. Suggest 5 activities for a trip to ${destination}.
${existingActivities?.length > 0 ? `The traveler already has these planned: ${existingActivities.join(', ')}. Suggest different activities.` : ''}

Respond ONLY with a valid JSON array. No explanation, no markdown, no backticks. Example format:
[
  {
    "title": "Visit the Eiffel Tower",
    "type": "attraction",
    "description": "Iconic iron lattice tower with panoramic views.",
    "location": "Champ de Mars, Paris",
    "cost": 28
  }
]

Valid types are: attraction, restaurant, hotel, transport, activity, flight, other.
Keep descriptions under 100 characters. Cost should be per person in USD, or 0 if free.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({ error: `Anthropic API error: ${response.status}`, detail: errText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const data = await response.json();
    const text = data.content
      .map((block: { type: string; text?: string }) =>
        block.type === 'text' ? (block.text ?? '') : ''
      )
      .join('');

    const suggestions = JSON.parse(text.trim());

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Failed to generate suggestions', detail: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});


