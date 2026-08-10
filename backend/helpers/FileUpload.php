<?php
class FileUpload {
    public static function upload($file, $destination, $allowed_extensions, $allowed_mimes, $max_size) {
        if ($file['error'] !== UPLOAD_ERR_OK) return ['success' => false, 'message' => 'Upload error'];
        if ($file['size'] > $max_size) return ['success' => false, 'message' => 'File too large'];
        
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($mime, $allowed_mimes)) return ['success' => false, 'message' => 'Invalid file type'];
        
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed_extensions)) return ['success' => false, 'message' => 'Invalid file extension'];
        
        $filename = uniqid('file_') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        $target = $destination . '/' . $filename;
        
        if (move_uploaded_file($file['tmp_name'], $target)) {
            return ['success' => true, 'filename' => $filename, 'original_filename' => $file['name'], 'mime' => $mime, 'size' => $file['size']];
        }
        return ['success' => false, 'message' => 'Failed to move file'];
    }
}
