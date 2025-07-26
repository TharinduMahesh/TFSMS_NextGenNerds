import 'package:flutter/material.dart';
import 'package:growersignup/models/collector/show_collector_model.dart';
import 'package:growersignup/services/collector/show_collector_api.dart';
import 'package:growersignup/sreens/conversation_pages/conversation_list_screen.dart';

class CollectorDetailsPage extends StatefulWidget {
  final String email;
  const CollectorDetailsPage({super.key, required this.email});

  @override
  State<CollectorDetailsPage> createState() => _CollectorDetailsPageState();
}

class _CollectorDetailsPageState extends State<CollectorDetailsPage> {
  final _formKey = GlobalKey<FormState>();
  int _bottomNavIndex = 4; // Profile tab
  bool _isEditing = false;

  final _apiService = CollectorApiService();

  // Controllers
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _address1Controller = TextEditingController();
  final _address2Controller = TextEditingController();
  final _cityController = TextEditingController();
  final _postalCodeController = TextEditingController();
  final _genderController = TextEditingController();
  final _nicController = TextEditingController();
  final _dobController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _vehicleNumberController = TextEditingController();

  CollectorCreateAccount? _collector;

  // Enhanced Color Scheme (matching grower theme)
  static const Color primaryGreen = Color(0xFF0a4e41);
  static const Color lightGreen = Color(0xFFF0FBEF);
  static const Color cardBackground = Colors.white;
  static const Color textDark = Color(0xFF1A1A1A);
  static const Color textLight = Color(0xFF666666);

  @override
  void initState() {
    super.initState();
    _loadCollectorData();
  }

  Future<void> _loadCollectorData() async {
    final data = await _apiService.fetchCollectorByEmail(widget.email);
    if (data != null) {
      setState(() {
        _collector = data;
        _firstNameController.text = data.collectorFirstName;
        _lastNameController.text = data.collectorLastName;
        _address1Controller.text = data.collectorAddressLine1;
        _address2Controller.text = data.collectorAddressLine2 ?? '';
        _cityController.text = data.collectorCity;
        _postalCodeController.text = data.collectorPostalCode ?? '';
        _genderController.text = data.collectorGender ?? '';
        _nicController.text = data.collectorNIC;
        _dobController.text = data.collectorDOB?.toIso8601String().split("T").first ?? '';
        _phoneController.text = data.collectorPhoneNum;
        _emailController.text = widget.email;
        _vehicleNumberController.text = data.collectorVehicleNum;
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Failed to load collector details.'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      );
    }
  }

  Future<void> _saveChanges() async {
    if (_formKey.currentState!.validate() && _collector != null) {
      final updatedCollector = CollectorCreateAccount(
        collectorAccountId: _collector!.collectorAccountId,
        collectorFirstName: _firstNameController.text,
        collectorLastName: _lastNameController.text,
        collectorNIC: _nicController.text,
        collectorAddressLine1: _address1Controller.text,
        collectorAddressLine2: _address2Controller.text,
        collectorCity: _cityController.text,
        collectorPostalCode: _postalCodeController.text,
        collectorGender: _genderController.text,
        collectorDOB: DateTime.tryParse(_dobController.text),
        collectorPhoneNum: _phoneController.text,
        collectorVehicleNum: _vehicleNumberController.text,
        collectorEmail: _emailController.text,
      );

      final success = await _apiService.updateCollectorByEmail(widget.email, updatedCollector);

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Details saved successfully!'),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
        );
        setState(() {
          _isEditing = false;
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Failed to save details!'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
        );
      }
    }
  }

  void _toggleEditMode() {
    if (_isEditing) {
      _saveChanges();
    } else {
      setState(() {
        _isEditing = true;
      });
    }
  }

  // Navigation Methods
  void _navigateToOrders() {
    Navigator.pushReplacementNamed(context, '/collector-orders', arguments: widget.email);
  }

  void _navigateToPayments() {
    Navigator.pushReplacementNamed(context, '/collector-payments', arguments: widget.email);
  }

  void _navigateToHome() {
    Navigator.pushReplacementNamed(context, '/collector-home', arguments: widget.email);
  }

  void _navigateToMessages() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => ConversationListScreen(
          email: widget.email,
          userType: "Collector",
        ),
      ),
    );
  }

  void _navigateToProfile() {
    // Current page - no action needed
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    
    setState(() => _bottomNavIndex = index);
    
    switch (index) {
      case 0: _navigateToOrders(); break;
      case 1: _navigateToPayments(); break;
      case 2: _navigateToHome(); break;
      case 3: _navigateToMessages(); break;
      case 4: _navigateToProfile(); break;
    }
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _address1Controller.dispose();
    _address2Controller.dispose();
    _cityController.dispose();
    _postalCodeController.dispose();
    _genderController.dispose();
    _nicController.dispose();
    _dobController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _vehicleNumberController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: lightGreen,
      appBar: AppBar(
        title: const Text(
          'Collector Details',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: primaryGreen,
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 15),
            child: ElevatedButton(
              onPressed: _toggleEditMode,
              style: ElevatedButton.styleFrom(
                backgroundColor: _isEditing ? Colors.green : Colors.white,
                foregroundColor: _isEditing ? Colors.white : primaryGreen,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                elevation: 2,
              ),
              child: Text(
                _isEditing ? 'Save' : 'Edit',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
      body: _collector == null
          ? Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(primaryGreen),
                strokeWidth: 3,
              ),
            )
          : Padding(
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: ListView(
                  children: [
                    // Personal Information Section
                    _buildSectionHeader('Personal Information'),
                    const SizedBox(height: 15),
                    
                    _buildTextField(
                      controller: _firstNameController,
                      labelText: 'First Name',
                      validator: (value) => value!.isEmpty ? 'Enter first name' : null,
                      enabled: _isEditing,
                    ),
                    
                    _buildTextField(
                      controller: _lastNameController,
                      labelText: 'Last Name',
                      validator: (value) => value!.isEmpty ? 'Enter last name' : null,
                      enabled: _isEditing,
                    ),
                    
                    _buildTextField(
                      controller: _nicController,
                      labelText: 'NIC Number',
                      validator: (value) => value!.isEmpty ? 'Enter NIC number' : null,
                      enabled: _isEditing,
                    ),
                    
                    _buildTextField(
                      controller: _genderController,
                      labelText: 'Gender',
                      enabled: _isEditing,
                    ),
                    
                    _buildTextField(
                      controller: _dobController,
                      labelText: 'Date of Birth (YYYY-MM-DD)',
                      enabled: _isEditing,
                    ),
                    
                    const SizedBox(height: 25),
                    
                    // Contact Information Section
                    _buildSectionHeader('Contact Information'),
                    const SizedBox(height: 15),
                    
                    _buildTextField(
                      controller: _phoneController,
                      labelText: 'Phone Number',
                      validator: (value) => value!.isEmpty ? 'Enter phone number' : null,
                      enabled: _isEditing,
                    ),
                    
                    _buildTextField(
                      controller: _emailController,
                      labelText: 'Email',
                      validator: (value) => value!.isEmpty ? 'Enter email' : null,
                      enabled: false, // Email should not be editable
                    ),
                    
                    const SizedBox(height: 25),
                    
                    // Address Information Section
                    _buildSectionHeader('Address Information'),
                    const SizedBox(height: 15),
                    
                    _buildTextField(
                      controller: _address1Controller,
                      labelText: 'Address Line 1',
                      validator: (value) => value!.isEmpty ? 'Enter address line 1' : null,
                      enabled: _isEditing,
                    ),
                    
                    _buildTextField(
                      controller: _address2Controller,
                      labelText: 'Address Line 2',
                      enabled: _isEditing,
                    ),
                    
                    _buildTextField(
                      controller: _cityController,
                      labelText: 'City',
                      validator: (value) => value!.isEmpty ? 'Enter city' : null,
                      enabled: _isEditing,
                    ),
                    
                    _buildTextField(
                      controller: _postalCodeController,
                      labelText: 'Postal Code',
                      enabled: _isEditing,
                    ),
                    
                    const SizedBox(height: 25),
                    
                    // Vehicle Information Section
                    _buildSectionHeader('Vehicle Information'),
                    const SizedBox(height: 15),
                    
                    _buildTextField(
                      controller: _vehicleNumberController,
                      labelText: 'Vehicle Number',
                      validator: (value) => value!.isEmpty ? 'Enter vehicle number' : null,
                      enabled: _isEditing,
                    ),
                    
                    const SizedBox(height: 100), // Space for bottom navigation
                  ],
                ),
              ),
            ),
      
      // Bottom Navigation Bar
      bottomNavigationBar: Container(
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
                icon: Icon(Icons.assignment_outlined),
                activeIcon: Icon(Icons.assignment),
                label: 'Orders',
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
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 15),
      decoration: BoxDecoration(
        color: primaryGreen.withOpacity(0.1),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: primaryGreen.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Icon(
            title.contains('Personal') ? Icons.person :
            title.contains('Contact') ? Icons.contact_phone :
            title.contains('Address') ? Icons.location_on :
            Icons.directions_car,
            color: primaryGreen,
            size: 20,
          ),
          const SizedBox(width: 10),
          Text(
            title,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: primaryGreen,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String labelText,
    String? Function(String?)? validator,
    bool enabled = true,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: TextFormField(
        controller: controller,
        decoration: InputDecoration(
          labelText: labelText,
          labelStyle: TextStyle(
            color: enabled ? primaryGreen : textLight,
            fontWeight: FontWeight.w500,
          ),
          filled: true,
          fillColor: enabled ? cardBackground : Colors.grey[100],
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: primaryGreen.withOpacity(0.3)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: primaryGreen.withOpacity(0.3)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: primaryGreen, width: 2),
          ),
          disabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.grey[300]!),
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        ),
        validator: validator,
        enabled: enabled,
        style: TextStyle(
          color: enabled ? textDark : textLight,
          fontSize: 16,
        ),
      ),
    );
  }
}