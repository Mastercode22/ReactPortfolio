<?php
class ContactController {
    private PDO $db;
    public function __construct(PDO $db) { $this->db = $db; }

    // GET /contact
    public function getPublic(): void {
        $contact = $this->db->query('SELECT * FROM contact_settings WHERE is_active=1 ORDER BY id DESC LIMIT 1')->fetch();
        Response::json(true, 'Contact Settings', $contact ?: (object)[]);
    }

    // POST /contact/message
    public function postMessage(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $name    = trim($data['name'] ?? '');
        $email   = trim($data['email'] ?? '');
        $message = trim($data['message'] ?? '');
        $subject = trim($data['subject'] ?? 'Website Inquiry');

        if (!$name || !$email || !$message) {
            Response::json(false, 'Name, email, and message are required', null, 400);
        }

        $stmt = $this->db->prepare('INSERT INTO contact_messages (name, email, subject, message, status) VALUES (?, ?, ?, ?, "unread")');
        $stmt->execute([$name, $email, $subject, $message]);

        Response::json(true, 'Message sent successfully', ['id' => $this->db->lastInsertId()], 201);
    }

    // GET /admin/contact
    public function adminGetSettings(): void {
        $contact = $this->db->query('SELECT * FROM contact_settings ORDER BY id DESC LIMIT 1')->fetch();
        Response::json(true, 'Contact Settings', $contact ?: (object)[]);
    }

    // PUT /admin/contact/{id}
    public function adminUpdateSettings(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $this->db->prepare('UPDATE contact_settings SET email=?,phone=?,location=?,whatsapp=?,timezone_label=?,availability_text=?,map_embed_url=?,map_address_url=?,is_active=? WHERE id=?')
            ->execute([
                $data['email']??null, $data['phone']??null, $data['location']??null, 
                $data['whatsapp']??null, $data['timezone_label']??null, $data['availability_text']??null, 
                $data['map_embed_url']??null, $data['map_address_url']??null, $data['is_active']??1, $id
            ]);
        Response::json(true, 'Contact settings updated');
    }

    // GET /admin/messages
    public function adminGetMessages(): void {
        $messages = $this->db->query('SELECT * FROM contact_messages ORDER BY id DESC')->fetchAll();
        Response::json(true, 'Messages', $messages);
    }

    // PUT /admin/messages/{id}/read
    public function adminMarkRead(int $id): void {
        $this->db->prepare('UPDATE contact_messages SET status="read" WHERE id=?')->execute([$id]);
        Response::json(true, 'Message marked as read');
    }

    // DELETE /admin/messages/{id}
    public function adminDeleteMessage(int $id): void {
        $this->db->prepare('DELETE FROM contact_messages WHERE id=?')->execute([$id]);
        Response::json(true, 'Message deleted');
    }
}
