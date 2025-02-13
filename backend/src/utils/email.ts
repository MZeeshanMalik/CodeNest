const Mailjet = require("node-mailjet");

// Initialize Mailjet with your API keys
const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC, // Your Mailjet API Key
  process.env.MJ_APIKEY_PRIVATE // Your Mailjet Secret Key
);

/**
 * Send a "Forgot Password" email with a reset token
 * @param {string} email - The recipient's email address
 * @param {string} resetToken - The reset token to include in the email
 */
export const sendForgotPasswordEmail = async (
  email: string,
  resetToken: string
) => {
  try {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "m121zeeshan@gmail.com", // Verified sender email in Mailjet
            Name: "Code Nest Support", // Recognizable sender name
          },
          To: [
            {
              Email: email, // Recipient email
              Name: "User",
            },
          ],
          Subject: "Reset Your Code Nest Password", // Neutral subject line
          TextPart: `Hello, you requested a password reset for your Code Nest account. Please use the following link to reset your password: ${resetToken}. If you did not request this, please ignore this email.`, // Plain text version
          HTMLPart: `
              <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                  <h2 style="color: #4A90E2; text-align: center;">Password Reset Request</h2>
                  <p>Hello,</p>
                  <p>You requested a password reset for your <strong>Code Nest</strong> account. Please click the button below to reset your password:</p>
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${resetToken}" style="background-color: #4A90E2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 16px;">Reset Password</a>
                  </div>
                  <p>If the button above doesn't work, copy and paste this link into your browser:</p>
                  <p style="word-break: break-all;">${resetToken}</p>
                  <p>If you did not request this, please ignore this email.</p>
                  <hr style="border: 0; border-top: 1px solid #ddd;">
                  <p style="font-size: 12px; color: #777; text-align: center;">
                    This email was sent to ${email}. If you believe you received this email in error, please contact us at <a href="mailto:support@codenest.com" style="color: #4A90E2;">support@codenest.com</a>.
                  </p>
                  <p style="font-size: 12px; color: #777; text-align: center;">
                    <a href="https://codenest.com/unsubscribe" style="color: #4A90E2;">Unsubscribe</a> from future emails.
                  </p>
                </div>
              </div>
            `,
        },
      ],
    });

    const result = await request;
    console.log("Email sent successfully:", result.body);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// // Example usage
// const userEmail = "user@example.com"; // Replace with the user's email
// const resetToken = "123456"; // Replace with the generated reset token

// sendForgotPasswordEmail(userEmail, resetToken).then((success) => {
//   if (success) {
//     console.log("Forgot password email sent successfully.");
//   } else {
//     console.log("Failed to send forgot password email.");
//   }
// });
