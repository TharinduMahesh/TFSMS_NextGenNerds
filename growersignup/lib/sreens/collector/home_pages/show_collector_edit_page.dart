import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/models/collector/show_collector_model.dart';
import 'package:growersignup/services/collector/show_collector_api.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

class CollectorDetailsPage extends StatefulWidget {
  final String email;
  const CollectorDetailsPage({super.key, required this.email});

  @override
  State<CollectorDetailsPage> createState() => _CollectorDetailsPageState();
}

class _CollectorDetailsPageState extends State<CollectorDetailsPage> {
  int _bottomNavIndex = 2;
  bool _isEditing = false;

  final _apiService = CollectorApiService();

  final _fullNameController = TextEditingController();
  final _address1Controller = TextEditingController();
  final _address2Controller = TextEditingController();
  final _address3Controller = TextEditingController();
  final _postalCodeController = TextEditingController();
  final _genderController = TextEditingController();
  final _nicController = TextEditingController();
  final _dobController = TextEditingController();
  final _phoneController = TextEditingController();
  final _vehicleNumberController = TextEditingController();

  CollectorCreateAccount? _collector;

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
        _fullNameController.text = '${data.collectorFirstName} ${data.collectorLastName}';
        _address1Controller.text = data.collectorAddressLine1;
        _address2Controller.text = data.collectorAddressLine2 ?? '';
        _address3Controller.text = data.collectorCity;
        _postalCodeController.text = data.collectorPostalCode ?? '';
        _genderController.text = data.collectorGender ?? '';
        _nicController.text = data.collectorNIC;
        _dobController.text = data.collectorDOB?.toIso8601String().split("T").first ?? '';
        _phoneController.text = data.collectorPhoneNum;
        _vehicleNumberController.text = data.collectorVehicleNum;
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to load collector details.')),
      );
    }
  }

  Future<void> _saveCollectorData() async {
    if (_collector == null) return;

    final parts = _fullNameController.text.trim().split(" ");
    final firstName = parts.isNotEmpty ? parts.first : "";
    final lastName = parts.length > 1 ? parts.sublist(1).join(" ") : "";

    final updated = CollectorCreateAccount(
      collectorAccountId: _collector!.collectorAccountId,
      collectorFirstName: firstName,
      collectorLastName: lastName,
      collectorNIC: _nicController.text.trim(),
      collectorAddressLine1: _address1Controller.text.trim(),
      collectorAddressLine2: _address2Controller.text.trim(),
      collectorCity: _address3Controller.text.trim(),
      collectorPostalCode: _postalCodeController.text.trim(),
      collectorGender: _genderController.text.trim(),
      collectorDOB: DateTime.tryParse(_dobController.text.trim()),
      collectorPhoneNum: _phoneController.text.trim(),
      collectorVehicleNum: _vehicleNumberController.text.trim(),
      collectorEmail: widget.email,
    );

    final success = await _apiService.updateCollectorByEmail(widget.email, updated);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(success ? 'Details saved successfully!' : 'Failed to save details!'),
        backgroundColor: success ? Colors.green : Colors.red,
      ),
    );
  }

  void _toggleEditMode() async {
    if (_isEditing) await _saveCollectorData();
    setState(() => _isEditing = !_isEditing);
  }

  void _onBottomNavTapped(int index) {
    setState(() => _bottomNavIndex = index);
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _address1Controller.dispose();
    _address2Controller.dispose();
    _address3Controller.dispose();
    _postalCodeController.dispose();
    _genderController.dispose();
    _nicController.dispose();
    _dobController.dispose();
    _phoneController.dispose();
    _vehicleNumberController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          backgroundColor: const Color(0xFFF0FBEF),
          appBar: AppBar(
            backgroundColor: const Color.fromARGB(255, 1, 112, 45),
            foregroundColor: Colors.white,
            elevation: 1,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios),
              onPressed: () => Navigator.of(context).pop(),
            ),
            title: Text(
              languageProvider.getText('personalDetails') ?? 'Personal Details',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            actions: [
              Padding(
                padding: const EdgeInsets.only(right: 10.0),
                child: TextButton(
                  onPressed: _toggleEditMode,
                  style: TextButton.styleFrom(
                    backgroundColor: Colors.black,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
                  ),
                  child: Text(_isEditing
                      ? languageProvider.getText('save') ?? 'Save'
                      : languageProvider.getText('edit') ?? 'Edit'),
                ),
              )
            ],
          ),
          body: _collector == null
              ? const Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildDetailRow(languageProvider.getText('fullName') ?? 'Full Name:', _fullNameController),
                      const SizedBox(height: 18),
                      _buildLabel(languageProvider.getText('address') ?? 'Address:'),
                      _buildDetailRow(null, _address1Controller),
                      _buildDetailRow(null, _address2Controller),
                      _buildDetailRow(null, _address3Controller),
                      const SizedBox(height: 18),
                      _buildDetailRow(languageProvider.getText('postalCode') ?? 'Postal Code:', _postalCodeController),
                      const SizedBox(height: 18),
                      _buildDetailRow(languageProvider.getText('gender') ?? 'Gender:', _genderController),
                      const SizedBox(height: 18),
                      _buildDetailRow(languageProvider.getText('nic') ?? 'NIC Number:', _nicController),
                      const SizedBox(height: 18),
                      _buildDetailRow(languageProvider.getText('dob') ?? 'Birthday date:', _dobController),
                      const SizedBox(height: 18),
                      _buildDetailRow(languageProvider.getText('phone') ?? 'Phone Number:', _phoneController),
                      const SizedBox(height: 18),
                      _buildDetailRow(languageProvider.getText('vehicleNumber') ?? 'Vehicle Number:', _vehicleNumberController),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
          bottomNavigationBar: BottomNavigationBar(
            currentIndex: _bottomNavIndex,
            onTap: _onBottomNavTapped,
            selectedItemColor: const Color(0xFF0a4e41),
            unselectedItemColor: Colors.grey,
            backgroundColor: Colors.white,
            type: BottomNavigationBarType.fixed,
            items: const [
              BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
              BottomNavigationBarItem(icon: Icon(Icons.notifications_outlined), label: 'Notification'),
              BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
              BottomNavigationBarItem(icon: Icon(Icons.star_outline), label: 'Contact us'),
            ],
          ),
        );
      },
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0),
      child: Text(text, style: const TextStyle(color: Color(0xFF333333), fontWeight: FontWeight.w500)),
    );
  }

  Widget _buildDetailRow(String? label, TextEditingController controller) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (label != null) _buildLabel(label),
          if (label != null) const SizedBox(height: 2),
          _isEditing
              ? TextFormField(
                  controller: controller,
                  decoration: InputDecoration(
                    isDense: true,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 12.0),
                    filled: true,
                    fillColor: const Color(0xFFF8FDEF),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10.0),
                      borderSide: const BorderSide(color: Color(0xFFDDEECC), width: 1.0),
                    ),
                  ),
                )
              : Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 12.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FDEF),
                    borderRadius: BorderRadius.circular(10.0),
                    border: Border.all(color: const Color(0xFFDDEECC)),
                  ),
                  child: Text(controller.text, style: const TextStyle(fontSize: 15)),
                ),
        ],
      ),
    );
  }
}
