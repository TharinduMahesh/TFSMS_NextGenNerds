@echo off
echo TFSMS Flutter App - Diagnostic Tool
echo ===================================
echo.

echo 📊 System Information:
echo OS: %OS%
echo User: %USERNAME%
echo Current Directory: %CD%
echo.

echo 📁 Project Structure Check:
if exist "pubspec.yaml" (
    echo ✅ pubspec.yaml found
) else (
    echo ❌ pubspec.yaml not found - Not in Flutter project directory?
)

if exist "lib\main.dart" (
    echo ✅ lib\main.dart found
) else (
    echo ❌ lib\main.dart not found
)

if exist "lib\pages\collector\collector_dashboard_page.dart" (
    echo ✅ collector_dashboard_page.dart found
) else (
    echo ❌ collector_dashboard_page.dart not found
)

if exist "lib\models\harvest_request.dart" (
    echo ✅ harvest_request.dart model found
) else (
    echo ❌ harvest_request.dart model not found
)

if exist "lib\services\harvest_request_service.dart" (
    echo ✅ harvest_request_service.dart found
) else (
    echo ❌ harvest_request_service.dart not found
)

echo.
echo 🔧 Tool Availability Check:
where flutter >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Flutter is in PATH
    flutter --version | findstr /C:"Flutter"
) else (
    echo ❌ Flutter not found in PATH
)

where dart >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Dart is in PATH
) else (
    echo ❌ Dart not found in PATH
)

where git >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Git is available
) else (
    echo ❌ Git not found
)

echo.
echo 📦 Dependencies Check:
if exist "pubspec.lock" (
    echo ✅ pubspec.lock exists (dependencies were fetched before)
) else (
    echo ⚠️  pubspec.lock not found (need to run 'flutter pub get')
)

if exist ".packages" (
    echo ✅ .packages file exists
) else (
    echo ⚠️  .packages file not found
)

echo.
echo 📋 Summary:
echo This diagnostic helps identify setup issues.
echo If Flutter is not found, install it from: https://docs.flutter.dev/get-started/install
echo Then run setup_and_run.bat to build and run the application.
echo.
pause
