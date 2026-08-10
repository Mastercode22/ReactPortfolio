<?php
class MediaController {
    private PDO $db;
    public function __construct(PDO $db) { $this->db = $db; }

    // GET /admin/media
    public function adminGetAll(): void {
        $media = $this->db->query('SELECT * FROM media ORDER BY id DESC')->fetchAll();
        Response::json(true, 'Media Library', $media);
    }

    // POST /admin/media
    public function adminUpload(): void {
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            Response::json(false, 'No image file uploaded or upload error', null, 400);
        }

        $file = $_FILES['file'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];

        if (!in_array($ext, $allowed)) {
            Response::json(false, 'Invalid image format. Allowed: jpg, jpeg, png, webp, gif, svg', null, 400);
        }

        if ($file['size'] > 5 * 1024 * 1024) { // 5MB limit
            Response::json(false, 'File size exceeds 5MB limit', null, 400);
        }

        if (!is_dir(MEDIA_STORAGE)) {
            mkdir(MEDIA_STORAGE, 0755, true);
        }

        $newFilename = 'media_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        $targetPath = MEDIA_STORAGE . $newFilename;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            Response::json(false, 'Failed to save media file', null, 500);
        }

        $publicUrl = PUBLIC_BASE . 'media/' . $newFilename;

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $targetPath);
        finfo_close($finfo);

        $width = null; $height = null;
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
            $sizes = @getimagesize($targetPath);
            if ($sizes) { $width = $sizes[0]; $height = $sizes[1]; }
        }

        $stmt = $this->db->prepare('INSERT INTO media (filename, original_filename, file_path, public_url, mime_type, file_size, width, height, alt_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$newFilename, $file['name'], $newFilename, $publicUrl, $mime, $file['size'], $width, $height, pathinfo($file['name'], PATHINFO_FILENAME)]);

        Response::json(true, 'Media uploaded successfully', [
            'id' => $this->db->lastInsertId(),
            'filename' => $newFilename,
            'public_url' => $publicUrl
        ], 201);
    }

    // DELETE /admin/media/{id}
    public function adminDelete(int $id): void {
        $stmt = $this->db->prepare('SELECT filename FROM media WHERE id = ?');
        $stmt->execute([$id]);
        $media = $stmt->fetch();
        if ($media) {
            $path = MEDIA_STORAGE . basename($media['filename']);
            if (file_exists($path)) @unlink($path);
        }
        $this->db->prepare('DELETE FROM media WHERE id = ?')->execute([$id]);
        Response::json(true, 'Media item deleted');
    }
}
