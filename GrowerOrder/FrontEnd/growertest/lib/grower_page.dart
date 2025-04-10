import 'package:flutter/material.dart';
import 'package:growertest/api_hanlder.dart';
import 'package:intl/intl.dart';
import 'package:growertest/grower_model.dart'; // Ensure you import GrowerModel


class GrowerOrderPage extends StatefulWidget {
  const GrowerOrderPage({super.key});

  @override
  State<GrowerOrderPage> createState() => _GrowerOrderPageState();
}

class _GrowerOrderPageState extends State<GrowerOrderPage> {
  final _formKey = GlobalKey<FormState>();
  final _superLeafController = TextEditingController();
  final _greenLeafController = TextEditingController();
  final _dateController = TextEditingController();

  DateTime? _selectedDate;
  String? _selectedTransportMethod;
  String? _selectedPaymentMethod;
  int _bottomNavIndex = 0;

  final List<String> _transportOptions = ['By Own', 'By Collector'];
  final List<String> _paymentOptions = ['Cash', 'Bank'];

  static const Color pageBackgroundColor = Color(0xFFF8FDEF);
  static const Color containerBackgroundColor = Colors.white;
  static const Color appBarIconsColor = Colors.black54;
  static const Color labelTextColor = Colors.black87;
  static const Color inputBorderColor = Colors.black54;
  static const Color focusedInputBorderColor = Color(0xFF0a4e41);
  static const Color dropdownBackgroundColor = Color(0xFFDDF4DD);
  static const Color dropdownTextColor = Colors.black87;
  static const Color saveButtonColor = Color(0xFF0a4e41);
  static const Color saveButtonTextColor = Colors.white;
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = Color(0xFF0a4e41);
  static const Color bottomNavBarUnselectedColor = Colors.grey;

  final ApiHandler _apiHandler = ApiHandler(); // Create an instance of ApiHandler

  @override
  void dispose() {
    _superLeafController.dispose();
    _greenLeafController.dispose();
    _dateController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime.now().subtract(const Duration(days: 1)),
      lastDate: DateTime(DateTime.now().year + 1),
      builder: (context, child) {
        return Theme(
          data: ThemeData.light().copyWith(
            colorScheme: const ColorScheme.light(
              primary: saveButtonColor,
              onPrimary: Colors.white,
              onSurface: Colors.black,
            ),
            dialogTheme: DialogThemeData(backgroundColor: Colors.white),
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
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fix the errors'), backgroundColor: Colors.orangeAccent),
      );
      return;
    }

    if (_selectedDate == null ||
        _selectedTransportMethod == null ||
        _selectedPaymentMethod == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please complete all fields'), backgroundColor: Colors.orangeAccent),
      );
      return;
    }

    final superLeafKg = double.tryParse(_superLeafController.text) ?? 0.0;
    final greenLeafKg = double.tryParse(_greenLeafController.text) ?? 0.0;
    final harvestDate = _selectedDate!;
    final transportMethod = _selectedTransportMethod!;
    final paymentMethod = _selectedPaymentMethod!;

    final growerModel = GrowerModel(
      superTeaQuantity: superLeafKg,
      greenTeaQuantity: greenLeafKg,
      placeDate: harvestDate,
      transportMethod: transportMethod,
      paymentMethod: paymentMethod,
    );

    try {
      final response = await _apiHandler.getGrowerOrder(growerModel);

      if (response.growerOrderId != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Order saved successfully!'), backgroundColor: Colors.green),
        );
        // You can clear the fields after saving
        _superLeafController.clear();
        _greenLeafController.clear();
        _dateController.clear();
        setState(() {
          _selectedDate = null;
          _selectedTransportMethod = null;
          _selectedPaymentMethod = null;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to save order'), backgroundColor: Colors.red),
      );
    }
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() {
      _bottomNavIndex = index;
    });
    // Implement your actual page navigation logic here
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    required TextInputType keyboardType,
    required String? Function(String?) validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      validator: validator,
      decoration: InputDecoration(
        hintText: hintText,
        filled: true,
        fillColor: Colors.grey[100],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: inputBorderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: const BorderSide(color: focusedInputBorderColor, width: 2.0),
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }

  Widget _buildDropdown({
    required String hint,
    required String? value,
    required List<String> items,
    required void Function(String?) onChanged,
    required String? Function(String?) validator,
  }) {
    return DropdownButtonFormField<String>(
      value: value,
      isExpanded: true,
      decoration: InputDecoration(
        filled: true,
        fillColor: dropdownBackgroundColor,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
      hint: Text(hint),
      items: items.map((String val) {
        return DropdownMenuItem<String>(
          value: val,
          child: Text(val, style: const TextStyle(color: dropdownTextColor)),
        );
      }).toList(),
      onChanged: onChanged,
      validator: validator,
    );
  }

  Widget _buildDateField(BuildContext context) {
    return GestureDetector(
      onTap: () => _selectDate(context),
      child: AbsorbPointer(
        child: TextFormField(
          controller: _dateController,
          validator: (value) => value == null || value.isEmpty ? 'Please pick a date' : null,
          decoration: InputDecoration(
            hintText: 'Select date',
            suffixIcon: const Icon(Icons.calendar_today),
            filled: true,
            fillColor: Colors.grey[100],
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: inputBorderColor),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: focusedInputBorderColor, width: 2.0),
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: pageBackgroundColor,
      appBar: AppBar(
        backgroundColor: pageBackgroundColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: appBarIconsColor),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: appBarIconsColor),
            onPressed: () => print('Settings tapped'),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 15.0),
          child: Container(
            padding: const EdgeInsets.all(20),
            margin: const EdgeInsets.only(bottom: 20),
            decoration: BoxDecoration(
              color: containerBackgroundColor,
              borderRadius: BorderRadius.circular(20.0),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.1),
                  blurRadius: 5,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('How many (kg):',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17, color: labelTextColor)),
                const SizedBox(height: 15),
                _buildTextField(
                  controller: _superLeafController,
                  hintText: 'Super leaf (kg)',
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  validator: (value) {
                    if (value == null || value.isEmpty) return 'Enter super leaf kg';
                    if (double.tryParse(value) == null) return 'Enter a valid number';
                    return null;
                  },
                ),
                const SizedBox(height: 15),
                _buildTextField(
                  controller: _greenLeafController,
                  hintText: 'Green leaf (kg)',
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  validator: (value) {
                    if (value == null || value.isEmpty) return 'Enter green leaf kg';
                    if (double.tryParse(value) == null) return 'Enter a valid number';
                    return null;
                  },
                ),
                const SizedBox(height: 25),
                const Text('Date you can give harvest:',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: labelTextColor)),
                const SizedBox(height: 8),
                _buildDateField(context),
                const SizedBox(height: 25),
                const Text('How to transport:',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: labelTextColor)),
                const SizedBox(height: 8),
                _buildDropdown(
                  hint: 'Select method',
                  value: _selectedTransportMethod,
                  items: _transportOptions,
                  onChanged: (val) => setState(() => _selectedTransportMethod = val),
                  validator: (val) => val == null ? 'Please select transport method' : null,
                ),
                const SizedBox(height: 25),
                const Text('Payment method:',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: labelTextColor)),
                const SizedBox(height: 8),
                _buildDropdown(
                  hint: 'Select method',
                  value: _selectedPaymentMethod,
                  items: _paymentOptions,
                  onChanged: (val) => setState(() => _selectedPaymentMethod = val),
                  validator: (val) => val == null ? 'Please select payment method' : null,
                ),
                const SizedBox(height: 35),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _saveOrder,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: saveButtonColor,
                      padding: const EdgeInsets.symmetric(vertical: 15),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text('Save Order',
                        style: TextStyle(fontSize: 18, color: saveButtonTextColor)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _bottomNavIndex,
        onTap: _onBottomNavTapped,
        backgroundColor: bottomNavBarBackground,
        selectedItemColor: bottomNavBarSelectedColor,
        unselectedItemColor: bottomNavBarUnselectedColor,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.list),
            label: 'Orders',
          ),
        ],
      ),
    );
  }
}
