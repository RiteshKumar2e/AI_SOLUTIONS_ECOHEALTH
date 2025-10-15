import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { SendMessageDto } from './dto/send-message.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  constructor(
    @InjectModel(Conversation.name) private convModel: Model<ConversationDocument>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  /**
   * Save a message into a conversation (create a new conversation if needed)
   */
  private async appendMessage(
    conversationId: string | null,
    role: 'user' | 'assistant' | 'system',
    content: string,
  ) {
    if (conversationId) {
      const conv = await this.convModel.findById(conversationId);
      if (!conv) throw new Error('Conversation not found');
      conv.messages.push({ role, content, createdAt: new Date() });
      await conv.save();
      return conv;
    } else {
      const conv = await this.convModel.create({
        messages: [{ role, content, createdAt: new Date() }],
      });
      return conv;
    }
  }

  /**
   * Build messages for the AI provider (OpenAI / Gemini)
   */
  private buildMessagesForProvider(
    conv: ConversationDocument | null,
    userMessage: string,
  ) {
    const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];

    // Include previous conversation messages
    if (conv && conv.messages?.length) {
      for (const m of conv.messages) {
        messages.push({ role: m.role, content: m.content });
      }
    }

    // ✅ Append the current user message properly
    messages.push({ role: 'user', content: userMessage });
    return messages;
  }

  /**
   * Call OpenAI Chat Completions API
   */
  private async callOpenAI(messages: Array<{ role: string; content: string }>) {
    const key = this.configService.get<string>('OPENAI_API_KEY');
    if (!key) throw new Error('OPENAI_API_KEY not set');

    const url = 'https://api.openai.com/v1/chat/completions';
    const payload = {
      model: this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o-mini',
      messages,
      temperature: 0.2,
      max_tokens: 800,
    };

    const resp$ = this.httpService.post(url, payload, {
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    });

    const resp = await firstValueFrom(resp$);
    const reply =
      resp.data?.choices?.[0]?.message?.content ??
      resp.data?.choices?.[0]?.text ??
      '';
    return reply;
  }

  /**
   * Placeholder for Gemini API call
   */
  private async callGemini(messages: Array<{ role: string; content: string }>) {
    const key = this.configService.get<string>('GEMINI_API_KEY');
    if (!key) throw new Error('GEMINI_API_KEY not set');

    // TODO: Implement actual Gemini API call
    return `Gemini response placeholder (replace with real API call). Received ${messages.length} messages.`;
  }

  /**
   * Main message handler
   * Stores user message, calls provider, saves and returns AI reply
   */
  async handleMessage(dto: SendMessageDto) {
    // 1) Load existing conversation if ID is provided
    let conv: ConversationDocument | null = null;
    if (dto.conversationId) {
      conv = await this.convModel.findById(dto.conversationId);
      if (!conv) throw new Error('Conversation not found');
    }

    // 2) Append user message
    const afterUser = await this.appendMessage(
      dto.conversationId ?? null,
      'user',
      dto.message,
    );
    const conversationId = (afterUser._id as any).toString();

    // 3) Prepare messages for AI
    const messages = this.buildMessagesForProvider(
      afterUser as ConversationDocument,
      dto.message,
    );

    // 4) Call the AI provider
    let assistantReply: string;
    const provider = dto.provider ?? 'openai';

    try {
      if (provider === 'openai') {
        assistantReply = await this.callOpenAI(messages);
      } else {
        assistantReply = await this.callGemini(messages);
      }
    } catch (err) {
      this.logger.error('Provider call failed', err?.message ?? err);
      throw err;
    }

    // 5) Save assistant reply
    const afterAssistant = await this.appendMessage(
      conversationId,
      'assistant',
      assistantReply,
    );

    // 6) Return latest assistant message
    const latest = afterAssistant.messages[afterAssistant.messages.length - 1];
    return {
      conversationId,
      reply: latest.content,
    };
  }

  /**
   * Fetch a conversation by ID
   */
  async getConversation(conversationId: string) {
    const conv = await this.convModel.findById(conversationId);
    if (!conv) throw new Error('Conversation not found');
    return conv;
  }
}
