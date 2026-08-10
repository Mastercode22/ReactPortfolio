<?php
class CvController {
    private PDO $db;
    public function __construct(PDO $db) { $this->db = $db; }

    // GET /cv/info
    public function getInfo(): void {
        $cv = $this->db->query('SELECT id, filename, original_filename, file_size, version, updated_at FROM cv_files WHERE is_active = 1 ORDER BY id DESC LIMIT 1')->fetch();
        if (!$cv) {
            Response::json(false, 'No active CV available', null, 404);
        }
        Response::json(true, 'Active CV Info', $cv);
    }

    // GET /cv/download
    public function download(): void {
        $cv = $this->db->query('SELECT * FROM cv_files WHERE is_active = 1 ORDER BY id DESC LIMIT 1')->fetch();
        if (!$cv) {
            http_response_code(404);
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'CV file not found']);
            exit;
        }

        $filePath = CV_STORAGE . basename($cv['filename']);
        if (!file_exists($filePath)) {
            http_response_code(404);
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'CV file missing on server']);
            exit;
        }

        // Track download
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $this->db->prepare('INSERT INTO cv_downloads (cv_id, user_agent, ip_address) VALUES (?, ?, ?)')->execute([$cv['id'], $ua, $ip]);

        // Serve file stream
        header('Content-Description: File Transfer');
        header('Content-Type: ' . ($cv['mime_type'] ?: 'application/pdf'));
        header('Content-Disposition: attachment; filename="' . ($cv['original_filename'] ?: 'CV.pdf') . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
        exit;
    }

    // GET /admin/cv
    public function adminGetList(): void {
        $files = $this->db->query('SELECT * FROM cv_files ORDER BY id DESC')->fetchAll();
        Response::json(true, 'CV List', $files);
    }

    // POST /admin/cv/upload
    public function adminUpload(): void {
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            Response::json(false, 'No file uploaded or upload error', null, 400);
        }

        $file = $_FILES['file'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['pdf', 'doc', 'docx'];

        if (!in_array($ext, $allowed)) {
            Response::json(false, 'Invalid file extension. Allowed: pdf, doc, docx', null, 400);
        }

        if ($file['size'] > 10 * 1024 * 1024) { // 10MB
            Response::json(false, 'File size exceeds 10MB limit', null, 400);
        }

        if (!is_dir(CV_STORAGE)) {
            mkdir(CV_STORAGE, 0755, true);
        }

        $newFilename = 'cv_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        $targetPath = CV_STORAGE . $newFilename;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            Response::json(false, 'Failed to save uploaded file', null, 500);
        }

        // Deactivate existing CVs
        $this->db->query('UPDATE cv_files SET is_active = 0');

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $targetPath);
        finfo_close($finfo);

        $stmt = $this->db->prepare('INSERT INTO cv_files (filename, original_filename, file_path, mime_type, file_size, is_active) VALUES (?, ?, ?, ?, ?, 1)');
        $stmt->execute([$newFilename, $file['name'], $newFilename, $mime, $file['size']]);

        Response::json(true, 'CV uploaded successfully', ['id' => $this->db->lastInsertId(), 'filename' => $newFilename], 201);
    }

    // PUT /admin/cv/{id}/activate
    public function adminActivate(int $id): void {
        $this->db->query('UPDATE cv_files SET is_active = 0');
        $this->db->prepare('UPDATE cv_files SET is_active = 1 WHERE id = ?')->execute([$id]);
        Response::json(true, 'CV activated');
    }

    // DELETE /admin/cv/{id}
    public function adminDelete(int $id): void {
        $cv = $this->db->prepare('SELECT filename FROM cv_files WHERE id = ?');
        $cv->execute([$id]);
        $file = $cv->fetch();
        if ($file) {
            $path = CV_STORAGE . basename($file['filename']);
            if (file_exists($path)) @unlink($path);
        }
        $this->db->prepare('DELETE FROM cv_files WHERE id = ?')->execute([$id]);
        Response::json(true, 'CV deleted');
    }

    // GET /admin/cv/downloads
    public function adminGetDownloads(): void {
        $today = $this->db->query('SELECT COUNT(*) FROM cv_downloads WHERE DATE(downloaded_at) = CURDATE()')->fetchColumn();
        $thisWeek = $this->db->query('SELECT COUNT(*) FROM cv_downloads WHERE YEARWEEK(downloaded_at, 1) = YEARWEEK(CURDATE(), 1)')->fetchColumn();
        $thisMonth = $this->db->query('SELECT COUNT(*) FROM cv_downloads WHERE MONTH(downloaded_at) = MONTH(CURDATE()) AND YEAR(downloaded_at) = YEAR(CURDATE())')->fetchColumn();
        $total = $this->db->query('SELECT COUNT(*) FROM cv_downloads')->fetchColumn();

        Response::json(true, 'CV Analytics', [
            'today' => (int)$today,
            'this_week' => (int)$thisWeek,
            'this_month' => (int)$thisMonth,
            'total' => (int)$total,
        ]);
    }
}
