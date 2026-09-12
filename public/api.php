<?php
// api.php - Upload langsung dengan penanganan error folder
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Pastikan jalur folder ini sesuai dengan struktur Shared Folder Anda di Synology
$target_dir = "/volume1/Aset/BAPHP/";

// Cek apakah folder ada dan bisa ditulis
if (!file_exists($target_dir)) {
    if (!mkdir($target_dir, 0777, true)) {
        echo json_encode(["success" => false, "error" => "Gagal membuat folder target. Periksa izin akses."]);
        exit;
    }
}

if (!is_writable($target_dir)) {
    echo json_encode(["success" => false, "error" => "Folder target tidak memiliki izin tulis (Permission Denied)."]);
    exit;
}

if (isset($_FILES['file'])) {
    $file_name = basename($_FILES['file']['name']);
    $target_file = $target_dir . time() . "_" . $file_name;

    if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
        $public_url = "http://10.40.9.2:8085/Aset/BAPHP/" . basename($target_file);
        echo json_encode([
            "success" => true,
            "data" => [
                "path" => $target_file,
                "url" => $public_url
            ]
        ]);
        exit;
    } else {
        echo json_encode(["success" => false, "error" => "Gagal memindahkan file yang di-upload ke direktori tujuan."]);
        exit;
    }
}

echo json_encode(["success" => false, "error" => "Tidak ada file yang diterima oleh server."]);
?>