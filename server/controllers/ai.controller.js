

export default {
  handleAIRequest: async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;

      // Prepare the conversation history for Mistral API
      const mistralMessages = [
        {
          role: 'system',
          content: `You are a helpful pet care assistant for HappyTails.
          Provide concise, accurate advice about pet care, health, and training.
          Always prioritize pet safety and well-being.
          If you're unsure about medical advice, suggest consulting a veterinarian.`
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ];

      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
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
        console.log('Mistral API error:', errorData);
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
