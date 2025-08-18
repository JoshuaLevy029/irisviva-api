import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerService } from '@nestjs-modules/mailer';

export type MailOptions = {
    to: string;
    template: string;
    subject: string;
    context: any;
}

@Injectable()
export class MailService {
    constructor (
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService
    ) {}

    async send (options: MailOptions) {
        return this.mailerService.sendMail({
            to: options.to,
            subject: options.subject,
            template: options.template,
            context: options.context,
        });
    }
}