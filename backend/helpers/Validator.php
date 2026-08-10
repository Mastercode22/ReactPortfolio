<?php
class Validator {
    public static function sanitize($input) { return htmlspecialchars(strip_tags(trim($input))); }
}
