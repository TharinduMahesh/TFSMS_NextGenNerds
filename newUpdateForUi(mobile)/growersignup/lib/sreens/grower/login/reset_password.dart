import 'package:flutter/material.dart';
import 'package:growersignup/services/grower/grower_signup_api.dart';
import 'package:growersignup/sreens/grower/login/grower_signin_page.dart';

class ResetPasswordPage extends StatefulWidget {
  const ResetPasswordPage({super.key});

  @override
  State<ResetPasswordPage> createState() => _ResetPasswordPageState();
}

class _ResetPasswordPageState extends State<ResetPasswordPage> with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _tokenController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _authService = AuthService();

  // State variables
  bool _isLoading = false;
  String _statusMessage = '';
  bool _isError = false;
  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;
  bool _resetCompleted = false;

  // Animation controllers (matching ForgotPasswordPage)
  late AnimationController _animationController;
  late AnimationController _cardAnimationController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _slideAnimation;
  late Animation<double> _cardAnimation;

  // Enhanced Color Palette for Tea Project (matching ForgotPasswordPage)
  static const Color primaryGreen = Color(0xFF0a4e41);
  static const Color lightGreen = Color(0xFFF0FBEF);
  static const Color cardBackground = Colors.white;
  static const Color accentGreen = Color(0xFFB2E7AE);
  static const Color darkGreen = Color(0xFF064037);
  static const Color textDark = Color(0xFF1A1A1A);
  static const Color textLight = Color(0xFF666666);
  static const Color successGreen = Color(0xFF4CAF50);
  static const Color errorRed = Color(0xFFE57373);

  @override
  void initState() {
    super.initState();
    _setupAnimations();
  }

  void _setupAnimations() {
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _cardAnimationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );

    _slideAnimation = Tween<double>(begin: 50.0, end: 0.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOutCubic),
    );

    _cardAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _cardAnimationController, curve: Curves.elasticOut),
    );

    _animationController.forward();
    _cardAnimationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _cardAnimationController.dispose();
    _tokenController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleResetPassword() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _statusMessage = '';
    });

    try {
      final resetData = ResetPasswordData(
        token: _tokenController.text.trim(),
        password: _passwordController.text.trim(),
        confirmPassword: _confirmPasswordController.text.trim(),
      );

      final response = await _authService.resetPassword(resetData);

      setState(() {
        _isLoading = false;
        _statusMessage = response;
        _isError = !response.toLowerCase().contains("successful");
        if (!_isError) {
          _resetCompleted = true;
        }
      });

      if (!_isError) {
        // Navigate back to login after a delay
        await Future.delayed(const Duration(seconds: 3));
        if (mounted) {
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (context) => const GrowerSignInPage()),
            (Route<dynamic> route) => false,
          );
        }
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _statusMessage = 'Failed to reset password. Please try again.';
        _isError = true;
      });
    }
  }

  void _navigateToSignIn() {
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => const GrowerSignInPage()),
      (Route<dynamic> route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: lightGreen,
      body: Stack(
        children: [
          // Background with tea leaf pattern
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  lightGreen,
                  lightGreen.withOpacity(0.8),
                ],
              ),
            ),
          ),
          
          // Decorative circles
          _buildDecorativeElements(),
          
          // Main content
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 40.0),
                child: AnimatedBuilder(
                  animation: _fadeAnimation,
                  builder: (context, child) {
                    return Transform.translate(
                      offset: Offset(0, _slideAnimation.value),
                      child: Opacity(
                        opacity: _fadeAnimation.value,
                        child: _buildMainCard(),
                      ),
                    );
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDecorativeElements() {
    return Stack(
      children: [
        Positioned(
          top: -50,
          right: -50,
          child: Container(
            width: 150,
            height: 150,
            decoration: BoxDecoration(
              color: accentGreen.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
          ),
        ),
        Positioned(
          bottom: -30,
          left: -30,
          child: Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              color: primaryGreen.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMainCard() {
    return ScaleTransition(
      scale: _cardAnimation,
      child: Container(
        constraints: const BoxConstraints(maxWidth: 400),
        padding: const EdgeInsets.all(30.0),
        decoration: BoxDecoration(
          color: cardBackground,
          borderRadius: BorderRadius.circular(25.0),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              spreadRadius: 0,
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildHeader(),
              const SizedBox(height: 30),
              
              if (!_resetCompleted)
                _buildResetPasswordForm()
              else
                _buildSuccessUI(),
              
              if (_statusMessage.isNotEmpty) ...[
                const SizedBox(height: 25),
                _buildStatusMessage(),
              ],
              
              const SizedBox(height: 20),
              _buildBackToSignInButton(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [_resetCompleted ? successGreen : primaryGreen, _resetCompleted ? successGreen : darkGreen],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Icon(
            _resetCompleted ? Icons.check_circle : Icons.lock_reset,
            size: 40,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 20),
        Text(
          _resetCompleted ? 'Password Reset!' : 'New Password',
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: textDark,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          _resetCompleted 
            ? 'Your password has been successfully reset'
            : 'Enter token and create your new password',
          style: TextStyle(
            fontSize: 16,
            color: textLight,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildResetPasswordForm() {
    return Column(
      children: [
        // Information Card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.blue.withOpacity(0.1),
            borderRadius: BorderRadius.circular(15),
            border: Border.all(color: Colors.blue.withOpacity(0.3)),
          ),
          child: Row(
            children: [
              Icon(Icons.info_outline, color: Colors.blue, size: 24),
              const SizedBox(width: 15),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Reset Instructions',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: textDark,
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      'Enter the token from your email and create a new secure password.',
                      style: TextStyle(
                        color: textLight,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 25),
        
        // Token Input Field
        _buildTextField(
          controller: _tokenController,
          labelText: 'Password Reset Token',
          prefixIcon: Icons.vpn_key,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter the reset token';
            }
            return null;
          },
        ),
        
        const SizedBox(height: 20),
        
        // New Password Input Field
        _buildTextField(
          controller: _passwordController,
          labelText: 'New Password',
          prefixIcon: Icons.lock_outline,
          obscureText: !_isPasswordVisible,
          suffixIcon: IconButton(
            icon: Icon(
              _isPasswordVisible ? Icons.visibility_off : Icons.visibility,
              color: textLight,
            ),
            onPressed: () => setState(() => _isPasswordVisible = !_isPasswordVisible),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter a new password';
            }
            if (value.length < 6) {
              return 'Password must be at least 6 characters';
            }
            return null;
          },
        ),
        
        const SizedBox(height: 20),
        
        // Confirm Password Input Field
        _buildTextField(
          controller: _confirmPasswordController,
          labelText: 'Confirm New Password',
          prefixIcon: Icons.lock_outline,
          obscureText: !_isConfirmPasswordVisible,
          suffixIcon: IconButton(
            icon: Icon(
              _isConfirmPasswordVisible ? Icons.visibility_off : Icons.visibility,
              color: textLight,
            ),
            onPressed: () => setState(() => _isConfirmPasswordVisible = !_isConfirmPasswordVisible),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please confirm your password';
            }
            if (value != _passwordController.text) {
              return 'Passwords do not match';
            }
            return null;
          },
        ),
        
        const SizedBox(height: 30),
        
        // Reset Password Button
        _buildActionButton(
          onPressed: _isLoading ? null : _handleResetPassword,
          text: 'Reset Password',
          isLoading: _isLoading,
          backgroundColor: primaryGreen,
        ),
      ],
    );
  }

  Widget _buildSuccessUI() {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: successGreen.withOpacity(0.1),
            borderRadius: BorderRadius.circular(15),
            border: Border.all(color: successGreen.withOpacity(0.3)),
          ),
          child: Row(
            children: [
              Icon(Icons.check_circle_outline, color: successGreen, size: 24),
              const SizedBox(width: 15),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Password Reset Successful',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: textDark,
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      'Your password has been updated successfully.',
                      style: TextStyle(
                        color: textLight,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      'You can now sign in with your new password.',
                      style: TextStyle(
                        color: textLight,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 30),
        _buildActionButton(
          onPressed: _navigateToSignIn,
          text: 'Continue to Sign In',
          isLoading: false,
          backgroundColor: successGreen,
        ),
      ],
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String labelText,
    required IconData prefixIcon,
    TextInputType keyboardType = TextInputType.text,
    bool obscureText = false,
    Widget? suffixIcon,
    String? Function(String?)? validator,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: TextFormField(
        controller: controller,
        keyboardType: keyboardType,
        obscureText: obscureText,
        validator: validator,
        style: const TextStyle(color: textDark),
        decoration: InputDecoration(
          labelText: labelText,
          labelStyle: TextStyle(color: textLight),
          prefixIcon: Icon(prefixIcon, color: primaryGreen),
          suffixIcon: suffixIcon,
          filled: true,
          fillColor: Colors.grey[50],
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(15),
            borderSide: BorderSide(color: Colors.grey.withOpacity(0.3)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(15),
            borderSide: BorderSide(color: Colors.grey.withOpacity(0.3)),
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: const BorderSide(color: primaryGreen, width: 2.0),
            borderRadius: BorderRadius.circular(15),
          ),
          errorBorder: OutlineInputBorder(
            borderSide: const BorderSide(color: Colors.red, width: 1.0),
            borderRadius: BorderRadius.circular(15),
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        ),
      ),
    );
  }

  Widget _buildActionButton({
    required VoidCallback? onPressed,
    required String text,
    required bool isLoading,
    required Color backgroundColor,
  }) {
    return SizedBox(
      width: double.infinity,
      height: 55,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          elevation: 3,
          shadowColor: backgroundColor.withOpacity(0.3),
        ),
        child: isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
            : Text(
                text,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
      ),
    );
  }

  Widget _buildBackToSignInButton() {
    return TextButton.icon(
      onPressed: _navigateToSignIn,
      icon: Icon(Icons.arrow_back, color: primaryGreen, size: 18),
      label: Text(
        'Back to Sign In',
        style: TextStyle(
          color: primaryGreen,
          fontSize: 16,
          fontWeight: FontWeight.w600,
        ),
      ),
      style: TextButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      ),
    );
  }

  Widget _buildStatusMessage() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _isError ? errorRed.withOpacity(0.1) : successGreen.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: _isError ? errorRed.withOpacity(0.3) : successGreen.withOpacity(0.3),
        ),
      ),
      child: Row(
        children: [
          Icon(
            _isError ? Icons.error_outline : Icons.check_circle_outline,
            color: _isError ? errorRed : successGreen,
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              _statusMessage,
              style: TextStyle(
                color: _isError ? errorRed : successGreen,
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}