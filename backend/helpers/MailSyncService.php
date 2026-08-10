<?php

require_once __DIR__ . '/EnvLoader.php';

class MailSyncService {
    private static function cleanEmailBody(string $body): string {
        // Strip out email quotes/replies
        $lines = explode("\n", $body);
        $cleanLines = [];

        foreach ($lines as $line) {
            $trimmed = trim($line);

            // Skip MIME headers and boundary lines
            if (
                strpos($trimmed, '--') === 0 || 
                strpos(strtolower($trimmed), 'content-type:') === 0 ||
                strpos(strtolower($trimmed), 'content-transfer-encoding:') === 0 ||
                strpos(strtolower($trimmed), 'charset=') === 0 ||
                $trimmed === 'Content-Type:' ||
                $trimmed === 'Content-Transfer-Encoding:'
            ) {
                continue;
            }

            // Common reply markers
            if (
                strpos($trimmed, '-----Original Message-----') === 0 ||
                strpos($trimmed, '________________________________') === 0 ||
                preg_match('/^On\s+.*wrote:$/i', $trimmed) ||
                preg_match('/^Am\s+.*schrieb:$/i', $trimmed) ||
                strpos($trimmed, 'From:') === 0 ||
                strpos($trimmed, 'To:') === 0 ||
                strpos($trimmed, 'Sent:') === 0
            ) {
                break; // Stop parsing, this is quoted history
            }

            // Remove leading > from blockquotes
            if (strpos($trimmed, '>') === 0) {
                continue; 
            }

            $cleanLines[] = $line;
        }

        $result = implode("\n", $cleanLines);
        $result = preg_replace('/<br\s*\/?>/i', "\n", $result);
        $result = strip_tags($result);
        return trim($result);
    }

    private static function decodePayload(string $body, string $encoding): string {
        $encoding = strtolower(trim($encoding));
        if ($encoding === 'base64') {
            return base64_decode($body);
        }
        if ($encoding === 'quoted-printable') {
            return quoted_printable_decode($body);
        }
        return $body;
    }

    public static function sync(PDO $db): int {
        EnvLoader::load();

        $host = 'imap.gmail.com';
        $port = 993;
        $user = EnvLoader::get('SMTP_USERNAME', '');
        $pass = EnvLoader::get('SMTP_PASSWORD', '');

        if (empty($user) || empty($pass)) {
            return 0;
        }

        // Open socket connection
        $socket = @fsockopen('ssl://' . $host, $port, $errno, $errstr, 8);
        if (!$socket) {
            error_log("[MailSyncService Error] Connection failed: $errstr ($errno)");
            return 0;
        }

        // Helper to read command responses
        $readResponse = function($socket, $tag) {
            $response = '';
            while (!feof($socket)) {
                $line = fgets($socket, 8192);
                $response .= $line;
                if (strpos($line, $tag . ' ') === 0) {
                    break;
                }
            }
            return $response;
        };

        // Read greeting
        fgets($socket, 8192);

        // LOGIN
        fwrite($socket, "A1 LOGIN $user $pass\r\n");
        $loginRes = $readResponse($socket, 'A1');
        if (strpos($loginRes, 'A1 OK') === false) {
            fclose($socket);
            return 0;
        }

        // SELECT INBOX
        fwrite($socket, "A2 SELECT INBOX\r\n");
        $selectRes = $readResponse($socket, 'A2');
        if (strpos($selectRes, 'A2 OK') === false) {
            fwrite($socket, "A5 LOGOUT\r\n");
            fclose($socket);
            return 0;
        }

        // Find EXISTS count
        $total = 0;
        if (preg_match('/\* (\d+)\s+EXISTS/i', $selectRes, $match)) {
            $total = (int)$match[1];
        }

        if ($total === 0) {
            fwrite($socket, "A4 LOGOUT\r\n");
            fclose($socket);
            return 0;
        }

        // Scan the last 30 messages in the Inbox
        $start = max(1, $total - 30);
        $importedCount = 0;

        for ($seq = $total; $seq >= $start; $seq--) {
            // Fetch envelope headers to get Message-ID, Subject, Date, From
            fwrite($socket, "B$seq FETCH $seq (BODY[HEADER.FIELDS (MESSAGE-ID SUBJECT DATE FROM)])\r\n");
            $hdrRes = '';
            while (!feof($socket)) {
                $line = fgets($socket, 8192);
                $hdrRes .= $line;
                if (strpos($line, "B$seq ") === 0) break;
            }

            // Parse headers
            preg_match('/Message-ID:\s*<([^>]+)>/i', $hdrRes, $matchMsgId);
            preg_match('/Subject:\s*([^\r\n]+)/i', $hdrRes, $matchSub);
            preg_match('/From:\s*([^\r\n]+)/i', $hdrRes, $matchFrom);
            preg_match('/Date:\s*([^\r\n]+)/i', $hdrRes, $matchDate);

            $messageId  = $matchMsgId[1] ?? (string)$seq;
            $subject    = $matchSub[1] ?? '';
            $from       = $matchFrom[1] ?? '';
            $dateStr    = $matchDate[1] ?? 'now';

            // Check if already synchronized in DB
            $checkStmt = $db->prepare('SELECT COUNT(*) FROM message_replies WHERE imap_uid = ?');
            $checkStmt->execute([$messageId]);
            if ((int)$checkStmt->fetchColumn() > 0) {
                continue; // Already saved
            }

            $parentMessageId = null;
            $visitorName = '';

            // 1. Direct match: Extract ID from subject tag like Re: [MSG-12] Request
            if (preg_match('/\[MSG-(\d+)\]/i', $subject, $matchId)) {
                $parentMessageId = (int)$matchId[1];
                
                // Verify parent message exists
                $pStmt = $db->prepare('SELECT name, email FROM contact_messages WHERE id = ?');
                $pStmt->execute([$parentMessageId]);
                $parent = $pStmt->fetch(PDO::FETCH_ASSOC);
                if ($parent) {
                    $visitorName = $parent['name'];
                } else {
                    $parentMessageId = null; // reset if not found
                }
            }

            // 2. Fallback match: Extract sender email and match to most recent message in DB
            if ($parentMessageId === null) {
                // Extract email from From header: "Name <email@domain.com>" or just "email@domain.com"
                if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $from, $emailMatches)) {
                    $senderEmail = strtolower($emailMatches[0]);

                    // Skip if sender is the admin himself
                    if ($senderEmail === strtolower($user)) {
                        continue;
                    }

                    // Look up most recent contact message from this visitor email address
                    $pStmt = $db->prepare('SELECT id, name FROM contact_messages WHERE LOWER(email) = ? ORDER BY id DESC LIMIT 1');
                    $pStmt->execute([$senderEmail]);
                    $parent = $pStmt->fetch(PDO::FETCH_ASSOC);
                    if ($parent) {
                        $parentMessageId = (int)$parent['id'];
                        $visitorName = $parent['name'];
                    }
                }
            }

            if ($parentMessageId === null) {
                continue; // No matching thread found in DB
            }

            // Determine sender direction (visitor vs admin self-reply in email client)
            $direction = 'visitor';
            if (strpos(strtolower($from), strtolower($user)) !== false) {
                $direction = 'admin';
            }

            // Fetch body content
            fwrite($socket, "C$seq FETCH $seq (BODYSTRUCTURE BODY[TEXT])\r\n");
            $bodyRes = '';
            while (!feof($socket)) {
                $line = fgets($socket, 8192);
                $bodyRes .= $line;
                if (strpos($line, "C$seq ") === 0) break;
            }

            // Extract encoding (quoted-printable or base64)
            $encoding = '7bit';
            if (preg_match('/"Content-Transfer-Encoding"\s+"([^"]+)"/i', $bodyRes, $encMatch)) {
                $encoding = $encMatch[1];
            } else if (preg_match('/Content-Transfer-Encoding:\s*([^\r\n]+)/i', $bodyRes, $encMatch2)) {
                $encoding = $encMatch2[1];
            }

            // Extract body payload
            $bodyText = '';
            if (preg_match('/\{(\d+)\}\r\n/', $bodyRes, $lenMatch, PREG_OFFSET_CAPTURE)) {
                $startPos = $lenMatch[0][1] + strlen($lenMatch[0][0]);
                $length = (int)$lenMatch[1][0];
                $bodyText = substr($bodyRes, $startPos, $length);
            } else {
                $bodyText = $bodyRes;
            }

            // Decode body according to encoding
            $decodedBody = self::decodePayload($bodyText, $encoding);

            // Clean the body of quotes/HTML
            $cleanBody = self::cleanEmailBody($decodedBody);

            if (empty($cleanBody)) {
                continue;
            }

            // Save reply to DB
            $db->prepare('
                INSERT INTO message_replies (message_id, direction, body, sender_name, imap_uid, created_at) 
                VALUES (?, ?, ?, ?, ?, ?)
            ')->execute([
                $parentMessageId,
                $direction,
                $cleanBody,
                $direction === 'admin' ? 'Admin' : $visitorName,
                $messageId,
                date('Y-m-d H:i:s', strtotime($dateStr))
            ]);

            // Reset parent message status to unread if incoming from visitor
            if ($direction === 'visitor') {
                $db->prepare('UPDATE contact_messages SET status = "unread", is_read = 0 WHERE id = ?')
                    ->execute([$parentMessageId]);
            }

            $importedCount++;
        }

        // Close connection
        fwrite($socket, "A4 LOGOUT\r\n");
        fclose($socket);

        return $importedCount;
    }
}
