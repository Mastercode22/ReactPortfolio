<?php
class ProjectsController {
    private PDO $db;
    public function __construct(PDO $db) { $this->db = $db; }

    private function hydrate(array $projects): array {
        foreach ($projects as &$p) {
            $id = $p['id'];
            $p['features']         = $this->col('SELECT feature_text FROM project_features WHERE project_id=? ORDER BY sort_order', $id);
            $p['technologies']     = $this->col('SELECT tech_name FROM project_technologies WHERE project_id=? ORDER BY sort_order', $id);
            $p['images']           = $this->col('SELECT image_path FROM project_images WHERE project_id=? ORDER BY sort_order', $id);
            $p['performanceStats'] = $this->rows('SELECT label,value FROM project_performance_stats WHERE project_id=? ORDER BY sort_order', $id);
        }
        return $projects;
    }

    private function col(string $sql, int $id): array {
        $s = $this->db->prepare($sql); $s->execute([$id]);
        return $s->fetchAll(PDO::FETCH_COLUMN);
    }

    private function rows(string $sql, int $id): array {
        $s = $this->db->prepare($sql); $s->execute([$id]);
        return $s->fetchAll();
    }

    // GET /projects  (public)
    public function getPublic(): void {
        $where = 'WHERE is_published = 1';
        $params = [];
        if (!empty($_GET['featured'])) { $where .= ' AND is_featured = 1'; }
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
        $projects = $this->db->query("SELECT * FROM projects $where ORDER BY sort_order ASC, id DESC LIMIT $limit")->fetchAll();
        Response::json(true, 'Projects', $this->hydrate($projects));
    }

    // GET /projects/{slug}  (public)
    public function getBySlug(string $slug): void {
        $stmt = $this->db->prepare('SELECT * FROM projects WHERE slug = ? AND is_published = 1 LIMIT 1');
        $stmt->execute([$slug]);
        $project = $stmt->fetch();
        if (!$project) Response::json(false, 'Project not found', null, 404);
        Response::json(true, 'Project', $this->hydrate([$project])[0]);
    }

    // GET /admin/projects
    public function adminGetAll(): void {
        $projects = $this->db->query('SELECT * FROM projects ORDER BY sort_order ASC, id DESC')->fetchAll();
        Response::json(true, 'Projects', $this->hydrate($projects));
    }

    // GET /admin/projects/{id}
    public function adminGetOne(int $id): void {
        $stmt = $this->db->prepare('SELECT * FROM projects WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $p = $stmt->fetch();
        if (!$p) Response::json(false, 'Not found', null, 404);
        Response::json(true, 'Project', $this->hydrate([$p])[0]);
    }

    // POST /admin/projects
    public function adminCreate(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $slug = $this->uniqueSlug($data['slug'] ?? $data['title'] ?? 'project');
        $stmt = $this->db->prepare('INSERT INTO projects (slug,title,subtitle,category,description,challenges,solutions,architecture,image,live_demo,github_url,is_featured,is_published,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->execute([$slug,$data['title']??'',$data['subtitle']??null,$data['category']??null,$data['description']??null,$data['challenges']??null,$data['solutions']??null,$data['architecture']??null,$data['image']??null,$data['live_demo']??null,$data['github_url']??null,$data['is_featured']??0,$data['is_published']??1,$data['sort_order']??0]);
        $id = (int)$this->db->lastInsertId();
        $this->saveRelated($id, $data);
        Response::json(true, 'Project created', ['id' => $id, 'slug' => $slug], 201);
    }

    // PUT /admin/projects/{id}
    public function adminUpdate(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $this->db->prepare('UPDATE projects SET title=?,subtitle=?,category=?,description=?,challenges=?,solutions=?,architecture=?,image=?,live_demo=?,github_url=?,is_featured=?,is_published=?,sort_order=? WHERE id=?')
            ->execute([$data['title']??'',$data['subtitle']??null,$data['category']??null,$data['description']??null,$data['challenges']??null,$data['solutions']??null,$data['architecture']??null,$data['image']??null,$data['live_demo']??null,$data['github_url']??null,$data['is_featured']??0,$data['is_published']??1,$data['sort_order']??0,$id]);
        $this->saveRelated($id, $data);
        Response::json(true, 'Project updated');
    }

    // DELETE /admin/projects/{id}
    public function adminDelete(int $id): void {
        $this->db->prepare('DELETE FROM projects WHERE id = ?')->execute([$id]);
        Response::json(true, 'Project deleted');
    }

    // PUT /admin/projects/{id}/toggle
    public function adminToggle(int $id): void {
        $this->db->prepare('UPDATE projects SET is_published = NOT is_published WHERE id = ?')->execute([$id]);
        Response::json(true, 'Toggled');
    }

    private function saveRelated(int $pid, array $data): void {
        foreach (['project_features','project_technologies','project_images','project_performance_stats'] as $tbl) {
            $this->db->prepare("DELETE FROM $tbl WHERE project_id = ?")->execute([$pid]);
        }
        $sf = $this->db->prepare('INSERT INTO project_features (project_id,feature_text,sort_order) VALUES (?,?,?)');
        foreach ($data['features'] ?? [] as $i => $f) { $sf->execute([$pid,$f,$i]); }
        $st = $this->db->prepare('INSERT INTO project_technologies (project_id,tech_name,sort_order) VALUES (?,?,?)');
        foreach ($data['technologies'] ?? [] as $i => $t) { $st->execute([$pid,$t,$i]); }
        $si = $this->db->prepare('INSERT INTO project_images (project_id,image_path,sort_order) VALUES (?,?,?)');
        foreach ($data['images'] ?? [] as $i => $img) { $si->execute([$pid,$img,$i]); }
        $sp = $this->db->prepare('INSERT INTO project_performance_stats (project_id,label,value,sort_order) VALUES (?,?,?,?)');
        foreach ($data['performanceStats'] ?? [] as $i => $ps) { $sp->execute([$pid,$ps['label']??'',$ps['value']??'',$i]); }
    }

    private function uniqueSlug(string $title): string {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
        $base = $slug; $n = 1;
        while (true) {
            $s = $this->db->prepare('SELECT id FROM projects WHERE slug = ?'); $s->execute([$slug]);
            if (!$s->fetch()) break;
            $slug = $base . '-' . $n++;
        }
        return $slug;
    }
}
