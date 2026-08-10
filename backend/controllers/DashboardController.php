<?php
class DashboardController {
    private PDO $db;
    public function __construct(PDO $db) { $this->db = $db; }

    // GET /admin/dashboard
    public function adminGetStats(): void {
        $totalProjects     = (int)$this->db->query('SELECT COUNT(*) FROM projects')->fetchColumn();
        $publishedProjects = (int)$this->db->query('SELECT COUNT(*) FROM projects WHERE is_published = 1')->fetchColumn();
        $totalServices     = (int)$this->db->query('SELECT COUNT(*) FROM services')->fetchColumn();
        $totalTech         = (int)$this->db->query('SELECT COUNT(*) FROM technologies')->fetchColumn();
        $totalTestimonials = (int)$this->db->query('SELECT COUNT(*) FROM testimonials')->fetchColumn();
        $cvDownloads       = (int)$this->db->query('SELECT COUNT(*) FROM cv_downloads')->fetchColumn();
        $mediaFiles        = (int)$this->db->query('SELECT COUNT(*) FROM media')->fetchColumn();
        $unreadMessages    = (int)$this->db->query('SELECT COUNT(*) FROM contact_messages WHERE status = "unread"')->fetchColumn();
        $totalMessages     = (int)$this->db->query('SELECT COUNT(*) FROM contact_messages')->fetchColumn();

        $recentMessages    = $this->db->query('SELECT id, name, email, subject, status, created_at FROM contact_messages ORDER BY id DESC LIMIT 5')->fetchAll();

        Response::json(true, 'Dashboard Stats', [
            'total_projects'     => $totalProjects,
            'published_projects' => $publishedProjects,
            'total_services'     => $totalServices,
            'total_technologies' => $totalTech,
            'total_testimonials' => $totalTestimonials,
            'cv_downloads'       => $cvDownloads,
            'media_files'        => $mediaFiles,
            'unread_messages'    => $unreadMessages,
            'total_messages'     => $totalMessages,
            'recent_messages'    => $recentMessages
        ]);
    }
}
