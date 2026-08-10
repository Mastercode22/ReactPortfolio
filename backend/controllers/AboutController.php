<?php
class AboutController {
    private PDO $db;
    public function __construct(PDO $db) { $this->db = $db; }

    // GET /about
    public function getPublic(): void {
        $about = $this->db->query('SELECT * FROM about_sections WHERE is_active = 1 ORDER BY id DESC LIMIT 1')->fetch();
        $stats = $this->db->query('SELECT * FROM about_stats WHERE is_active = 1 ORDER BY sort_order ASC')->fetchAll();
        Response::json(true, 'About section', ['about' => $about ?: (object)[], 'stats' => $stats]);
    }

    // GET /about/stats (public)
    public function getStatsPublic(): void {
        $stats = $this->db->query('SELECT * FROM about_stats WHERE is_active = 1 ORDER BY sort_order ASC')->fetchAll();
        Response::json(true, 'About stats', $stats);
    }

    // GET /admin/about
    public function adminGet(): void {
        $about = $this->db->query('SELECT * FROM about_sections ORDER BY id DESC LIMIT 1')->fetch();
        Response::json(true, 'About', $about ?: (object)[]);
    }

    // PUT /admin/about/{id}
    public function adminUpdate(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $fields = ['badge','heading','subheading','profile_image','name','job_title','location',
                   'availability_text','is_available','bio_paragraph_1','bio_paragraph_2',
                   'engineering_badge_1','engineering_badge_2','is_active'];
        $set = []; $vals = [];
        foreach ($fields as $f) {
            if (array_key_exists($f, $data)) { $set[] = "$f = ?"; $vals[] = $data[$f]; }
        }
        if (empty($set)) Response::json(false, 'No fields', null, 400);
        $vals[] = $id;
        $this->db->prepare('UPDATE about_sections SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($vals);
        Response::json(true, 'About updated');
    }

    // GET /admin/about/stats
    public function adminGetStats(): void {
        $stats = $this->db->query('SELECT * FROM about_stats ORDER BY sort_order ASC')->fetchAll();
        Response::json(true, 'Stats', $stats);
    }

    // POST /admin/about/stats
    public function adminCreateStat(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $this->db->prepare('INSERT INTO about_stats (label,value,icon_name,color_class,sort_order,is_active) VALUES (?,?,?,?,?,?)');
        $stmt->execute([$data['label']??'', $data['value']??'', $data['icon_name']??null, $data['color_class']??null, $data['sort_order']??0, $data['is_active']??1]);
        Response::json(true, 'Stat created', ['id' => $this->db->lastInsertId()], 201);
    }

    // PUT /admin/about/stats/{id}
    public function adminUpdateStat(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $this->db->prepare('UPDATE about_stats SET label=?,value=?,icon_name=?,color_class=?,sort_order=?,is_active=? WHERE id=?')
            ->execute([$data['label']??'', $data['value']??'', $data['icon_name']??null, $data['color_class']??null, $data['sort_order']??0, $data['is_active']??1, $id]);
        Response::json(true, 'Stat updated');
    }

    // DELETE /admin/about/stats/{id}
    public function adminDeleteStat(int $id): void {
        $this->db->prepare('DELETE FROM about_stats WHERE id = ?')->execute([$id]);
        Response::json(true, 'Stat deleted');
    }
}
