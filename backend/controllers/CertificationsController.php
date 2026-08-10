<?php
class CertificationsController {
    private PDO $db;
    public function __construct(PDO $db) { $this->db = $db; }

    // GET /certifications
    public function getPublic(): void {
        $certs = $this->db->query('SELECT * FROM certifications WHERE is_active=1 ORDER BY sort_order ASC, id DESC')->fetchAll();
        Response::json(true, 'Certifications', $certs);
    }

    // GET /admin/certifications
    public function adminGetAll(): void {
        $certs = $this->db->query('SELECT * FROM certifications ORDER BY sort_order ASC, id DESC')->fetchAll();
        Response::json(true, 'Certifications', $certs);
    }

    // POST /admin/certifications
    public function adminCreate(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $this->db->prepare('INSERT INTO certifications (title,issuer,issue_date,credential_id,icon_name,verification_url,description,sort_order,is_active) VALUES (?,?,?,?,?,?,?,?,?)');
        $stmt->execute([
            $data['title']??'', $data['issuer']??null, $data['issue_date']??$data['date']??null, 
            $data['credential_id']??$data['credentialId']??null, $data['icon_name']??$data['iconName']??null, 
            $data['verification_url']??$data['verificationUrl']??null, $data['description']??null, 
            $data['sort_order']??0, $data['is_active']??1
        ]);
        Response::json(true, 'Certification created', ['id' => $this->db->lastInsertId()], 201);
    }

    // PUT /admin/certifications/{id}
    public function adminUpdate(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $this->db->prepare('UPDATE certifications SET title=?,issuer=?,issue_date=?,credential_id=?,icon_name=?,verification_url=?,description=?,sort_order=?,is_active=? WHERE id=?')
            ->execute([
                $data['title']??'', $data['issuer']??null, $data['issue_date']??$data['date']??null, 
                $data['credential_id']??$data['credentialId']??null, $data['icon_name']??$data['iconName']??null, 
                $data['verification_url']??$data['verificationUrl']??null, $data['description']??null, 
                $data['sort_order']??0, $data['is_active']??1, $id
            ]);
        Response::json(true, 'Certification updated');
    }

    // DELETE /admin/certifications/{id}
    public function adminDelete(int $id): void {
        $this->db->prepare('DELETE FROM certifications WHERE id=?')->execute([$id]);
        Response::json(true, 'Certification deleted');
    }
}
