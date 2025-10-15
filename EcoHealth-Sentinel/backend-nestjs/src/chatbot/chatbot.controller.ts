import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('send')
  async sendMessage(@Body() dto: SendMessageDto) {
    // returns { conversationId, reply }
    return this.chatbotService.handleMessage(dto);
  }

  @Get('conversation/:id')
  async getConversation(@Param('id') id: string) {
    return this.chatbotService.getConversation(id);
  }
}
