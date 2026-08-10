<?php
class TechnologiesController {
    private PDO $db;
    public function __construct(PDO $db) { $this->db = $db; }

    // GET /technologies
    public function getPublic(): void {
        $techs = $this->db->query('SELECT * FROM technologies WHERE is_active = 1 ORDER BY sort_order ASC')->fetchAll();
        // Map icon_key → icon for frontend compatibility
        foreach ($techs as &$t) { $t['icon'] = $t['icon_key']; }
        Response::json(true, 'Technologies', $techs);
    }

    // GET /admin/technologies
    public function adminGetAll(): void {
        $techs = $this->db->query('SELECT * FROM technologies ORDER BY sort_order ASC')->fetchAll();
        foreach ($techs as &$t) { $t['icon'] = $t['icon_key']; }
        Response::json(true, 'Technologies', $techs);
    }

    // POST /admin/technologies
    public function adminCreate(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $this->db->prepare('INSERT INTO technologies (name,category,icon_key,color,description,level,sort_order,is_active) VALUES (?,?,?,?,?,?,?,?)');
        $stmt->execute([$data['name']??'', $data['category']??null, $data['icon_key']??$data['icon']??null, $data['color']??null, $data['description']??null, $data['level']??80, $data['sort_order']??0, $data['is_active']??1]);
        Response::json(true, 'Technology created', ['id' => $this->db->lastInsertId()], 201);
    }

    // PUT /admin/technologies/{id}
    public function adminUpdate(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $this->db->prepare('UPDATE technologies SET name=?,category=?,icon_key=?,color=?,description=?,level=?,sort_order=?,is_active=? WHERE id=?')
            ->execute([$data['name']??'', $data['category']??null, $data['icon_key']??$data['icon']??null, $data['color']??null, $data['description']??null, $data['level']??80, $data['sort_order']??0, $data['is_active']??1, $id]);
        Response::json(true, 'Technology updated');
    }

    // DELETE /admin/technologies/{id}
    public function adminDelete(int $id): void {
        $this->db->prepare('DELETE FROM technologies WHERE id = ?')->execute([$id]);
        Response::json(true, 'Technology deleted');
    }
}
