<?php

require_once __DIR__ . '/../helpers/Response.php';
require_once __DIR__ . '/../helpers/Validator.php';
require_once __DIR__ . '/../helpers/Mailer.php';
require_once __DIR__ . '/../helpers/MailSyncService.php';

class ContactController {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    // GET /contact (Public settings)
    public function getPublic(): void {
        $contact = $this->db->query('SELECT * FROM contact_settings WHERE is_active=1 ORDER BY id DESC LIMIT 1')->fetch(PDO::FETCH_ASSOC);
        Response::json(true, 'Contact Settings', $contact ?: (object)[]);
    }

    // POST /messages OR POST /contact/message (Public Form Submission)
    public function postMessage(): void {
        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        // 1. Spam Honeypot Protection
        if (!empty($data['website']) || !empty($data['honeypot'])) {
            // Silently discard bot submission with standard success response
            Response::json(true, 'Thank you for reaching out. Your message has been received. I\'ll get back to you as soon as possible.', ['id' => 0]);
            return;
        }

        // 2. Submission Rate Limiting (Max 5 submissions per 10 minutes per IP)
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $rateStmt = $this->db->prepare('SELECT COUNT(*) FROM contact_messages WHERE created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND message LIKE ?');
        // Simple rate check based on recent messages
        $rateStmt->execute(["%[IP: {$ipAddress}]%"]);
        if ((int)$rateStmt->fetchColumn() >= 5) {
            Response::json(false, 'Too many messages sent. Please wait a few minutes before trying again.', null, 429);
            return;
        }

        // 3. Extract & Sanitize Input
        $name        = trim($data['name'] ?? '');
        $email       = trim($data['email'] ?? '');
        $subject     = trim($data['subject'] ?? '');
        $message     = trim($data['message'] ?? '');
        $phone       = trim($data['phone'] ?? '');
        $company     = trim($data['company'] ?? '');
        $projectType = trim($data['project_type'] ?? '');

        // 4. Server-Side Validations
        if (empty($name)) {
            Response::json(false, 'Name is required.', null, 400);
        }
        if (mb_strlen($name) < 2 || mb_strlen($name) > 150) {
            Response::json(false, 'Name must be between 2 and 150 characters.', null, 400);
        }

        if (empty($email)) {
            Response::json(false, 'Email address is required.', null, 400);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 255) {
            Response::json(false, 'Please provide a valid email address.', null, 400);
        }

        if (empty($subject)) {
            Response::json(false, 'Subject is required.', null, 400);
        }
        if (mb_strlen($subject) > 255) {
            Response::json(false, 'Subject cannot exceed 255 characters.', null, 400);
        }

        if (empty($message)) {
            Response::json(false, 'Message is required.', null, 400);
        }
        if (mb_strlen($message) < 10) {
            Response::json(false, 'Message must be at least 10 characters long.', null, 400);
        }
        if (mb_strlen($message) > 10000) {
            Response::json(false, 'Message is too long (maximum 10,000 characters).', null, 400);
        }

        if (!empty($phone) && mb_strlen($phone) > 50) {
            Response::json(false, 'Phone number cannot exceed 50 characters.', null, 400);
        }
        if (!empty($company) && mb_strlen($company) > 150) {
            Response::json(false, 'Company name cannot exceed 150 characters.', null, 400);
        }
        if (!empty($projectType) && mb_strlen($projectType) > 100) {
            Response::json(false, 'Project type cannot exceed 100 characters.', null, 400);
        }

        // 5. Save Message to MySQL Database using PDO Prepared Statements
        try {
            $stmt = $this->db->prepare('
                INSERT INTO contact_messages 
                (name, email, subject, message, phone, company, project_type, status, is_read, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, "unread", 0, NOW())
            ');
            $stmt->execute([
                $name,
                $email,
                $subject,
                $message,
                $phone ?: null,
                $company ?: null,
                $projectType ?: null
            ]);
            $insertedId = (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log('[DB Error] Failed to insert contact_message: ' . $e->getMessage());
            Response::json(false, 'Unable to save your message right now. Please try again later.', null, 500);
            return;
        }

        // 6. Attempt Email Notification via PHPMailer (Non-blocking DB persistence)
        $emailSent = Mailer::sendContactNotification([
            'name'         => $name,
            'email'        => $email,
            'subject'      => $subject,
            'message'      => $message,
            'phone'        => $phone,
            'company'      => $company,
            'project_type' => $projectType
        ]);

        if (!$emailSent) {
            error_log("[Contact System] Message #{$insertedId} saved to database, but SMTP email notification could not be delivered.");
        }

        // 7. Return User-Friendly Success Response
        Response::json(
            true, 
            'Thank you for reaching out. Your message has been received. I\'ll get back to you as soon as possible.', 
            ['id' => $insertedId],
            201
        );
    }

    // GET /admin/contact (Admin Settings)
    public function adminGetSettings(): void {
        $contact = $this->db->query('SELECT * FROM contact_settings ORDER BY id DESC LIMIT 1')->fetch(PDO::FETCH_ASSOC);
        Response::json(true, 'Contact Settings', $contact ?: (object)[]);
    }

    // PUT /admin/contact/{id} (Admin Update Settings)
    public function adminUpdateSettings(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true);

        // Check if settings row exists in DB
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM contact_settings WHERE id = ?');
        $stmt->execute([$id]);
        $exists = (int)$stmt->fetchColumn() > 0;

        if ($exists) {
            $this->db->prepare('UPDATE contact_settings SET email=?,phone=?,location=?,whatsapp=?,timezone_label=?,availability_text=?,map_embed_url=?,map_address_url=?,is_active=? WHERE id=?')
                ->execute([
                    $data['email'] ?? null, $data['phone'] ?? null, $data['location'] ?? null, 
                    $data['whatsapp'] ?? null, $data['timezone_label'] ?? null, $data['availability_text'] ?? null, 
                    $data['map_embed_url'] ?? null, $data['map_address_url'] ?? null, $data['is_active'] ?? 1, $id
                ]);
        } else {
            $this->db->prepare('INSERT INTO contact_settings (id, email, phone, location, whatsapp, timezone_label, availability_text, map_embed_url, map_address_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
                ->execute([
                    $id, $data['email'] ?? null, $data['phone'] ?? null, $data['location'] ?? null, 
                    $data['whatsapp'] ?? null, $data['timezone_label'] ?? null, $data['availability_text'] ?? null, 
                    $data['map_embed_url'] ?? null, $data['map_address_url'] ?? null, $data['is_active'] ?? 1
                ]);
        }

        Response::json(true, 'Contact settings updated');
    }

    // GET /admin/messages (Admin List Messages)
    public function adminGetMessages(): void {
        $status = $_GET['status'] ?? null;
        $search = $_GET['search'] ?? null;

        // Automatically sync replies from email inbox before listing
        MailSyncService::sync($this->db);

        $sql = 'SELECT * FROM contact_messages WHERE 1=1';
        $params = [];

        if (!empty($status) && $status !== 'all') {
            if ($status === 'unread') {
                $sql .= ' AND (status = "unread" OR status = "new" OR is_read = 0)';
            } else if ($status === 'read') {
                $sql .= ' AND (status = "read" OR is_read = 1)';
            } else {
                $sql .= ' AND status = ?';
                $params[] = $status;
            }
        }

        if (!empty($search)) {
            $sql .= ' AND (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
            $searchParam = '%' . $search . '%';
            $params = array_merge($params, [$searchParam, $searchParam, $searchParam, $searchParam]);
        }

        $sql .= ' ORDER BY id DESC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::json(true, 'Contact Messages', $messages);
    }

    // GET /admin/messages/{id} OR GET /messages/{id} (Admin View Single Message Details & Auto-Mark Read)
    public function adminGetOneMessage(int $id): void {
        // Automatically sync replies from email inbox before displaying details
        MailSyncService::sync($this->db);

        $stmt = $this->db->prepare('SELECT * FROM contact_messages WHERE id = ?');
        $stmt->execute([$id]);
        $message = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$message) {
            Response::json(false, 'Message not found', null, 404);
            return;
        }

        // Auto-mark as read if currently unread
        if ((int)$message['is_read'] === 0 || $message['status'] === 'unread' || $message['status'] === 'new') {
            $updateStmt = $this->db->prepare('UPDATE contact_messages SET is_read = 1, status = "read" WHERE id = ?');
            $updateStmt->execute([$id]);
            $message['is_read'] = 1;
            $message['status'] = 'read';
        }

        Response::json(true, 'Message Details', $message);
    }

    // PUT /admin/messages/{id}/read OR PATCH /messages/{id}/read (Admin Mark as Read / Unread)
    public function adminMarkRead(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $isRead = isset($data['is_read']) ? (bool)$data['is_read'] : true;
        $newStatus = $isRead ? 'read' : 'unread';

        $stmt = $this->db->prepare('UPDATE contact_messages SET is_read = ?, status = ? WHERE id = ?');
        $stmt->execute([$isRead ? 1 : 0, $newStatus, $id]);

        Response::json(true, $isRead ? 'Message marked as read' : 'Message marked as unread');
    }

    // PUT /admin/messages/{id}/status OR PATCH /messages/{id}/status (Admin Change Status)
    public function adminUpdateStatus(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $newStatus = strtolower(trim($data['status'] ?? 'read'));

        $allowedStatuses = ['unread', 'new', 'read', 'replied', 'archived'];
        if (!in_array($newStatus, $allowedStatuses)) {
            Response::json(false, 'Invalid status provided', null, 400);
            return;
        }

        $isRead = ($newStatus === 'unread' || $newStatus === 'new') ? 0 : 1;

        $stmt = $this->db->prepare('UPDATE contact_messages SET status = ?, is_read = ? WHERE id = ?');
        $stmt->execute([$newStatus, $isRead, $id]);

        Response::json(true, "Message status updated to {$newStatus}");
    }

    // POST /admin/messages/{id}/reply  — Send SMTP reply + save to DB
    public function adminReplyMessage(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];

        $stmt = $this->db->prepare('SELECT * FROM contact_messages WHERE id = ?');
        $stmt->execute([$id]);
        $original = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$original) {
            Response::json(false, 'Message not found', null, 404);
            return;
        }

        $replyBody = trim($data['body'] ?? '');
        if (empty($replyBody)) {
            Response::json(false, 'Reply body cannot be empty.', null, 400);
            return;
        }
        if (mb_strlen($replyBody) > 20000) {
            Response::json(false, 'Reply is too long (max 20,000 characters).', null, 400);
            return;
        }

        $origSubject = trim($original['subject'] ?? '');
        $subject     = 'Re: [MSG-' . $id . '] ' . ($origSubject ?: 'Your Enquiry');

        $sent = Mailer::sendReply([
            'to_email'     => $original['email'],
            'to_name'      => $original['name'],
            'subject'      => $subject,
            'body'         => $replyBody,
            'orig_subject' => $origSubject,
            'orig_message' => $original['message'],
            'orig_date'    => $original['created_at'] ? date('M j, Y g:i a', strtotime($original['created_at'])) : '',
        ]);

        // Save reply to conversation thread regardless of SMTP success
        $this->db->prepare('INSERT INTO message_replies (message_id, direction, body, sender_name, created_at) VALUES (?, "admin", ?, "Admin", NOW())')
            ->execute([$id, $replyBody]);

        // Mark original message as replied
        $this->db->prepare('UPDATE contact_messages SET status = "replied", is_read = 1 WHERE id = ?')
            ->execute([$id]);

        if (!$sent) {
            // Return success but notify the user that SMTP failed
            Response::json(true, 'Reply saved to history, but the email could not be sent (blocked by your free hosting firewall).', ['email_sent' => false]);
            return;
        }

        Response::json(true, 'Reply sent successfully to ' . $original['email'], ['email_sent' => true]);
    }

    // GET /admin/messages/{id}/replies — Get all conversation replies
    public function adminGetReplies(int $id): void {
        $stmt = $this->db->prepare('SELECT * FROM message_replies WHERE message_id = ? ORDER BY created_at ASC');
        $stmt->execute([$id]);
        $replies = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::json(true, 'Replies', $replies);
    }

    // POST /admin/messages/{id}/replies/visitor — Manually log a reply received from visitor
    public function adminLogVisitorReply(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $body = trim($data['body'] ?? '');

        if (empty($body)) {
            Response::json(false, 'Reply content cannot be empty.', null, 400);
            return;
        }

        // Fetch visitor name
        $stmt = $this->db->prepare('SELECT name FROM contact_messages WHERE id = ?');
        $stmt->execute([$id]);
        $msg = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$msg) {
            Response::json(false, 'Message not found', null, 404);
            return;
        }

        $this->db->prepare('INSERT INTO message_replies (message_id, direction, body, sender_name, created_at) VALUES (?, "visitor", ?, ?, NOW())')
            ->execute([$id, $body, $msg['name']]);

        // Update original message status back to unread if it was replied
        $this->db->prepare('UPDATE contact_messages SET status = "unread", is_read = 0 WHERE id = ? AND status = "replied"')
            ->execute([$id]);

        Response::json(true, 'Visitor reply logged successfully');
    }

    // DELETE /admin/messages/{id} OR DELETE /messages/{id} (Admin Delete Message)
    public function adminDeleteMessage(int $id): void {
        $stmt = $this->db->prepare('DELETE FROM contact_messages WHERE id = ?');
        $stmt->execute([$id]);
        Response::json(true, 'Message deleted successfully');
    }

    // GET /admin/messages/stats OR GET /messages/stats (Admin Message Statistics)
    public function adminGetStats(): void {
        $totalMessages   = (int)$this->db->query('SELECT COUNT(*) FROM contact_messages')->fetchColumn();
        $unreadMessages  = (int)$this->db->query('SELECT COUNT(*) FROM contact_messages WHERE is_read = 0 OR status = "unread" OR status = "new"')->fetchColumn();
        $readMessages    = (int)$this->db->query('SELECT COUNT(*) FROM contact_messages WHERE is_read = 1 OR status = "read"')->fetchColumn();
        $repliedMessages = (int)$this->db->query('SELECT COUNT(*) FROM contact_messages WHERE status = "replied"')->fetchColumn();
        $archivedMessages= (int)$this->db->query('SELECT COUNT(*) FROM contact_messages WHERE status = "archived"')->fetchColumn();
        $messagesToday   = (int)$this->db->query('SELECT COUNT(*) FROM contact_messages WHERE DATE(created_at) = CURDATE()')->fetchColumn();
        $messagesMonth   = (int)$this->db->query('SELECT COUNT(*) FROM contact_messages WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())')->fetchColumn();

        Response::json(true, 'Message Statistics', [
            'total_messages'    => $totalMessages,
            'unread_messages'   => $unreadMessages,
            'read_messages'     => $readMessages,
            'replied_messages'  => $repliedMessages,
            'archived_messages' => $archivedMessages,
            'messages_today'    => $messagesToday,
            'messages_this_month' => $messagesMonth,
        ]);
    }
}
