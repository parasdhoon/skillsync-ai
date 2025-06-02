import { Schema, model, models, Types } from 'mongoose';

const MessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['user', 'system', 'ai'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ChatSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    chatTitle: { type: String, default: 'Untitled Match' },
    resumeText: { type: String },
    jdText: { type: String },
    matchScore: { type: Number },
    strengths: [String],
    suggestions: [String],
    messages: [MessageSchema],
  },
  { timestamps: true }
);

const Chat = models.Chat || model('Chat', ChatSchema);
export default Chat;