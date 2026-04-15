
import { SYSTEM_PROMPT } from "../../enums/SERVER_ENUMS.js";
import Interactions from '../../server/utils/weaviate/Interactions.js';

export default {
  fetchMistralresponse: async (req, res) => {
    // console.log('Received request:', req.body);
    try {
      const { username, message, conversationHistory } = req.body;

      const interactions = new Interactions(username, "mistral");
      // console.log('interactions instance created:', interactions);

      const pet_context = await interactions.getContext(username, { content: message });
      // console.log('Pet context retrieved:', pet_context);
      await interactions.client.close();

      // Prepare the conversation history for Mistral API
      const mistralMessages = [
        {
          role: 'system',
          content: SYSTEM_PROMPT + (pet_context ? `\nPet Context:\n${pet_context.map((meta) => JSON.stringify(meta.properties)).join('\n')}` : '')
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ];

      const response = await fetch(process.env.MISTRAL_COMPLETION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: mistralMessages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Mistral API error:', errorData);
        throw new Error(errorData.detail || 'Mistral API error');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      return res.status(200).json({
        success: true,
        response: aiResponse
      });

    } catch (error) {
      console.error('AI Assistant error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to process AI request'
      });
    }
  }
};
