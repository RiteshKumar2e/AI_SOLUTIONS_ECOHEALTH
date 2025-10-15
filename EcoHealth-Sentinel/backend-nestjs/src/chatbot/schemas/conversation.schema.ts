import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true, default: [] })
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt?: Date;
  }>;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
