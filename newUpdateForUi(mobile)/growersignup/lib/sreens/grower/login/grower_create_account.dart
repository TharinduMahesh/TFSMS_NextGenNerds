import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; 
import 'package:growersignup/models/grower/grower_Account.dart';
import 'package:growersignup/services/grower/grower_create_api.dart';
import 'package:growersignup/sreens/grower/login/grower_bank_detals.dart';
import 'package:intl/intl.dart'; 

class GrowerCreateAccountPage extends StatefulWidget {
  final String email;
  const GrowerCreateAccountPage({super.key, required this.email});

  @override
  State<GrowerCreateAccountPage> createState() =>
      _GrowerCreateAccountPageState();
}

class _GrowerCreateAccountPageState extends State<GrowerCreateAccountPage> 
    with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();

  // Controllers for ALL Text Fields
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _nicController = TextEditingController();
  final _address1Controller = TextEditingController();
  final _address2Controller = TextEditingController();
  final _cityController = TextEditingController();
  final _postalCodeController = TextEditingController();
  final _dobController = TextEditingController();
  final _phoneController = TextEditingController();

  final _growerCreateApi = GrowerCreateApi(); 
  DateTime? _selectedDate;
  String? _selectedGender;
  String? _selectedPaymentMethod;
  bool _isLoading = false;
  String _statusMessage = '';
  bool _isError = false;

  // Animation controllers
  late AnimationController _animationController;
  late AnimationController _cardAnimationController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _slideAnimation;
  late Animation<double> _cardAnimation;

  // Options Lists
  final List<String> _genderOptions = [
    'Male',
    'Female',
    'Other',
    'Prefer not to say',
  ];
  final List<String> _paymentOptions = ['Bank', 'Cash'];

  // Enhanced Color Palette for Tea Project (matching other grower pages)
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
    _firstNameController.dispose();
    _lastNameController.dispose();
    _nicController.dispose();
    _address1Controller.dispose();
    _address2Controller.dispose();
    _cityController.dispose();
    _postalCodeController.dispose();
    _dobController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _createAccount() async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() {
        _isLoading = true;
        _statusMessage = '';
      });

      GrowerAccountModel? newGrower = GrowerAccountModel(
        GrowerFirstName: _firstNameController.text,
        GrowerLastName: _lastNameController.text,
        GrowerNIC: _nicController.text,
        GrowerAddressLine1: _address1Controller.text,
        GrowerAddressLine2: _address2Controller.text,
        GrowerCity: _cityController.text,
        GrowerPostalCode: _postalCodeController.text,
        GrowerGender: _selectedGender ?? '',
        GrowerDOB: _selectedDate ?? DateTime.now(), 
        GrowerPhoneNum: _phoneController.text,
        GrowerEmail: widget.email,
      );

      try {
        GrowerAccountModel newGAccountModel = await _growerCreateApi.groweraccount(newGrower);
        print('Account creation successful: ${newGAccountModel.toJson()}'); 

        setState(() {
          _isLoading = false;
          _statusMessage = 'Account created successfully!';
          _isError = false;
        });

        await Future.delayed(const Duration(milliseconds: 1500));

        if (mounted) {
          Navigator.push(
            context, 
            MaterialPageRoute(
              builder: (context) => GrowerBankDetailsSetupPage(email: widget.email, growerName: '${_firstNameController.text} ${_lastNameController.text}',)
            )
          );
        }
        
      } catch (e) {
        setState(() {
          _isLoading = false;
          _statusMessage = 'Failed to create account. Please try again.';
          _isError = true;
        });
        print('Error during account creation: $e');
      }
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate:
          _selectedDate ??
          DateTime(
            DateTime.now().year - 18,
            DateTime.now().month,
            DateTime.now().day,
          ),
      firstDate: DateTime(1920),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: ThemeData.light().copyWith(
            colorScheme: const ColorScheme.light(
              primary: primaryGreen,
              onPrimary: Colors.white,
              onSurface: textDark,
            ),
            dialogBackgroundColor: cardBackground,
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
        _dobController.text = DateFormat('yyyy/MM/dd').format(picked);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: lightGreen,
      body: Stack(
        children: [
          // Background with decorative elements
          _buildDecorativeElements(),
          
          // Main content
          SafeArea(
            child: CustomScrollView(
              slivers: [
                // Enhanced App Bar
                SliverAppBar(
                  backgroundColor: Colors.transparent,
                  elevation: 0,
                  floating: true,
                  pinned: false,
                  leading: IconButton(
                    icon: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: cardBackground.withOpacity(0.9),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.2),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.arrow_back_ios,
                        color: primaryGreen,
                        size: 20,
                      ),
                    ),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                  centerTitle: true,
                ),

                // Main Form Content
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      // Header Section
                      AnimatedBuilder(
                        animation: _fadeAnimation,
                        builder: (context, child) {
                          return Transform.translate(
                            offset: Offset(0, -_slideAnimation.value),
                            child: Opacity(
                              opacity: _fadeAnimation.value,
                              child: _buildHeaderSection(),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 30),

                      // Main Form Card
                      AnimatedBuilder(
                        animation: _cardAnimation,
                        builder: (context, child) {
                          return Transform.scale(
                            scale: _cardAnimation.value,
                            child: Opacity(
                              opacity: _fadeAnimation.value,
                              child: _buildMainFormCard(),
                            ),
                          );
                        },
                      ),

                      const SizedBox(height: 30),
                    ]),
                  ),
                ),
              ],
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

  Widget _buildHeaderSection() {
    return Container(
      padding: const EdgeInsets.all(25),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [primaryGreen, darkGreen],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: primaryGreen.withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.person_add,
                  color: Colors.white,
                  size: 24,
                ),
              ),
              const SizedBox(width: 15),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Welcome to Tea Cultivation',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 5),
                    Text(
                      'Complete your profile to get started',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMainFormCard() {
    return Container(
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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Personal Details Section
            _buildSectionHeader('Personal Details', Icons.person_outline),
            const SizedBox(height: 20),
            
            _buildTextField(
              controller: _firstNameController,
              labelText: 'First Name',
              prefixIcon: Icons.person,
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              textCapitalization: TextCapitalization.words,
            ),
            const SizedBox(height: 16),
            
            _buildTextField(
              controller: _lastNameController,
              labelText: 'Last Name',
              prefixIcon: Icons.person,
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              textCapitalization: TextCapitalization.words,
            ),
            const SizedBox(height: 16),
            
            _buildTextField(
              controller: _nicController,
              labelText: 'NIC Number',
              prefixIcon: Icons.badge,
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 30),

            // Address Section
            _buildSectionHeader('Address Information', Icons.location_on_outlined),
            const SizedBox(height: 20),
            
            _buildTextField(
              controller: _address1Controller,
              labelText: 'Address Line 1',
              prefixIcon: Icons.home,
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              textCapitalization: TextCapitalization.words,
            ),
            const SizedBox(height: 16),
            
            _buildTextField(
              controller: _address2Controller,
              labelText: 'Address Line 2 (Optional)',
              prefixIcon: Icons.home_outlined,
              textCapitalization: TextCapitalization.words,
            ),
            const SizedBox(height: 16),
            
            Row(
              children: [
                Expanded(
                  child: _buildTextField(
                    controller: _cityController,
                    labelText: 'City',
                    prefixIcon: Icons.location_city,
                    validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                    textCapitalization: TextCapitalization.words,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildTextField(
                    controller: _postalCodeController,
                    labelText: 'Postal Code',
                    prefixIcon: Icons.markunread_mailbox,
                    keyboardType: TextInputType.number,
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 30),

            // Personal Info Section
            _buildSectionHeader('Personal Information', Icons.info_outline),
            const SizedBox(height: 20),
            
            _buildDropdown(
              labelText: 'Gender',
              prefixIcon: Icons.wc,
              hint: 'Select Gender',
              value: _selectedGender,
              items: _genderOptions,
              onChanged: (value) => setState(() => _selectedGender = value),
              validator: (value) => value == null ? 'Please select gender' : null,
            ),
            const SizedBox(height: 16),
            
            _buildDateField(context),
            const SizedBox(height: 30),

            // Contact & Payment Section
            _buildSectionHeader('Contact & Payment', Icons.contact_phone),
            const SizedBox(height: 20),
            
            _buildTextField(
              controller: _phoneController,
              labelText: 'Phone Number',
              prefixIcon: Icons.phone,
              keyboardType: TextInputType.phone,
              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              validator: (v) {
                if (v == null || v.isEmpty) return 'Required';
                if (v.length < 10) return 'Invalid phone number';
                return null;
              },
            ),
            const SizedBox(height: 16),
            
            _buildDropdown(
              labelText: 'Payment Method',
              prefixIcon: Icons.payment,
              hint: 'How to get money',
              value: _selectedPaymentMethod,
              items: _paymentOptions,
              onChanged: (value) => setState(() => _selectedPaymentMethod = value),
              validator: (value) => value == null ? 'Please select payment method' : null,
            ),
            
            if (_statusMessage.isNotEmpty) ...[
              const SizedBox(height: 25),
              _buildStatusMessage(),
            ],
            
            const SizedBox(height: 40),
            
            // Submit Button
            _buildActionButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [primaryGreen.withOpacity(0.1), accentGreen.withOpacity(0.1)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: primaryGreen, size: 20),
        ),
        const SizedBox(width: 12),
        Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: textDark,
          ),
        ),
        Expanded(
          child: Container(
            height: 1,
            margin: const EdgeInsets.only(left: 16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [primaryGreen.withOpacity(0.3), Colors.transparent],
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
              ),
            ),
          ),
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
    String? Function(String?)? validator,
    List<TextInputFormatter>? inputFormatters,
    TextCapitalization textCapitalization = TextCapitalization.none,
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
        obscureText: obscureText,
        keyboardType: keyboardType,
        validator: validator,
        inputFormatters: inputFormatters,
        textCapitalization: textCapitalization,
        style: const TextStyle(color: textDark),
        decoration: InputDecoration(
          labelText: labelText,
          labelStyle: TextStyle(color: textLight),
          prefixIcon: Icon(prefixIcon, color: primaryGreen),
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

  Widget _buildDateField(BuildContext context) {
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
        controller: _dobController,
        readOnly: true,
        style: const TextStyle(color: textDark),
        decoration: InputDecoration(
          labelText: 'Date of Birth',
          labelStyle: TextStyle(color: textLight),
          prefixIcon: const Icon(Icons.calendar_today, color: primaryGreen),
          suffixIcon: const Icon(Icons.keyboard_arrow_down, color: primaryGreen),
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
        onTap: () {
          FocusScope.of(context).requestFocus(FocusNode());
          _selectDate(context);
        },
        validator: (value) => (value == null || value.isEmpty) ? 'Please select date of birth' : null,
      ),
    );
  }

  Widget _buildDropdown({
    required String labelText,
    required IconData prefixIcon,
    required String hint,
    required String? value,
    required List<String> items,
    required ValueChanged<String?> onChanged,
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
      child: DropdownButtonFormField<String>(
        value: value,
        items: items.map((item) => DropdownMenuItem<String>(
          value: item,
          child: Text(item, style: const TextStyle(color: textDark, fontSize: 14)),
        )).toList(),
        onChanged: onChanged,
        decoration: InputDecoration(
          labelText: labelText,
          labelStyle: TextStyle(color: textLight),
          prefixIcon: Icon(prefixIcon, color: primaryGreen),
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
        dropdownColor: cardBackground,
        icon: const Icon(Icons.keyboard_arrow_down, color: primaryGreen),
        validator: validator,
      ),
    );
  }

  Widget _buildActionButton() {
    return SizedBox(
      width: double.infinity,
      height: 55,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _createAccount,
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryGreen,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          elevation: 3,
          shadowColor: primaryGreen.withOpacity(0.3),
        ),
        child: _isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
            : const Text(
                'Create Account',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
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