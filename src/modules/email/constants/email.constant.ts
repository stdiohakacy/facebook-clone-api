import { ENUM_MAIL_TEMPLATE_KEY } from './email.enum.constant';

export const EMAIL_TEMPLATE = {
    [ENUM_MAIL_TEMPLATE_KEY.ACCOUNT_ACTIVATION]: {
        content: `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Activation</title>
            </head>
            <body>
                <div style="text-align: center; padding: 20px;">
                    <h1>Account Activation</h1>
                    <p>Thank you {{ username }} for registering with our website. To activate your account, please click the button below:</p>
                    <a href="{{ activationLink }}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Activate Account</a>
                    <p>If the button above does not work, you can also activate your account by copying and pasting the following link into your browser:</p>
                    <p>{{ activationLink }}</p>
                    <p>If you did not register on our website, please disregard this email.</p>
                </div>
            </body>
        </html>
        `,
    },
};
