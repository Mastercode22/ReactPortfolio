<?php
class SocialController {
    private PDO $db;
    public function __construct(PDO $db) { $this->db = $db; }

    // GET /social-links
    public function getPublic(): void {
        $links = $this->db->query('SELECT * FROM social_links WHERE is_active=1 ORDER BY sort_order ASC')->fetchAll();
        Response::json(true, 'Social Links', $links);
    }

    // GET /admin/social-links
    public function adminGetAll(): void {
        $links = $this->db->query('SELECT * FROM social_links ORDER BY sort_order ASC')->fetchAll();
        Response::json(true, 'Social Links', $links);
    }

    // POST /admin/social-links
    public function adminCreate(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $this->db->prepare('INSERT INTO social_links (platform,url,icon_name,label,sort_order,is_active) VALUES (?,?,?,?,?,?)');
        $stmt->execute([$data['platform']??'', $data['url']??'', $data['icon_name']??null, $data['label']??null, $data['sort_order']??0, $data['is_active']??1]);
        Response::json(true, 'Social link created', ['id' => $this->db->lastInsertId()], 201);
    }

    // PUT /admin/social-links/{id}
    public function adminUpdate(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $this->db->prepare('UPDATE social_links SET platform=?,url=?,icon_name=?,label=?,sort_order=?,is_active=? WHERE id=?')
            ->execute([$data['platform']??'', $data['url']??'', $data['icon_name']??null, $data['label']??null, $data['sort_order']??0, $data['is_active']??1, $id]);
        Response::json(true, 'Social link updated');
    }

    // DELETE /admin/social-links/{id}
    public function adminDelete(int $id): void {
        $this->db->prepare('DELETE FROM social_links WHERE id=?')->execute([$id]);
        Response::json(true, 'Social link deleted');
    }
}
