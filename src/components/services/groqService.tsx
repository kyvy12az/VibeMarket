export const sendMessageToGroq = async (message: string): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error("GROQ_API_KEY không được cấu hình");
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "Bạn là VibeBot - trợ lý mua sắm AI thông minh của VibeMarket, được phát triển bởi VibeMarket. VibeMarket là nền tảng thương mại điện tử hiện đại tại Việt Nam với các tính năng:\n\n🛍️ Mua sắm đa dạng: Thời trang, làm đẹp, điện tử, gia dụng\n🎁 Flash Sale & Ưu đãi hot hàng ngày\n💎 Điểm thưởng & Vòng quay may mắn\n🤖 AI Shopping Assistant - tư vấn phong cách\n💬 Community - chia sẻ review sản phẩm\n🏪 Local Brand - hỗ trợ thương hiệu Việt\n\nNhiệm vụ của bạn:\n✨ Tư vấn sản phẩm phù hợp với nhu cầu khách hàng\n💡 Giới thiệu ưu đãi, chương trình khuyến mãi\n📦 Hỗ trợ thông tin về đơn hàng, vận chuyển\n🎯 Gợi ý phong cách, xu hướng thời trang\n💳 Hướng dẫn thanh toán, tích điểm\n\nLuôn trả lời bằng tiếng Việt, thân thiện, nhiệt tình như một sales advisor chuyên nghiệp. Sử dụng emoji phù hợp để tạo cảm giác gần gũi. Khi không chắc chắn về sản phẩm cụ thể, hãy gợi ý khách hàng tìm kiếm trên VibeMarket hoặc liên hệ CSKH.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`Groq API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid response format:", data);
      throw new Error("Invalid response format from Groq API");
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Chatbot api error:", error);
    if (error instanceof Error) {
      return `Xin lỗi, đã có lỗi: ${error.message}`;
    }
    return "Xin lỗi, tôi không thể xử lý yêu cầu của bạn. Vui lòng thử lại sau.";
  }
};
