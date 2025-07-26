import 'package:flutter/material.dart';
import 'package:growersignup/models/grower/grower_order_model.dart';
import 'package:growersignup/services/grower/grower_order_api.dart';
import 'package:growersignup/sreens/grower/orders/grower_order_request_page.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_home_page.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_payment_page.dart';
import 'package:growersignup/sreens/grower/home_pages/show_supplier_details.dart';
import 'package:growersignup/sreens/conversation_pages/conversation_list_screen.dart';
import 'package:intl/intl.dart';

class GrowerOrderPage extends StatefulWidget {
  final String email; 
  const GrowerOrderPage({super.key, required this.email});

  @override
  State<GrowerOrderPage> createState() => _GrowerOrderPageState();
}

class _GrowerOrderPageState extends State<GrowerOrderPage> with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _superLeafController = TextEditingController();
  final _greenLeafController = TextEditingController();
  final _dateController = TextEditingController();

  DateTime? _selectedDate;
  String? _selectedTransportMethod;
  String? _selectedPaymentMethod;
  int _bottomNavIndex = 0; // Orders tab
  bool _isLoading = false;

  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  final List<String> _transportOptions = ['By Own', 'By Collector'];
  final List<String> _paymentOptions = ['Cash', 'Bank'];

  // Enhanced Color Palette (matching GrowerHomePage)
  static const Color primaryGreen = Color(0xFF0a4e41);
  static const Color lightGreen = Color(0xFFF0FBEF);
  static const Color cardBackground = Colors.white;
  static const Color accentGreen = Color(0xFFB2E7AE);
  static const Color darkGreen = Color(0xFF064037);
  static const Color textDark = Color(0xFF1A1A1A);
  static const Color textLight = Color(0xFF666666);

  final GrowerOrderApi _apiHandler = GrowerOrderApi();

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.elasticOut),
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _superLeafController.dispose();
    _greenLeafController.dispose();
    _dateController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime(DateTime.now().year + 1),
      builder: (context, child) {
        return Theme(
          data: ThemeData.light().copyWith(
            colorScheme: const ColorScheme.light(
              primary: primaryGreen,
              onPrimary: Colors.white,
              onSurface: textDark,
            ),
            dialogTheme: const DialogTheme(backgroundColor: cardBackground),
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
        _dateController.text = DateFormat('yyyy/MM/dd').format(picked);
      });
    }
  }

  Future<void> _saveOrder() async {
    if (!_formKey.currentState!.validate()) {
      _showSnackBar('Please fix the errors', Colors.red);
      return;
    }

    if (_selectedDate == null ||
        _selectedTransportMethod == null ||
        _selectedPaymentMethod == null) {
      _showSnackBar('Please complete all fields', Colors.orange);
      return;
    }

    setState(() => _isLoading = true);

    final superLeafKg = double.tryParse(_superLeafController.text) ?? 0.0;
    final greenLeafKg = double.tryParse(_greenLeafController.text) ?? 0.0;
    final harvestDate = _selectedDate!;
    final transportMethod = _selectedTransportMethod!;
    final paymentMethod = _selectedPaymentMethod!;

    final growerModel = GrowerOrderModel(
      superTeaQuantity: superLeafKg,
      greenTeaQuantity: greenLeafKg,
      placeDate: harvestDate,
      transportMethod: transportMethod,
      paymentMethod: paymentMethod,
      growerEmail: widget.email,
    );

    try {
      final response = await _apiHandler.getGrowerOrder(growerModel);

      if (response.growerOrderId != null) {
        _showSnackBar('Order created successfully!', Colors.green);
        
        // Clear form
        _clearForm();
        
        // Navigate to order requests page
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => GrowerOrderRequestPage(email: widget.email),
          ),
        );
      }
    } catch (e) {
      _showSnackBar('Failed to create order. Please try again.', Colors.red);
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _clearForm() {
    _superLeafController.clear();
    _greenLeafController.clear();
    _dateController.clear();
    setState(() {
      _selectedDate = null;
      _selectedTransportMethod = null;
      _selectedPaymentMethod = null;
    });
  }

  void _showSnackBar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              color == Colors.green ? Icons.check_circle : 
              color == Colors.red ? Icons.error : Icons.warning,
              color: Colors.white,
            ),
            const SizedBox(width: 10),
            Text(message),
          ],
        ),
        backgroundColor: color,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  // Navigation Methods
  void _navigateToHarvest() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => GrowerOrderPage(email: widget.email)),
    );
  }

  void _navigateToPayments() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => PaymentsPage(email: widget.email)),
    );
  }

  void _navigateToHome() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => GrowerHomePage(email: widget.email)),
    );
  }

  void _navigateToMessages() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => ConversationListScreen(
          email: widget.email,
          userType: "Grower",
        ),
      ),
    );
  }

  void _navigateToProfile() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => GrowerDetailsPage(email: widget.email)),
    );
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    
    setState(() => _bottomNavIndex = index);
    
    switch (index) {
      case 0: // Harvest (current page)
        break;
      case 1: // Payments
        _navigateToPayments();
        break;
      case 2: // Home
        _navigateToHome();
        break;
      case 3: // Messages
        _navigateToMessages();
        break;
      case 4: // Profile
        _navigateToProfile();
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: lightGreen,
      body: CustomScrollView(
        slivers: [
          // Custom App Bar with Tea Background Image (matching GrowerHomePage)
          SliverAppBar(
            expandedHeight: 200,
            floating: false,
            pinned: true,
            backgroundColor: primaryGreen,
            automaticallyImplyLeading: false,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [primaryGreen.withOpacity(0.8), darkGreen],
                  ),
                ),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    // Tea Background Image
                    Image.asset(
                      'lib/assets/images/tea.png',
                      fit: BoxFit.cover,
                      color: Colors.black.withOpacity(0.3),
                      colorBlendMode: BlendMode.darken,
                    ),
                    
                    // Gradient Overlay
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            primaryGreen.withOpacity(0.3),
                            darkGreen.withOpacity(0.7),
                          ],
                        ),
                      ),
                    ),
                    
                    // Content
                    SafeArea(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.end,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: const Icon(Icons.add_box_outlined, color: Colors.white, size: 20),
                                ),
                                const SizedBox(width: 10),
                                const Text(
                                  'Create Order',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    shadows: [
                                      Shadow(
                                        blurRadius: 4.0,
                                        color: Colors.black54,
                                        offset: Offset(1.0, 1.0),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            const Text(
                              'Ready to submit your harvest order?',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                shadows: [
                                  Shadow(
                                    blurRadius: 4.0,
                                    color: Colors.black54,
                                    offset: Offset(1.0, 1.0),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 30),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            leading: Container(
              margin: const EdgeInsets.only(left: 8),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.3),
                borderRadius: BorderRadius.circular(10),
              ),
              child: IconButton(
                icon: const Icon(Icons.arrow_back_ios, color: Colors.white, size: 20),
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ),

          // Main Content
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Welcome Card with Animation
                FadeTransition(
                  opacity: _fadeAnimation,
                  child: ScaleTransition(
                    scale: _scaleAnimation,
                    child: _buildWelcomeCard(),
                  ),
                ),
                
                const SizedBox(height: 25),
                
                // Order Form Card
                FadeTransition(
                  opacity: _fadeAnimation,
                  child: _buildOrderFormCard(),
                ),
                
                const SizedBox(height: 100), // Space for bottom nav
              ]),
            ),
          ),
        ],
      ),
      
      // Bottom Navigation
      bottomNavigationBar: _buildBottomNavBar(),
    );
  }

  Widget _buildWelcomeCard() {
    return Container(
      padding: const EdgeInsets.all(20),
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
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(15),
            ),
            child: const Icon(Icons.eco, color: Colors.white, size: 28),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'New Harvest Order',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  'Fill in the details below to create your order',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.9),
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  'All fields are required',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.8),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderFormCard() {
    return Container(
      padding: const EdgeInsets.all(25),
      decoration: BoxDecoration(
        color: cardBackground,
        borderRadius: BorderRadius.circular(25),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Section Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: primaryGreen.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(Icons.inventory, color: primaryGreen, size: 20),
                ),
                const SizedBox(width: 10),
                const Text(
                  'Harvest Quantities',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textDark,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Tea Quantities
            _buildTextField(
              controller: _superLeafController,
              hintText: 'Super leaf quantity (kg)',
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              icon: Icons.star,
              validator: (value) {
                if (value == null || value.isEmpty) return 'Enter super leaf quantity';
                if (double.tryParse(value) == null) return 'Enter a valid number';
                return null;
              },
            ),
            const SizedBox(height: 15),
            _buildTextField(
              controller: _greenLeafController,
              hintText: 'Green leaf quantity (kg)',
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              icon: Icons.eco,
              validator: (value) {
                if (value == null || value.isEmpty) return 'Enter green leaf quantity';
                if (double.tryParse(value) == null) return 'Enter a valid number';
                return null;
              },
            ),

            const SizedBox(height: 30),

            // Date Section
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.blue.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(Icons.calendar_today, color: Colors.blue, size: 20),
                ),
                const SizedBox(width: 10),
                const Text(
                  'Harvest Date',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textDark,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 15),
            _buildDateField(context),

            const SizedBox(height: 30),

            // Transport Section
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.orange.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(Icons.local_shipping, color: Colors.orange, size: 20),
                ),
                const SizedBox(width: 10),
                const Text(
                  'Transport Method',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textDark,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 15),
            _buildDropdown(
              hint: 'Select transport method',
              value: _selectedTransportMethod,
              items: _transportOptions,
              icon: Icons.local_shipping,
              onChanged: (val) => setState(() => _selectedTransportMethod = val),
              validator: (val) => val == null ? 'Please select transport method' : null,
            ),

            const SizedBox(height: 30),

            // Payment Section
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(Icons.payment, color: Colors.green, size: 20),
                ),
                const SizedBox(width: 10),
                const Text(
                  'Payment Method',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textDark,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 15),
            _buildDropdown(
              hint: 'Select payment method',
              value: _selectedPaymentMethod,
              items: _paymentOptions,
              icon: Icons.payment,
              onChanged: (val) => setState(() => _selectedPaymentMethod = val),
              validator: (val) => val == null ? 'Please select payment method' : null,
            ),

            const SizedBox(height: 40),

            // Submit Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _saveOrder,
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryGreen,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                  elevation: 3,
                ),
                child: _isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.send, size: 20),
                          SizedBox(width: 10),
                          Text(
                            'Create Order',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    required TextInputType keyboardType,
    required IconData icon,
    required String? Function(String?) validator,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: TextFormField(
        controller: controller,
        keyboardType: keyboardType,
        validator: validator,
        style: const TextStyle(color: textDark),
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: TextStyle(color: textLight),
          prefixIcon: Icon(icon, color: primaryGreen),
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

  Widget _buildDropdown({
    required String hint,
    required String? value,
    required List<String> items,
    required IconData icon,
    required void Function(String?) onChanged,
    required String? Function(String?) validator,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: DropdownButtonFormField<String>(
        value: value,
        isExpanded: true,
        validator: validator,
        decoration: InputDecoration(
          filled: true,
          fillColor: accentGreen.withOpacity(0.1),
          prefixIcon: Icon(icon, color: primaryGreen),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(15),
            borderSide: BorderSide(color: accentGreen.withOpacity(0.5)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(15),
            borderSide: BorderSide(color: accentGreen.withOpacity(0.5)),
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: const BorderSide(color: primaryGreen, width: 2.0),
            borderRadius: BorderRadius.circular(15),
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        ),
        hint: Text(hint, style: TextStyle(color: textLight)),
        items: items.map((String val) {
          return DropdownMenuItem<String>(
            value: val,
            child: Text(val, style: const TextStyle(color: textDark)),
          );
        }).toList(),
        onChanged: onChanged,
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
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: GestureDetector(
        onTap: () => _selectDate(context),
        child: AbsorbPointer(
          child: TextFormField(
            controller: _dateController,
            validator: (value) => value == null || value.isEmpty ? 'Please select a date' : null,
            style: const TextStyle(color: textDark),
            decoration: InputDecoration(
              hintText: 'Select harvest date',
              hintStyle: TextStyle(color: textLight),
              prefixIcon: Icon(Icons.calendar_today, color: primaryGreen),
              suffixIcon: Icon(Icons.arrow_drop_down, color: textLight),
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
              contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBottomNavBar() {
    return Container(
      decoration: BoxDecoration(
        color: cardBackground,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(25),
          topRight: Radius.circular(25),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2),
            blurRadius: 15,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(25),
          topRight: Radius.circular(25),
        ),
        child: BottomNavigationBar(
          type: BottomNavigationBarType.fixed,
          currentIndex: _bottomNavIndex,
          selectedItemColor: primaryGreen,
          unselectedItemColor: textLight,
          backgroundColor: Colors.transparent,
          elevation: 0,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
          unselectedLabelStyle: const TextStyle(fontSize: 11),
          onTap: _onBottomNavTapped,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.eco_outlined),
              activeIcon: Icon(Icons.eco),
              label: 'Harvest',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.payment_outlined),
              activeIcon: Icon(Icons.payment),
              label: 'Payments',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.message_outlined),
              activeIcon: Icon(Icons.message),
              label: 'Messages',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}