<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$target_dir = "/volume1/Aset/BAPHP/";

$action = isset($_GET['action']) ? $_GET['action'] : '';
$filename = isset($_GET['filename']) ? trim(urldecode($_GET['filename'])) : '';

if ($action === 'delete') {
    if (!empty($filename)) {
        $clean_filename = basename($filename);
        $file_path = $target_dir . $clean_filename;
        
        $deleted = false;

        // 1. Coba hapus nama persis
        if (file_exists($file_path)) {
            if (@unlink($file_path)) {
                $deleted = true;
            }
        }

        // 2. Pencocokan fleksibel (mengabaikan spasi dan huruf besar/kecil)
        if (!$deleted && is_dir($target_dir)) {
            $files = scandir($target_dir);
            $target_clean = strtolower(str_replace(' ', '', $clean_filename));

            foreach ($files as $f) {
                if ($f === '.' || $f === '..') continue;
                $f_clean = strtolower(str_replace(' ', '', $f));

                if ($f_clean === $target_clean || strpos($f_clean, $target_clean) !== false || strpos($target_clean, $f_clean) !== false) {
                    $full_path = $target_dir . $f;
                    if (file_exists($full_path) && @unlink($full_path)) {
                        $deleted = true;
                        break;
                    }
                }
            }
        }

        if ($deleted) {
            echo json_encode(["success" => true, "message" => "File berhasil dihapus."]);
        } else {
            echo json_encode([
                "success" => false, 
                "error" => "File tidak ditemukan.",
                "debug_info" => [
                    "dicari" => $clean_filename,
                    "folder_bisa_dibaca" => is_readable($target_dir) ? "Ya" : "Tidak",
                    "isi_folder_asli" => is_dir($target_dir) ? scandir($target_dir) : "Tidak bisa scan"
                ]
            ]);
        }
        exit;
    }
    echo json_encode(["success" => false, "error" => "Nama file kosong."]);
    exit;
}

if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

if (isset($_FILES['file'])) {
    $file = $_FILES['file'];
    $old_url = isset($_POST['old_url']) ? trim($_POST['old_url']) : (isset($_GET['old_url']) ? trim($_GET['old_url']) : '');

    if (!empty($old_url)) {
        $old_filename = basename(urldecode($old_url));
        $old_file_path = $target_dir . $old_filename;
        if (file_exists($old_file_path)) {
            @unlink($old_file_path);
        } else if (is_dir($target_dir)) {
            $files = scandir($target_dir);
            $old_clean = strtolower(str_replace(' ', '', $old_filename));
            foreach ($files as $f) {
                if ($f !== '.' && $f !== '..') {
                    $f_clean = strtolower(str_replace(' ', '', $f));
                    if ($f_clean === $old_clean || strpos($f_clean, $old_clean) !== false) {
                        @unlink($target_dir . $f);
                    }
                }
            }
        }
    }

    $file_name = basename($file['name']);
    $target_file = $target_dir . $file_name;

    if (file_exists($target_file)) {
        @unlink($target_file);
    }

    if (move_uploaded_file($file['tmp_name'], $target_file)) {
        chmod($target_file, 0644);

        $public_url = "http://10.40.9.2:8085/" . $file_name;
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