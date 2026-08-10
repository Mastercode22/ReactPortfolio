<?php
class SettingsController {
    private PDO $db;
    public function __construct(PDO $db) { $this->db = $db; }

    // GET /settings
    public function getPublic(): void {
        $rows = $this->db->query('SELECT setting_key, setting_value FROM site_settings')->fetchAll();
        $settings = [];
        foreach ($rows as $r) {
            $settings[$r['setting_key']] = $r['setting_value'];
        }
        Response::json(true, 'Site Settings', $settings);
    }

    // GET /navbar
    public function getNavbar(): void {
        $items = $this->db->query('SELECT label, path, is_external FROM navigation_items WHERE is_active = 1 ORDER BY sort_order ASC')->fetchAll();
        // If empty, return standard fallback navigation array
        if (empty($items)) {
            $items = [
                ['label' => 'Home', 'path' => '/'],
                ['label' => 'About', 'path' => '/about'],
                ['label' => 'Services', 'path' => '/services'],
                ['label' => 'Projects', 'path' => '/projects'],
                ['label' => 'Experience', 'path' => '/experience'],
                ['label' => 'Certifications', 'path' => '/certifications'],
                ['label' => 'Testimonials', 'path' => '/testimonials'],
                ['label' => 'Contact', 'path' => '/contact'],
                ['label' => 'Resume', 'path' => '/resume'],
            ];
        } else {
            foreach ($items as &$it) {
                $it['name'] = $it['label']; // for compatibility with Navbar.jsx
            }
        }
        Response::json(true, 'Navbar items', $items);
    }

    // GET /admin/settings
    public function adminGet(): void {
        $rows = $this->db->query('SELECT setting_key, setting_value FROM site_settings')->fetchAll();
        $settings = [];
        foreach ($rows as $r) {
            $settings[$r['setting_key']] = $r['setting_value'];
        }
        Response::json(true, 'Site Settings', $settings);
    }

    // POST /admin/settings
    public function adminSave(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!is_array($data)) {
            Response::json(false, 'Invalid payload', null, 400);
        }

        $stmt = $this->db->prepare('INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)');
        foreach ($data as $key => $val) {
            $stmt->execute([$key, is_array($val) ? json_encode($val) : (string)$val]);
        }

        Response::json(true, 'Settings updated successfully');
    }
}
