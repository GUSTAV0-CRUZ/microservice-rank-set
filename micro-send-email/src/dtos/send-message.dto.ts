export class SendMessageDto {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}
