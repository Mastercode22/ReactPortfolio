<?php
class TestimonialsController {
    private PDO $db;
    public function __construct(PDO $db) { $this->db = $db; }

    // GET /testimonials
    public function getPublic(): void {
        $items = $this->db->query('SELECT * FROM testimonials WHERE is_published=1 ORDER BY sort_order ASC, id DESC')->fetchAll();
        Response::json(true, 'Testimonials', $items);
    }

    // GET /admin/testimonials
    public function adminGetAll(): void {
        $items = $this->db->query('SELECT * FROM testimonials ORDER BY sort_order ASC, id DESC')->fetchAll();
        Response::json(true, 'Testimonials', $items);
    }

    // POST /admin/testimonials
    public function adminCreate(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $this->db->prepare('INSERT INTO testimonials (name,role,company,avatar,quote,stars,sort_order,is_published) VALUES (?,?,?,?,?,?,?,?)');
        $stmt->execute([
            $data['name']??'', $data['role']??null, $data['company']??null, 
            $data['avatar']??null, $data['quote']??'', $data['stars']??5, 
            $data['sort_order']??0, $data['is_published']??1
        ]);
        Response::json(true, 'Testimonial created', ['id' => $this->db->lastInsertId()], 201);
    }

    // PUT /admin/testimonials/{id}
    public function adminUpdate(int $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $this->db->prepare('UPDATE testimonials SET name=?,role=?,company=?,avatar=?,quote=?,stars=?,sort_order=?,is_published=? WHERE id=?')
            ->execute([
                $data['name']??'', $data['role']??null, $data['company']??null, 
                $data['avatar']??null, $data['quote']??'', $data['stars']??5, 
                $data['sort_order']??0, $data['is_published']??1, $id
            ]);
        Response::json(true, 'Testimonial updated');
    }

    // DELETE /admin/testimonials/{id}
    public function adminDelete(int $id): void {
        $this->db->prepare('DELETE FROM testimonials WHERE id=?')->execute([$id]);
        Response::json(true, 'Testimonial deleted');
    }
}
