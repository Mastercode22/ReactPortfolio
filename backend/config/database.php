<?php

class Database
{
  private string $host;
  private string $dbname;
  private string $username;
  private string $password;

  private $conn = null;

  public function __construct()
  {
    $server = $_SERVER['SERVER_NAME'] ?? 'localhost';
    $isLocal = in_array($server, ['localhost', '127.0.0.1']);

    if ($isLocal) {
      // ── Local XAMPP ───────────────────────────────────────────────
      $this->host     = 'localhost';
      $this->dbname   = 'portfolio_cms';
      $this->username = 'root';
      $this->password = '';
    } else {
      // ── InfinityFree Production ───────────────────────────────────
      $this->host     = 'sql211.infinityfree.com';
      $this->dbname   = 'if0_42621215_portfolio';
      $this->username = 'if0_42621215';
      $this->password = 'emmanuel22W22';
    }
  }

  public function getConnection(): PDO
  {
    if ($this->conn === null) {
      $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4";

      $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::ATTR_TIMEOUT            => 10,
      ];

      try {
        $this->conn = new PDO($dsn, $this->username, $this->password, $options);
      } catch (PDOException $e) {
        http_response_code(500);
        header("Content-Type: application/json");
        echo json_encode([
          "success" => false,
          "message" => "Database connection failed",
          "error"   => $e->getMessage(),
          "data"    => null,
        ]);
        exit();
      }
    }

    return $this->conn;
  }
}
