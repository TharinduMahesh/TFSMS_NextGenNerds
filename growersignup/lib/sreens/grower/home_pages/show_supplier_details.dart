import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/models/grower/show_account_model.dart';
import 'package:growersignup/services/grower/show_grower_api.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/widgets/language_selector.dart';

class GrowerDetailsPage extends StatefulWidget {
  final String email;
  const GrowerDetailsPage({super.key, required this.email});

  @override
  State<GrowerDetailsPage> createState() => _SupplierDetailsPageState();
}

class _SupplierDetailsPageState extends State<GrowerDetailsPage> {
  int _bottomNavIndex = 2;
  bool _isEditing = false;
  bool _isLoading = true;

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

  GrowerCreateAccount? _growerData;

  // Colors (as per your code)
  static const Color titleColor = Color(0xFF0a4e41);
  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color labelColor = Color(0xFF333333);
  static const Color dataContainerColor = Color(0xFFF8FDEF);
  static const Color dataContainerBorderColor = Color(0xFFDDEECC);
  static const Color editButtonBgColor = Colors.black;
  static const Color editButtonTextColor = Colors.white;
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = titleColor;
  static const Color bottomNavBarUnselectedColor = Colors.grey;

  @override
  void initState() {
    super.initState();
    _fetchGrowerDetails();
  }

  Future<void> _fetchGrowerDetails() async {
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
      _nicController.text = grower.growerNIC;
      _dobController.text = grower.growerDOB?.toIso8601String().split('T').first ?? '';
      _phoneController.text = grower.growerPhoneNum ?? '';
    }
    setState(() {
      _isLoading = false;
    });
  }

  void _toggleEditMode() async {
    if (_isEditing) {
      if (_growerData == null) return;

      final updatedGrower = GrowerCreateAccount(
        growerAccountId: _growerData!.growerAccountId,
        growerFirstName: _firstNameController.text.trim(),
        growerLastName: _lastNameController.text.trim(),
        growerNIC: _nicController.text.trim(),
        growerAddressLine1: _address1Controller.text.trim(),
        growerAddressLine2: _address2Controller.text.trim(),
        growerCity: _address3Controller.text.trim(),
        growerPostalCode: _postalCodeController.text.trim(),
        growerGender: _genderController.text.trim(),
        growerDOB: DateTime.tryParse(_dobController.text.trim()),
        growerPhoneNum: _phoneController.text.trim(),
        growerEmail: _growerData!.growerEmail,
      );

      final success = await GrowerApi.updateGrower(widget.email, updatedGrower);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Details updated successfully!'), backgroundColor: Colors.green),
        );
        await _fetchGrowerDetails(); // Refresh data
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Update failed.'), backgroundColor: Colors.red),
        );
      }
    }

    setState(() {
      _isEditing = !_isEditing;
    });
  }

  void _onBottomNavTapped(int index) {
    setState(() => _bottomNavIndex = index);
    // TODO: Navigate to other pages
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return Scaffold(
          backgroundColor: pageBackgroundColor,
      appBar: AppBar(
        backgroundColor: pageBackgroundColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: titleColor),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          languageProvider.getText('personalDetails'),
          style: TextStyle(color: titleColor, fontWeight: FontWeight.bold, fontSize: 22),
        ),
        centerTitle: true,
        actions: [
          LanguageSelector(),
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
            _buildDetailRow('First Name:', _firstNameController),
            _buildDetailRow('Last Name:', _lastNameController),
            const SizedBox(height: 18),
            _buildLabel('Address:'),
            _buildDetailRow(null, _address1Controller),
            _buildDetailRow(null, _address2Controller),
            _buildDetailRow(null, _address3Controller),
            const SizedBox(height: 18),
            _buildDetailRow('Postal Code:', _postalCodeController),
            const SizedBox(height: 18),
            _buildDetailRow('Gender:', _genderController),
            const SizedBox(height: 18),
            _buildDetailRow('NIC Number:', _nicController),
            const SizedBox(height: 18),
            _buildDetailRow('Birthday date:', _dobController),
            const SizedBox(height: 18),
            _buildDetailRow('Phone Number:', _phoneController),
            const SizedBox(height: 20),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _bottomNavIndex,
        type: BottomNavigationBarType.fixed,
        backgroundColor: bottomNavBarBackground,
        selectedItemColor: bottomNavBarSelectedColor,
        unselectedItemColor: bottomNavBarUnselectedColor,
        onTap: _onBottomNavTapped,
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: languageProvider.getText('home')),
          BottomNavigationBarItem(icon: Icon(Icons.notifications_outlined), label: languageProvider.getText('notifications')),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: languageProvider.getText('profile')),
          BottomNavigationBarItem(icon: Icon(Icons.star_outline), label: languageProvider.getText('contactUs')),
        ],
      ),
    );
      },
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0),
      child: Text(text, style: const TextStyle(color: labelColor, fontWeight: FontWeight.w500, fontSize: 14)),
    );
  }

  Widget _buildDetailRow(String? label, TextEditingController controller) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (label != null) _buildLabel(label),
          _isEditing
              ? TextFormField(
                  controller: controller,
                  style: const TextStyle(color: Colors.black87, fontSize: 15),
                  decoration: _inputDecoration(),
                )
              : Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 12.0),
                  decoration: BoxDecoration(
                    color: dataContainerColor,
                    borderRadius: BorderRadius.circular(10.0),
                    border: Border.all(color: dataContainerBorderColor),
                  ),
                  child: Text(controller.text, style: const TextStyle(color: Colors.black87, fontSize: 15)),
                ),
        ],
      ),
    );
  }


  InputDecoration _inputDecoration() {
    return InputDecoration(
      contentPadding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 12.0),
      filled: true,
      fillColor: dataContainerColor,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10.0),
        borderSide: const BorderSide(color: dataContainerBorderColor),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10.0),
        borderSide: const BorderSide(color: dataContainerBorderColor),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10.0),
        borderSide: const BorderSide(color: titleColor, width: 1.5),
      ),
    );
  }
}
