<?php
class HeroController {
    private PDO $db;
    public function __construct(PDO $db) { $this->db = $db; }

    // GET /hero
    public function getPublic(): void {
        $stmt = $this->db->query('SELECT * FROM hero_sections WHERE is_active = 1 ORDER BY id DESC LIMIT 1');
        $hero = $stmt->fetch();
        Response::json(true, 'Hero section', $hero ?: (object)[]);
    }

    // GET /admin/hero
    public function adminGet(): void {
        $stmt = $this->db->query('SELECT * FROM hero_sections ORDER BY id DESC LIMIT 1');
        $hero = $stmt->fetch();
        Response::json(true, 'Hero', $hero ?: (object)[]);
    }

    // PUT /admin/hero/{id}
    public function adminUpdate(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $fields = ['badge_text','headline_1','headline_2','headline_3','headline_4','bio',
                   'availability_text','is_available','cta_primary_text','cta_primary_url',
                   'cta_secondary_text','cta_secondary_url','stat_1_label','stat_1_value',
                   'stat_2_label','stat_2_value','is_active'];
        $set = []; $vals = [];
        foreach ($fields as $f) {
            if (array_key_exists($f, $data)) { $set[] = "$f = ?"; $vals[] = $data[$f]; }
        }
        if (empty($set)) Response::json(false, 'No fields to update', null, 400);
        $vals[] = $id;
        $this->db->prepare('UPDATE hero_sections SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($vals);
        Response::json(true, 'Hero updated');
    }
}
