<?php

class EnvLoader {
    private static bool $loaded = false;

    public static function load(string $path = null): void {
        if (self::$loaded) {
            return;
        }

        if ($path === null) {
            $path = dirname(__DIR__) . '/.env';
        }

        if (file_exists($path) && is_readable($path)) {
            $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || str_starts_with($line, '#')) {
                    continue;
                }

                if (str_contains($line, '=')) {
                    list($key, $val) = explode('=', $line, 2);
                    $key = trim($key);
                    $val = trim($val);

                    // Strip optional quotes
                    if (
                        (str_starts_with($val, '"') && str_ends_with($val, '"')) ||
                        (str_starts_with($val, "'") && str_ends_with($val, "'"))
                    ) {
                        $val = substr($val, 1, -1);
                    }

                    if (!array_key_exists($key, $_ENV)) {
                        $_ENV[$key] = $val;
                    }
                    if (!array_key_exists($key, $_SERVER)) {
                        $_SERVER[$key] = $val;
                    }
                    putenv("{$key}={$val}");
                }
            }
        }

        self::$loaded = true;
    }

    public static function get(string $key, $default = null) {
        self::load();
        if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
            return $_ENV[$key];
        }
        if (isset($_SERVER[$key]) && $_SERVER[$key] !== '') {
            return $_SERVER[$key];
        }
        $val = getenv($key);
        if ($val !== false && $val !== '') {
            return $val;
        }
        return $default;
    }
}
