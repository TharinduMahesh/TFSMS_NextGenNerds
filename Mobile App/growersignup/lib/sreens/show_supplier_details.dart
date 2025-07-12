import 'package:flutter/material.dart';

class SupplierDetailsPage extends StatefulWidget {
  const SupplierDetailsPage({super.key});

  @override
  State<SupplierDetailsPage> createState() => _SupplierDetailsPageState();
}

class _SupplierDetailsPageState extends State<SupplierDetailsPage> {
  // State variables
  int _bottomNavIndex = 2; // Profile is selected
  bool _isEditing = false; // Controls view/edit mode

  // --- Controllers for all editable fields ---
  late TextEditingController _fullNameController;
  late TextEditingController _address1Controller;
  late TextEditingController _address2Controller;
  late TextEditingController _address3Controller; // For "Colombo 05"
  late TextEditingController _postalCodeController;
  late TextEditingController _genderController;
  late TextEditingController _nicController;
  late TextEditingController _dobController;
  late TextEditingController _phoneController;
  late TextEditingController _bankDetailsController;

  // --- Placeholder Data (Replace with actual data fetching logic) ---
  final Map<String, dynamic> _initialUserData = {
    'fullName': 'Kasun Malinda Perera',
    'address': ['No25', 'nnnnn road', 'Colombo 05'],
    'postalCode': '65998',
    'gender': 'Male',
    'nic': '65998',
    'dob': '65998', // Should be a date, e.g., '1990-01-01'
    'phone': '65998',
    'bankDetails': 'BOC bank,\nNegombo Branch,\nMalith Perera.\n4451656448',
  };

  @override
  void initState() {
    super.initState();
    // Initialize controllers with data
    _initializeControllers();
    // TODO: Fetch user data from API and then call _initializeControllers()
  }

  void _initializeControllers() {
    _fullNameController = TextEditingController(text: _initialUserData['fullName']);
    _address1Controller = TextEditingController(text: _initialUserData['address'][0]);
    _address2Controller = TextEditingController(text: _initialUserData['address'][1]);
    _address3Controller = TextEditingController(text: _initialUserData['address'][2]);
    _postalCodeController = TextEditingController(text: _initialUserData['postalCode']);
    _genderController = TextEditingController(text: _initialUserData['gender']);
    _nicController = TextEditingController(text: _initialUserData['nic']);
    _dobController = TextEditingController(text: _initialUserData['dob']);
    _phoneController = TextEditingController(text: _initialUserData['phone']);
    _bankDetailsController = TextEditingController(text: _initialUserData['bankDetails']);
  }

  @override
  void dispose() {
    // Dispose all controllers to prevent memory leaks
    _fullNameController.dispose();
    _address1Controller.dispose();
    _address2Controller.dispose();
    _address3Controller.dispose();
    _postalCodeController.dispose();
    _genderController.dispose();
    _nicController.dispose();
    _dobController.dispose();
    _phoneController.dispose();
    _bankDetailsController.dispose();
    super.dispose();
  }

  // --- Define Colors (estimated) ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color titleColor = Color(0xFF0a4e41);
  static const Color labelColor = Color(0xFF333333);
  static const Color dataContainerColor = Color(0xFFF8FDEF);
  static const Color dataContainerBorderColor = Color(0xFFDDEECC);
  static const Color editButtonBgColor = Colors.black;
  static const Color editButtonTextColor = Colors.white;
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = titleColor;
  static const Color bottomNavBarUnselectedColor = Colors.grey;
  // --- End Colors ---

  // --- Toggle Edit/Save Mode ---
  void _toggleEditMode() {
    if (_isEditing) {
      // Logic for "Save" button press
      print('Saving data...');
      // *** TODO: Implement API call to save the updated data ***
      // Gather data from controllers:
      // final updatedData = {
      //   'fullName': _fullNameController.text,
      //   ...
      // };
      // await ApiService().updateUserProfile(updatedData);

       ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Details Saved (Simulated)!'), backgroundColor: Colors.green),
      );
    }
    // Toggle the editing state
    setState(() {
      _isEditing = !_isEditing;
    });
  }

  // --- Bottom Nav Logic ---
  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() => _bottomNavIndex = index);
    // TODO: Implement navigation
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: pageBackgroundColor,
      appBar: AppBar(
        backgroundColor: pageBackgroundColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: titleColor),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Personal Details',
          style: TextStyle(color: titleColor, fontWeight: FontWeight.bold, fontSize: 22),
        ),
        centerTitle: true,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 10.0),
            child: TextButton(
              onPressed: _toggleEditMode,
              style: TextButton.styleFrom(
                backgroundColor: editButtonBgColor,
                foregroundColor: editButtonTextColor,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
              ),
              child: Text(_isEditing ? 'Save' : 'Edit', style: const TextStyle(fontSize: 14)),
            ),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 15.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDetailRow('Full Name:', _fullNameController),
            const SizedBox(height: 18),

            _buildLabel('Address:'), // Single label for address group
            _buildDetailRow(null, _address1Controller),
            _buildDetailRow(null, _address2Controller),
            _buildDetailRow(null, _address3Controller),
            const SizedBox(height: 18),

            _buildDetailRow('Postal Code:', _postalCodeController, keyboardType: TextInputType.number),
            const SizedBox(height: 18),
            
            _buildDetailRow('Gender:', _genderController),
            const SizedBox(height: 18),
            
            _buildDetailRow('NIC Number:', _nicController),
            const SizedBox(height: 18),
            
            _buildDetailRow('Birthday date:', _dobController),
            const SizedBox(height: 18),
            
            _buildDetailRow('Phone Number:', _phoneController, keyboardType: TextInputType.phone),
            const SizedBox(height: 18),
            
            _buildMultiLineDetailRow('Bank Account Details:', _bankDetailsController),
            const SizedBox(height: 20),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: bottomNavBarBackground,
        selectedItemColor: bottomNavBarSelectedColor,
        unselectedItemColor: bottomNavBarUnselectedColor,
        currentIndex: _bottomNavIndex,
        onTap: _onBottomNavTapped,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.notifications_outlined), label: 'Notification'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
          BottomNavigationBarItem(icon: Icon(Icons.star_outline), label: 'Contact us'),
        ],
      ),
    );
  }

  // --- Helper Widgets ---

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0),
      child: Text(
        text,
        style: const TextStyle(
          color: labelColor, fontWeight: FontWeight.w500, fontSize: 14,
        ),
      ),
    );
  }

  // Helper for standard, single-line detail rows
  Widget _buildDetailRow(String? label, TextEditingController controller, {TextInputType? keyboardType}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (label != null) _buildLabel(label), // Only show label if provided
          if (label != null) const SizedBox(height: 2),

          _isEditing
              // EDITING MODE: Show a TextFormField
              ? TextFormField(
                  controller: controller,
                  keyboardType: keyboardType,
                  style: const TextStyle(color: Colors.black87, fontSize: 15),
                  decoration: InputDecoration(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 12.0),
                    filled: true,
                    fillColor: dataContainerColor,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10.0),
                      borderSide: const BorderSide(color: dataContainerBorderColor, width: 1.0),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10.0),
                      borderSide: const BorderSide(color: dataContainerBorderColor, width: 1.0),
                    ),
                    focusedBorder: OutlineInputBorder(
                       borderRadius: BorderRadius.circular(10.0),
                       borderSide: const BorderSide(color: titleColor, width: 1.5),
                    )
                  ),
                )
              // VIEW MODE: Show a static Container with Text
              : Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 12.0),
                  decoration: BoxDecoration(
                    color: dataContainerColor,
                    borderRadius: BorderRadius.circular(10.0),
                    border: Border.all(color: dataContainerBorderColor, width: 1.0),
                  ),
                  child: Text(
                    controller.text,
                    style: const TextStyle(color: Colors.black87, fontSize: 15),
                  ),
                ),
        ],
      ),
    );
  }
  
  // Helper for the multi-line bank details row
  Widget _buildMultiLineDetailRow(String label, TextEditingController controller) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildLabel(label),
          const SizedBox(height: 2),

          _isEditing
              // EDITING MODE: Show a multi-line TextFormField
              ? TextFormField(
                  controller: controller,
                  keyboardType: TextInputType.multiline,
                  maxLines: null, // Allows the field to expand vertically
                  style: const TextStyle(color: Colors.black87, fontSize: 15, height: 1.4),
                  decoration: InputDecoration(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 12.0),
                    filled: true, fillColor: dataContainerColor,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10.0),
                      borderSide: const BorderSide(color: dataContainerBorderColor, width: 1.0),
                    ),
                     enabledBorder: OutlineInputBorder(
                       borderRadius: BorderRadius.circular(10.0),
                       borderSide: const BorderSide(color: dataContainerBorderColor, width: 1.0),
                     ),
                     focusedBorder: OutlineInputBorder(
                       borderRadius: BorderRadius.circular(10.0),
                       borderSide: const BorderSide(color: titleColor, width: 1.5),
                    )
                  ),
                )
              // VIEW MODE: Show a static Container with multi-line Text
              : Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 12.0),
                  decoration: BoxDecoration(
                    color: dataContainerColor,
                    borderRadius: BorderRadius.circular(10.0),
                    border: Border.all(color: dataContainerBorderColor, width: 1.0),
                  ),
                  child: Text(
                    controller.text,
                    style: const TextStyle(color: Colors.black87, fontSize: 15, height: 1.4),
                  ),
                ),
        ],
      );
    }
}