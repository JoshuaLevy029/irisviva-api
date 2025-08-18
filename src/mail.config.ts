import { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from "path";

export const MailConfig = (configService: ConfigService): MailerOptions => ({
    transport: {
        host: configService.get<string>('MAIL_HOST') ?? '',
        port: parseInt(`${configService.get<number>('MAIL_PORT') ?? 587}`),
        secure: Boolean(configService.get<boolean>('MAIL_SECURE') ?? false),
        auth: {
            user: configService.get<string>('MAIL_USERNAME') ?? '',
            pass: configService.get<string>('MAIL_PASSWORD') ?? ''
        },
        encoding: 'utf8',
        requireTLS: false,
        from: {
            name: configService.get<string>('MAIL_FROM_NAME') ?? '',
            address: configService.get<string>('MAIL_FROM_ADDRESS') ?? ''
        },
        debug: true,
        logger: true,
    },
    defaults: {
        from: `"${configService.get<string>('MAIL_FROM_NAME')}" <${configService.get<string>('MAIL_FROM_ADDRESS')}>`,
    },
    preview: false,
    template: {
        dir: join(__dirname.split('/dist')[0], 'dist', 'views'),
        adapter: new HandlebarsAdapter({}, {
            inlineCssEnabled: true,
        }),
        options: {
            strict: false,
        },
    },
    options: {
        partials: {
            dir: join(__dirname.split('/dist')[0], 'dist', 'views', 'partials'),
            options: {
                strict: false,
            },
        }
    }
});