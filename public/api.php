<?php
// api.php - Upload, Hapus, dan Penamaan Kustom File Fisik Synology
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$target_dir = "/volume1/Aset/BAPHP/";

// Tangani permintaan Hapus File
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' || (isset($_GET['action']) && $_GET['action'] === 'delete')) {
    $file_path = isset($_GET['path']) ? $_GET['path'] : '';
    
    if ($file_path && file_exists($file_path) && strpos($file_path, $target_dir) === 0) {
        unlink($file_path);
        echo json_encode(["success" => true, "message" => "File lama berhasil dihapus."]);
        exit;
    }
    echo json_encode(["success" => false, "error" => "File tidak ditemukan."]);
    exit;
}

// Tangani Upload File
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

if (isset($_FILES['file'])) {
    $original_name = $_FILES['file']['name'];
    $extension = pathinfo($original_name, PATHINFO_EXTENSION);
    
    // Ambil nama kustom dari request jika ada, lalu bersihkan karakter yang tidak valid
    $custom_name = isset($_POST['custom_name']) ? trim($_POST['custom_name']) : '';
    
    if (!empty($custom_name)) {
        // Format: BA_nama_pekerjaan.ext (spasi diganti underscore agar aman)
        $clean_name = preg_replace('/[^a-zA-Z0-9-_]/', '_', $custom_name);
        $file_name = "BA_" . $clean_name . "." . $extension;
    } else {
        // Fallback jika nama kosong
        $file_name = time() . "_" . basename($original_name);
    }

    $target_file = $target_dir . $file_name;

    // Jika file dengan nama yang sama sudah ada, hapus dulu agar benar-benar menimpa (overwrite)
    if (file_exists($target_file)) {
        unlink($target_file);
    }

    if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
        $public_url = "http://10.40.9.2:8085/Aset/BAPHP/" . $file_name;
        echo json_encode([
            "success" => true,
            "data" => [
                "path" => $target_file,
                "url" => $public_url
            ]
        ]);
        exit;
    }
}

echo json_encode(["success" => false, "error" => "Gagal mengunggah file."]);
?>