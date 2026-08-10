<?php
class ServicesController {
    private PDO $db;
    public function __construct(PDO $db) { $this->db = $db; }

    private function getFeatures(int $serviceId): array {
        return $this->db->prepare('SELECT feature_text FROM service_features WHERE service_id = ? ORDER BY sort_order ASC')
            ->execute([$serviceId]) ? $this->db->query("SELECT feature_text FROM service_features WHERE service_id = $serviceId ORDER BY sort_order ASC")->fetchAll(PDO::FETCH_COLUMN) : [];
    }

    private function withFeatures(array $services): array {
        foreach ($services as &$s) {
            $stmt = $this->db->prepare('SELECT feature_text FROM service_features WHERE service_id = ? ORDER BY sort_order ASC');
            $stmt->execute([$s['id']]);
            $s['features'] = $stmt->fetchAll(PDO::FETCH_COLUMN);
            // Map grid_size to 'size' for frontend compatibility
            $s['size'] = $s['grid_size'];
        }
        return $services;
    }

    // GET /services
    public function getPublic(): void {
        $services = $this->db->query('SELECT * FROM services WHERE is_published = 1 ORDER BY sort_order ASC')->fetchAll();
        Response::json(true, 'Services', $this->withFeatures($services));
    }

    // GET /admin/services
    public function adminGetAll(): void {
        $services = $this->db->query('SELECT * FROM services ORDER BY sort_order ASC')->fetchAll();
        Response::json(true, 'Services', $this->withFeatures($services));
    }

    // POST /admin/services
    public function adminCreate(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $this->db->prepare('INSERT INTO services (title,category,icon_name,grid_size,description,gradient_class,sort_order,is_published) VALUES (?,?,?,?,?,?,?,?)');
        $stmt->execute([$data['title']??'', $data['category']??null, $data['icon_name']??null, $data['grid_size']??'col-span-12 md:col-span-6', $data['description']??null, $data['gradient_class']??null, $data['sort_order']??0, $data['is_published']??1]);
        $id = (int)$this->db->lastInsertId();
        $this->saveFeatures($id, $data['features'] ?? []);
        Response::json(true, 'Service created', ['id' => $id], 201);
    }

    // PUT /admin/services/{id}
    public function adminUpdate(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $this->db->prepare('UPDATE services SET title=?,category=?,icon_name=?,grid_size=?,description=?,gradient_class=?,sort_order=?,is_published=? WHERE id=?')
            ->execute([$data['title']??'', $data['category']??null, $data['icon_name']??null, $data['grid_size']??'col-span-12 md:col-span-6', $data['description']??null, $data['gradient_class']??null, $data['sort_order']??0, $data['is_published']??1, $id]);
        $this->saveFeatures($id, $data['features'] ?? []);
        Response::json(true, 'Service updated');
    }

    // DELETE /admin/services/{id}
    public function adminDelete(int $id): void {
        $this->db->prepare('DELETE FROM services WHERE id = ?')->execute([$id]);
        Response::json(true, 'Service deleted');
    }

    // PUT /admin/services/{id}/toggle
    public function adminTogglePublish(int $id): void {
        $this->db->prepare('UPDATE services SET is_published = NOT is_published WHERE id = ?')->execute([$id]);
        Response::json(true, 'Service toggled');
    }

    private function saveFeatures(int $serviceId, array $features): void {
        $this->db->prepare('DELETE FROM service_features WHERE service_id = ?')->execute([$serviceId]);
        $stmt = $this->db->prepare('INSERT INTO service_features (service_id, feature_text, sort_order) VALUES (?,?,?)');
        foreach ($features as $i => $feat) {
            $stmt->execute([$serviceId, $feat, $i]);
        }
    }
}
