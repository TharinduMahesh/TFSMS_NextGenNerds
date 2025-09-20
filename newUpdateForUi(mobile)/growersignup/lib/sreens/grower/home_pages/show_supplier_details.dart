import 'package:flutter/material.dart';
import 'package:growersignup/models/grower/show_account_model.dart';
import 'package:growersignup/services/grower/show_grower_api.dart';
// --- NEW IMPORTS ---
import 'package:growersignup/services/grower/grower_signup_api.dart'; // For logout
import 'package:growersignup/sreens/grower/home_pages/g_payment_select.dart';
import 'package:growersignup/sreens/grower/login/grower_signin_page.dart'; // For navigation
import 'package:growersignup/sreens/grower/orders/g_order_selecttion.dart';
// --- END NEW IMPORTS ---
import 'grower_home_page.dart';
import 'grower_harvest.dart';
import '../../conversation_pages/conversation_list_screen.dart';

class GrowerDetailsPage extends StatefulWidget {
  final String email;
  const GrowerDetailsPage({super.key, required this.email});

  @override
  State<GrowerDetailsPage> createState() => _SupplierDetailsPageState();
}

class _SupplierDetailsPageState extends State<GrowerDetailsPage> with TickerProviderStateMixin {
  int _bottomNavIndex = 4; // Set to 4 since this is the Profile page
  bool _isEditing = false;
  bool _isLoading = true;

  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  // Controllers
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _address1Controller = TextEditingController();
  final _address2Controller = TextEditingController();
  final _address3Controller = TextEditingController();
  final _postalCodeController = TextEditingController();
  final _genderController = TextEditingController();
  final _nicController = TextEditingController();
  final _dobController = TextEditingController();
  final _phoneController = TextEditingController();

  String? _selectedGender;
  DateTime? _selectedDate;
  final List<String> _genderOptions = ['Male', 'Female', 'Other'];
  
  // --- NEW: Instance of AuthService ---
  final _authService = GrowerAuthService();

  GrowerCreateAccount? _growerData;

  // Enhanced Color Scheme
  static const Color primaryGreen = Color(0xFF0a4e41);
  static const Color lightGreen = Color(0xFFF0FBEF);
  static const Color accentGreen = Color(0xFFB2E7AE);
  static const Color cardBackground = Colors.white;
  static const Color textDark = Color(0xFF1A1A1A);
  static const Color textLight = Color(0xFF666666);
  static const Color successGreen = Color.fromARGB(255, 0, 0, 0);
  static const Color warningOrange = Color(0xFFFF9800);

  @override
  void initState() {
    super.initState();
    _fetchGrowerDetails();
    
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    _firstNameController.dispose();
    _lastNameController.dispose();
    _address1Controller.dispose();
    _address2Controller.dispose();
    _address3Controller.dispose();
    _postalCodeController.dispose();
    _genderController.dispose();
    _nicController.dispose();
    _dobController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _fetchGrowerDetails() async {
    // ... (your existing _fetchGrowerDetails logic remains the same)
    setState(() => _isLoading = true);
    final grower = await GrowerApi.fetchGrowerByEmail(widget.email);
    if (grower != null) {
      _growerData = grower;
      _firstNameController.text = grower.growerFirstName;
      _lastNameController.text = grower.growerLastName;
      _address1Controller.text = grower.growerAddressLine1;
      _address2Controller.text = grower.growerAddressLine2 ?? '';
      _address3Controller.text = grower.growerCity;
      _postalCodeController.text = grower.growerPostalCode ?? '';
      _genderController.text = grower.growerGender ?? '';
      _selectedGender = grower.growerGender;
      _nicController.text = grower.growerNIC;
      if (grower.growerDOB != null) {
        _selectedDate = grower.growerDOB;
        _dobController.text = grower.growerDOB!.toIso8601String().split('T').first;
      }
      _phoneController.text = grower.growerPhoneNum ?? '';
    }
    setState(() => _isLoading = false);
    _animationController.forward();
  }

  // --- NEW: Logout Method ---
  Future<void> _handleLogout() async {
    // Call the logout method from the service to delete the token
    await _authService.logout();

    // Navigate back to the sign-in screen and remove all previous routes
    if (mounted) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => const GrowerSignInPage()),
        (Route<dynamic> route) => false, // This predicate removes all routes
      );
    }
  }
  // --- END: Logout Method ---

  Future<void> _selectDate(BuildContext context) async {
    // ... (your existing _selectDate logic remains the same)
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime(1990),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(primary: primaryGreen, onPrimary: Colors.white, onSurface: textDark),
            textButtonTheme: TextButtonThemeData(style: TextButton.styleFrom(foregroundColor: primaryGreen)),
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
        _dobController.text = picked.toIso8601String().split('T').first;
      });
    }
  }

  void _toggleEditMode() async {
    // ... (your existing _toggleEditMode logic remains the same)
    if (_isEditing) {
      if (_growerData == null) return;
      showDialog(context: context, barrierDismissible: false, builder: (context) => const Center(child: CircularProgressIndicator()));
      final updatedGrower = GrowerCreateAccount(
        growerAccountId: _growerData!.growerAccountId,
        growerFirstName: _firstNameController.text.trim(),
        growerLastName: _lastNameController.text.trim(),
        growerNIC: _nicController.text.trim(),
        growerAddressLine1: _address1Controller.text.trim(),
        growerAddressLine2: _address2Controller.text.trim(),
        growerCity: _address3Controller.text.trim(),
        growerPostalCode: _postalCodeController.text.trim(),
        growerGender: _selectedGender,
        growerDOB: _selectedDate,
        growerPhoneNum: _phoneController.text.trim(),
        growerEmail: _growerData!.growerEmail,
      );
      final success = await GrowerApi.updateGrower(widget.email, updatedGrower);
      Navigator.of(context).pop();
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Details updated successfully!'), backgroundColor: Colors.green));
        await _fetchGrowerDetails();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Update failed.'), backgroundColor: Colors.red));
      }
    }
    setState(() => _isEditing = !_isEditing);
  }

  // Navigation Methods
  void _navigateToHarvest() {
    Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => GrowerOrderDetailsSelectPage(email: widget.email)));
  }

  void _navigateToPayments() {
    Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => GrowerPaymentDetailsSelectPage(email: widget.email)));
  }

  void _navigateToHome() {
    Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => GrowerHomePage(email: widget.email)));
  }

  void _navigateToMessages() {
    // Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => ConversationListScreen(email: widget.email)));
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() => _bottomNavIndex = index);
    switch (index) {
      case 0: _navigateToHarvest(); break;
      case 1: _navigateToPayments(); break;
      case 2: _navigateToHome(); break;
      case 3: _navigateToMessages(); break;
      case 4: break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: lightGreen,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            // ... (your existing SliverAppBar code remains the same)
            expandedHeight: 180,
            floating: false,
            pinned: true,
            backgroundColor: primaryGreen,
            leading: IconButton(icon: const Icon(Icons.arrow_back_ios, color: Colors.white), onPressed: () => Navigator.of(context).pop()),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [primaryGreen, primaryGreen.withOpacity(0.8)])),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Container(
                          width: 80, height: 80,
                          decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(40), border: Border.all(color: Colors.white, width: 3)),
                          child: Center(child: Text(_isLoading ? '?' : '${_firstNameController.text.isNotEmpty ? _firstNameController.text[0] : ''}${_lastNameController.text.isNotEmpty ? _lastNameController.text[0] : ''}', style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold))),
                        ),
                        const SizedBox(height: 10),
                        Text(_isLoading ? 'Loading...' : '${_firstNameController.text} ${_lastNameController.text}', style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 5),
                        Text(widget.email, style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 14)),
                        const SizedBox(height: 25),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            actions: [
              Container(
                margin: const EdgeInsets.only(right: 15),
                decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(10)),
                child: IconButton(icon: Icon(_isEditing ? Icons.save : Icons.edit, color: Colors.white), onPressed: _toggleEditMode),
              ),
            ],
          ),
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                if (_isLoading)
                  _buildLoadingState()
                else
                  FadeTransition(
                    opacity: _fadeAnimation,
                    child: _buildProfileContent(),
                  ),
              ]),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        // ... (your existing BottomNavigationBar code remains the same)
        decoration: BoxDecoration(color: cardBackground, borderRadius: const BorderRadius.only(topLeft: Radius.circular(25), topRight: Radius.circular(25)), boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.2), blurRadius: 15, offset: const Offset(0, -5))]),
        child: ClipRRect(
          borderRadius: const BorderRadius.only(topLeft: Radius.circular(25), topRight: Radius.circular(25)),
          child: BottomNavigationBar(
            type: BottomNavigationBarType.fixed,
            currentIndex: _bottomNavIndex,
            selectedItemColor: primaryGreen,
            unselectedItemColor: textLight,
            backgroundColor: Colors.transparent,
            elevation: 0,
            onTap: _onBottomNavTapped,
            items: const [
              BottomNavigationBarItem(icon: Icon(Icons.eco_outlined), activeIcon: Icon(Icons.eco), label: 'Harvest'),
              BottomNavigationBarItem(icon: Icon(Icons.payment_outlined), activeIcon: Icon(Icons.payment), label: 'Payments'),
              BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
              BottomNavigationBarItem(icon: Icon(Icons.message_outlined), activeIcon: Icon(Icons.message), label: 'Messages'),
              BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLoadingState() {
    // ... (your existing _buildLoadingState code remains the same)
    return SizedBox(height: 400, child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [Container(padding: const EdgeInsets.all(30), decoration: BoxDecoration(color: cardBackground, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 10, offset: const Offset(0, 4))]), child: Column(children: [CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(primaryGreen)), const SizedBox(height: 20), Text('Loading your profile...', style: TextStyle(color: textLight, fontSize: 16))]))]));
  }

  Widget _buildProfileContent() {
    return Column(
      children: [
        _buildSection(
          title: 'Personal Information',
          icon: Icons.person,
          children: [
            _buildDetailRow('First Name', _firstNameController),
            _buildDetailRow('Last Name', _lastNameController),
            _buildGenderField(),
            _buildDateField(),
            _buildDetailRow('NIC Number', _nicController),
          ],
        ),
        const SizedBox(height: 25),
        _buildSection(
          title: 'Contact Information',
          icon: Icons.contact_phone,
          children: [
            _buildDetailRow('Phone Number', _phoneController),
          ],
        ),
        const SizedBox(height: 25),
        _buildSection(
          title: 'Address Information',
          icon: Icons.location_on,
          children: [
            _buildDetailRow('Address Line 1', _address1Controller),
            _buildDetailRow('Address Line 2', _address2Controller),
            _buildDetailRow('City', _address3Controller),
            _buildDetailRow('Postal Code', _postalCodeController),
          ],
        ),
        
        // --- NEW: LOGOUT BUTTON ---
        const SizedBox(height: 40),
        ElevatedButton.icon(
          icon: const Icon(Icons.logout, color: Colors.white),
          label: const Text('Log Out', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          onPressed: _handleLogout,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.redAccent,
            minimumSize: const Size(double.infinity, 50),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(15),
            ),
            elevation: 2,
          ),
        ),
        // --- END: LOGOUT BUTTON ---

        const SizedBox(height: 100), // Space for bottom navigation
      ],
    );
  }

  Widget _buildGenderField() {
    // ... (your existing _buildGenderField code remains the same)
    return Padding(padding: const EdgeInsets.only(bottom: 15), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Gender', style: TextStyle(color: textLight, fontSize: 14)), const SizedBox(height: 8), _isEditing ? Container(decoration: BoxDecoration(color: cardBackground, borderRadius: BorderRadius.circular(12.0), border: Border.all(color: accentGreen.withOpacity(0.3))), child: DropdownButtonFormField<String>(value: _selectedGender, decoration: InputDecoration(contentPadding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 12.0), border: InputBorder.none, hintText: 'Select Gender'), items: _genderOptions.map((String gender) => DropdownMenuItem<String>(value: gender, child: Text(gender))).toList(), onChanged: (String? newValue) => setState(() => _selectedGender = newValue))) : Container(width: double.infinity, padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 12.0), decoration: BoxDecoration(color: accentGreen.withOpacity(0.1), borderRadius: BorderRadius.circular(12.0)), child: Text(_selectedGender ?? 'Not provided', style: TextStyle(color: _selectedGender != null ? textDark : textLight)))]));
  }

  Widget _buildDateField() {
    // ... (your existing _buildDateField code remains the same)
    return Padding(padding: const EdgeInsets.only(bottom: 15), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Date of Birth', style: TextStyle(color: textLight, fontSize: 14)), const SizedBox(height: 8), _isEditing ? Material(color: Colors.transparent, child: InkWell(borderRadius: BorderRadius.circular(12.0), onTap: () => _selectDate(context), child: Container(padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 12.0), decoration: BoxDecoration(borderRadius: BorderRadius.circular(12.0), border: Border.all(color: accentGreen.withOpacity(0.3))), child: Row(children: [Icon(Icons.calendar_today, color: primaryGreen, size: 20), const SizedBox(width: 10), Expanded(child: Text(_selectedDate != null ? _selectedDate!.toIso8601String().split('T').first : 'Select Date', style: TextStyle(color: _selectedDate != null ? textDark : textLight)))])))) : Container(width: double.infinity, padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 12.0), decoration: BoxDecoration(color: accentGreen.withOpacity(0.1), borderRadius: BorderRadius.circular(12.0)), child: Text(_selectedDate != null ? _selectedDate!.toIso8601String().split('T').first : 'Not provided', style: TextStyle(color: _selectedDate != null ? textDark : textLight)))]));
  }

  Widget _buildSection({required String title, required IconData icon, required List<Widget> children}) {
    // ... (your existing _buildSection code remains the same)
    return Container(padding: const EdgeInsets.all(20), decoration: BoxDecoration(color: cardBackground, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 10, offset: const Offset(0, 4))]), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Row(children: [Container(padding: const EdgeInsets.all(8), decoration: BoxDecoration(color: primaryGreen.withOpacity(0.1), borderRadius: BorderRadius.circular(8)), child: Icon(icon, color: primaryGreen, size: 20)), const SizedBox(width: 12), Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textDark)), const Spacer(), if (_isEditing) Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: warningOrange.withOpacity(0.1), borderRadius: BorderRadius.circular(12)), child: Text('Editing', style: TextStyle(color: warningOrange, fontSize: 10)))]), const SizedBox(height: 20), ...children]));
  }

  Widget _buildDetailRow(String label, TextEditingController controller) {
    // ... (your existing _buildDetailRow code remains the same)
    return Padding(padding: const EdgeInsets.only(bottom: 15), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(label, style: TextStyle(color: textLight, fontSize: 14)), const SizedBox(height: 8), _isEditing ? TextFormField(controller: controller, style: TextStyle(color: textDark, fontSize: 15), decoration: _inputDecoration()) : Container(width: double.infinity, padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 12.0), decoration: BoxDecoration(color: accentGreen.withOpacity(0.1), borderRadius: BorderRadius.circular(12.0)), child: Text(controller.text.isEmpty ? 'Not provided' : controller.text, style: TextStyle(color: controller.text.isEmpty ? textLight : textDark, fontStyle: controller.text.isEmpty ? FontStyle.italic : FontStyle.normal)))]));
  }

  InputDecoration _inputDecoration() {
    // ... (your existing _inputDecoration code remains the same)
    return InputDecoration(contentPadding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 12.0), filled: true, fillColor: cardBackground, border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: BorderSide(color: accentGreen.withOpacity(0.3))), enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: BorderSide(color: accentGreen.withOpacity(0.3))), focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: primaryGreen, width: 2)));
  }
}
