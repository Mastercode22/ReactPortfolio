<?php

require_once __DIR__ . '/EnvLoader.php';
require_once __DIR__ . '/../vendor/phpmailer/src/Exception.php';
require_once __DIR__ . '/../vendor/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/../vendor/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Mailer {

    public static function sendContactNotification(array $data): bool {
        EnvLoader::load();

        $smtpHost     = EnvLoader::get('SMTP_HOST', '');
        $smtpPort     = (int)EnvLoader::get('SMTP_PORT', 587);
        $smtpUser     = EnvLoader::get('SMTP_USERNAME', '');
        $smtpPass     = EnvLoader::get('SMTP_PASSWORD', '');
        $smtpSecure   = EnvLoader::get('SMTP_ENCRYPTION', PHPMailer::ENCRYPTION_STARTTLS);
        $fromEmail    = EnvLoader::get('SMTP_FROM_EMAIL', $smtpUser ?: 'no-reply@portfolio.com');
        $fromName     = EnvLoader::get('SMTP_FROM_NAME', 'Portfolio Contact System');
        $receiver     = EnvLoader::get('CONTACT_RECEIVER_EMAIL', $fromEmail);

        if (empty($smtpHost) || empty($receiver)) {
            error_log('[Mailer Warning] SMTP_HOST or CONTACT_RECEIVER_EMAIL not configured in environment.');
            return false;
        }

        $visitorName   = trim($data['name'] ?? 'Portfolio Visitor');
        $visitorEmail  = trim($data['email'] ?? '');
        $subject       = trim($data['subject'] ?? 'New Inquiry');
        $messageText   = trim($data['message'] ?? '');
        $phone         = trim($data['phone'] ?? '');
        $company       = trim($data['company'] ?? '');
        $projectType   = trim($data['project_type'] ?? '');
        $dateStr       = date('F j, Y, g:i a');

        $mail = new PHPMailer(true);

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = $smtpHost;
            $mail->SMTPAuth   = true;
            $mail->Username   = $smtpUser;
            $mail->Password   = $smtpPass;

            if (strtolower($smtpSecure) === 'ssl' || $smtpPort === 465) {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            } else {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            }
            $mail->Port = $smtpPort;
            $mail->CharSet = 'UTF-8';

            // Recipients
            $mail->setFrom($fromEmail, $fromName);
            if (!empty($visitorEmail)) {
                $mail->addReplyTo($visitorEmail, $visitorName);
            }
            $mail->addAddress($receiver);

            // Content
            $mail->isHTML(true);
            $mail->Subject = "New Portfolio Contact Message - {$subject}";

            $safeName        = htmlspecialchars($visitorName, ENT_QUOTES, 'UTF-8');
            $safeEmail       = htmlspecialchars($visitorEmail, ENT_QUOTES, 'UTF-8');
            $safeSubject     = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
            $safePhone       = htmlspecialchars($phone ?: 'N/A', ENT_QUOTES, 'UTF-8');
            $safeCompany     = htmlspecialchars($company ?: 'N/A', ENT_QUOTES, 'UTF-8');
            $safeProjectType = htmlspecialchars($projectType ?: 'N/A', ENT_QUOTES, 'UTF-8');
            $safeMessage     = nl2br(htmlspecialchars($messageText, ENT_QUOTES, 'UTF-8'));

            $htmlBody = "
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset='utf-8'>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #1f2937; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
                .header { background: linear-gradient(135deg, #6C63FF, #7C5CFF); padding: 24px; text-align: center; color: #ffffff; }
                .header h2 { margin: 0; font-size: 20px; font-weight: 700; }
                .body { padding: 28px; }
                .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .meta-table td { padding: 8px 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
                .meta-table td.label { font-weight: 600; color: #4b5563; width: 130px; }
                .message-box { background: #f9fafb; border-left: 4px solid #7C5CFF; padding: 16px; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #374151; }
                .footer { padding: 16px 28px; background: #f9fafb; font-size: 12px; text-align: center; color: #9ca3af; border-top: 1px solid #f3f4f6; }
              </style>
            </head>
            <body>
              <div class='container'>
                <div class='header'>
                  <h2>New Contact Message Received</h2>
                </div>
                <div class='body'>
                  <table class='meta-table'>
                    <tr><td class='label'>Sender Name:</td><td><strong>{$safeName}</strong></td></tr>
                    <tr><td class='label'>Email:</td><td><a href='mailto:{$safeEmail}' style='color:#7C5CFF;'>{$safeEmail}</a></td></tr>
                    <tr><td class='label'>Subject:</td><td>{$safeSubject}</td></tr>
                    <tr><td class='label'>Phone:</td><td>{$safePhone}</td></tr>
                    <tr><td class='label'>Company:</td><td>{$safeCompany}</td></tr>
                    <tr><td class='label'>Project Type:</td><td>{$safeProjectType}</td></tr>
                    <tr><td class='label'>Date:</td><td>{$dateStr}</td></tr>
                  </table>
                  <p style='font-size: 13px; font-weight: 700; color: #4b5563; margin-bottom: 8px;'>Message Content:</p>
                  <div class='message-box'>
                    {$safeMessage}
                  </div>
                </div>
                <div class='footer'>
                  Sent automatically from your Portfolio Website Contact Form. Reply directly to this email to contact {$safeName}.
                </div>
              </div>
            </body>
            </html>
            ";

            $altBody = "New Contact Message Received\n\n" .
                "Name: {$visitorName}\n" .
                "Email: {$visitorEmail}\n" .
                "Subject: {$subject}\n" .
                "Phone: " . ($phone ?: 'N/A') . "\n" .
                "Company: " . ($company ?: 'N/A') . "\n" .
                "Project Type: " . ($projectType ?: 'N/A') . "\n" .
                "Date: {$dateStr}\n\n" .
                "Message:\n{$messageText}\n";

            $mail->Body    = $htmlBody;
            $mail->AltBody = $altBody;

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("[Mailer Exception] Email notification failed: " . $mail->ErrorInfo);
            return false;
        }
    }

    /**
     * Send an admin reply email directly to the visitor via SMTP.
     */
    public static function sendReply(array $data): bool {
        EnvLoader::load();

        $smtpHost   = EnvLoader::get('SMTP_HOST', '');
        $smtpPort   = (int)EnvLoader::get('SMTP_PORT', 587);
        $smtpUser   = EnvLoader::get('SMTP_USERNAME', '');
        $smtpPass   = EnvLoader::get('SMTP_PASSWORD', '');
        $smtpSecure = EnvLoader::get('SMTP_ENCRYPTION', PHPMailer::ENCRYPTION_STARTTLS);
        $fromEmail  = EnvLoader::get('SMTP_FROM_EMAIL', $smtpUser ?: 'no-reply@portfolio.com');
        $fromName   = EnvLoader::get('SMTP_FROM_NAME', 'Portfolio');

        if (empty($smtpHost) || empty($smtpUser)) {
            error_log('[Mailer Warning] SMTP not configured — cannot send reply.');
            return false;
        }

        $toEmail      = trim($data['to_email']   ?? '');
        $toName       = trim($data['to_name']    ?? 'Visitor');
        $subject      = trim($data['subject']    ?? 'Re: Your Enquiry');
        $replyBody    = trim($data['body']       ?? '');
        $origSubject  = trim($data['orig_subject'] ?? '');
        $origMessage  = trim($data['orig_message'] ?? '');
        $origDate     = trim($data['orig_date']    ?? '');

        if (empty($toEmail) || empty($replyBody)) {
            return false;
        }

        $safeToName     = htmlspecialchars($toName,     ENT_QUOTES, 'UTF-8');
        $safeBody       = nl2br(htmlspecialchars($replyBody,   ENT_QUOTES, 'UTF-8'));
        $safeOrigSub    = htmlspecialchars($origSubject, ENT_QUOTES, 'UTF-8');
        $safeOrigMsg    = nl2br(htmlspecialchars($origMessage, ENT_QUOTES, 'UTF-8'));
        $safeFromName   = htmlspecialchars($fromName,   ENT_QUOTES, 'UTF-8');

        $htmlBody = "
        <!DOCTYPE html>
        <html>
        <head><meta charset='utf-8'>
        <style>
          body { font-family: 'Segoe UI', sans-serif; background:#f4f6f9; margin:0; padding:20px; color:#1f2937; }
          .wrap { max-width:600px; margin:0 auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,.06); border:1px solid #e5e7eb; }
          .hdr  { background:linear-gradient(135deg,#6C63FF,#7C5CFF); padding:24px; text-align:center; color:#fff; }
          .hdr h2 { margin:0; font-size:20px; font-weight:700; }
          .body { padding:28px; font-size:14px; line-height:1.7; color:#374151; }
          .orig { margin-top:24px; padding:16px; background:#f9fafb; border-left:4px solid #7C5CFF; border-radius:6px; font-size:13px; color:#6b7280; }
          .orig-lbl { font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:.05em; margin-bottom:8px; }
          .footer { padding:14px 28px; background:#f9fafb; font-size:11px; text-align:center; color:#9ca3af; border-top:1px solid #f3f4f6; }
        </style>
        </head>
        <body>
          <div class='wrap'>
            <div class='hdr'><h2>Reply from {$safeFromName}</h2></div>
            <div class='body'>
              <p>Hi {$safeToName},</p>
              {$safeBody}
              " . (!empty($origMessage) ? "
              <div class='orig'>
                <div class='orig-lbl'>Your original message" . ($origDate ? " · {$origDate}" : '') . ($origSubject ? " · {$safeOrigSub}" : '') . "</div>
                {$safeOrigMsg}
              </div>" : '') . "
            </div>
            <div class='footer'>This email was sent in reply to your enquiry via the portfolio contact form.</div>
          </div>
        </body>
        </html>";

        $altBody = "Hi {$toName},\n\n{$replyBody}"
            . (!empty($origMessage) ? "\n\n--- Original Message ---\n{$origMessage}" : '');

        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = $smtpHost;
            $mail->SMTPAuth   = true;
            $mail->Username   = $smtpUser;
            $mail->Password   = $smtpPass;
            $mail->SMTPSecure = (strtolower($smtpSecure) === 'ssl' || $smtpPort === 465)
                ? PHPMailer::ENCRYPTION_SMTPS
                : PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = $smtpPort;
            $mail->CharSet    = 'UTF-8';

            $mail->setFrom($fromEmail, $fromName);
            $mail->addAddress($toEmail, $toName);
            $mail->addReplyTo($fromEmail, $fromName);

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $htmlBody;
            $mail->AltBody = $altBody;

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log('[Mailer Exception] Reply email failed: ' . $mail->ErrorInfo);
            return false;
        }
    }
}
