# Flutter Project Setup and Run Script
Write-Host "Installing Flutter dependencies and running the app..." -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Checking Flutter installation..." -ForegroundColor Yellow
try {
    $flutterVersion = flutter --version
    Write-Host "Flutter is installed!" -ForegroundColor Green
} catch {
    Write-Host "Flutter is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Flutter from: https://flutter.dev/docs/get-started/install" -ForegroundColor Red
    Write-Host "After installation, add Flutter to your system PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Getting Flutter dependencies..." -ForegroundColor Yellow
try {
    flutter pub get
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Failed to get dependencies!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 3: Checking for connected devices..." -ForegroundColor Yellow
flutter devices

Write-Host ""
Write-Host "Step 4: Running the app..." -ForegroundColor Yellow
Write-Host "Choose your target:" -ForegroundColor Cyan
Write-Host "1. Run on Chrome (Web)" -ForegroundColor White
Write-Host "2. Run on Windows Desktop" -ForegroundColor White
Write-Host "3. Run on Android Emulator" -ForegroundColor White
Write-Host "4. Just analyze code for errors" -ForegroundColor White
$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "Running on Chrome..." -ForegroundColor Green
        flutter run -d chrome
    }
    "2" {
        Write-Host "Running on Windows..." -ForegroundColor Green
        flutter run -d windows
    }
    "3" {
        Write-Host "Running on Android..." -ForegroundColor Green
        flutter run
    }
    "4" {
        Write-Host "Analyzing code..." -ForegroundColor Green
        flutter analyze
    }
    default {
        Write-Host "Invalid choice. Running default analysis..." -ForegroundColor Yellow
        flutter analyze
    }
}

Read-Host "Press Enter to exit"
