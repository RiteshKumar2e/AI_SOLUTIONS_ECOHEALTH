
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  conversationId?: string; // If absent, a new conversation will be created

  @IsOptional()
  @IsString()
  provider?: 'openai' | 'gemini'; // choose provider; defaults to 'openai'
}
