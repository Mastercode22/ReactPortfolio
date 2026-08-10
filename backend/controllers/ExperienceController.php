<?php
class ExperienceController {
    private PDO $db;
    public function __construct(PDO $db) { $this->db = $db; }

    private function hydrate(array $items): array {
        foreach ($items as &$e) {
            $sa = $this->db->prepare('SELECT achievement_text FROM experience_achievements WHERE experience_id=? ORDER BY sort_order');
            $sa->execute([$e['id']]);
            $e['achievements'] = $sa->fetchAll(PDO::FETCH_COLUMN);
            $ss = $this->db->prepare('SELECT skill_name FROM experience_skills WHERE experience_id=? ORDER BY sort_order');
            $ss->execute([$e['id']]);
            $e['skills'] = $ss->fetchAll(PDO::FETCH_COLUMN);
        }
        return $items;
    }

    // GET /experience
    public function getPublic(): void {
        $items = $this->db->query('SELECT * FROM experience WHERE is_active=1 ORDER BY sort_order ASC, id DESC')->fetchAll();
        Response::json(true, 'Experience', $this->hydrate($items));
    }

    // GET /admin/experience
    public function adminGetAll(): void {
        $items = $this->db->query('SELECT * FROM experience ORDER BY sort_order ASC, id DESC')->fetchAll();
        Response::json(true, 'Experience', $this->hydrate($items));
    }

    // POST /admin/experience
    public function adminCreate(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $this->db->prepare('INSERT INTO experience (role,company,location,type,period,description,sort_order,is_active) VALUES (?,?,?,?,?,?,?,?)');
        $stmt->execute([$data['role']??'',$data['company']??'',$data['location']??null,$data['type']??null,$data['period']??null,$data['description']??null,$data['sort_order']??0,$data['is_active']??1]);
        $id = (int)$this->db->lastInsertId();
        $this->saveRelated($id, $data);
        Response::json(true, 'Experience created', ['id'=>$id], 201);
    }

    // PUT /admin/experience/{id}
    public function adminUpdate(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $this->db->prepare('UPDATE experience SET role=?,company=?,location=?,type=?,period=?,description=?,sort_order=?,is_active=? WHERE id=?')
            ->execute([$data['role']??'',$data['company']??'',$data['location']??null,$data['type']??null,$data['period']??null,$data['description']??null,$data['sort_order']??0,$data['is_active']??1,$id]);
        $this->saveRelated($id, $data);
        Response::json(true, 'Experience updated');
    }

    // DELETE /admin/experience/{id}
    public function adminDelete(int $id): void {
        $this->db->prepare('DELETE FROM experience WHERE id=?')->execute([$id]);
        Response::json(true, 'Experience deleted');
    }

    private function saveRelated(int $expId, array $data): void {
        $this->db->prepare('DELETE FROM experience_achievements WHERE experience_id=?')->execute([$expId]);
        $this->db->prepare('DELETE FROM experience_skills WHERE experience_id=?')->execute([$expId]);
        $sa = $this->db->prepare('INSERT INTO experience_achievements (experience_id,achievement_text,sort_order) VALUES (?,?,?)');
        foreach ($data['achievements'] ?? [] as $i => $a) { $sa->execute([$expId,$a,$i]); }
        $ss = $this->db->prepare('INSERT INTO experience_skills (experience_id,skill_name,sort_order) VALUES (?,?,?)');
        foreach ($data['skills'] ?? [] as $i => $s) { $ss->execute([$expId,$s,$i]); }
    }
}
