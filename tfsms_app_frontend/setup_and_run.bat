@echo off
echo TFSMS Flutter App - Setup and Run Script
echo ==========================================
echo.

echo Step 1: Checking Flutter installation...
flutter --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Flutter is not installed or not in PATH!
    echo.
    echo 📋 Installation Steps:
    echo 1. Download Flutter SDK from: https://docs.flutter.dev/get-started/install/windows
    echo 2. Extract to C:\flutter
    echo 3. Add C:\flutter\bin to your system PATH
    echo 4. Restart command prompt and run this script again
    echo.
    pause
    exit /b 1
)
echo ✅ Flutter is installed!

echo.
echo Step 2: Running Flutter Doctor...
flutter doctor
echo.

echo Step 3: Getting Flutter dependencies...
flutter pub get
if %errorlevel% neq 0 (
    echo ❌ Failed to get dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully!

echo.
echo Step 4: Analyzing code for errors...
flutter analyze
if %errorlevel% neq 0 (
    echo ⚠️  Code analysis found some issues, but continuing...
) else (
    echo ✅ No code errors found!
)

echo.
echo Step 5: Checking for available devices...
flutter devices

echo.
echo Step 6: Running the app...
echo Choose your target platform:
echo 1. Chrome (Web) - Recommended for development
echo 2. Windows Desktop
echo 3. Android Emulator/Device
echo 4. Just build (no run)
echo 5. Exit
set /p choice=Enter your choice (1-5): 

if "%choice%"=="1" (
    echo 🌐 Running on Chrome Web...
    flutter run -d chrome
) else if "%choice%"=="2" (
    echo 🖥️  Running on Windows Desktop...
    flutter run -d windows
) else if "%choice%"=="3" (
    echo 📱 Running on Android...
    flutter run
) else if "%choice%"=="4" (
    echo 🔨 Building app...
    flutter build web
    echo ✅ Web build completed! Check build/web/ folder
) else if "%choice%"=="5" (
    echo 👋 Goodbye!
    exit /b 0
) else (
    echo ❌ Invalid choice. Exiting...
    exit /b 1
)

pause
