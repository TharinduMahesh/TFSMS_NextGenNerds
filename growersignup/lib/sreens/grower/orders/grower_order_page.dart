import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';
import 'package:growersignup/models/grower/grower_order_model.dart';
import 'package:growersignup/services/grower/grower_order_api.dart';
import 'package:growersignup/sreens/grower/orders/grower_order_request_page.dart';
import 'package:intl/intl.dart';

class GrowerOrderPage extends StatefulWidget {
  final String email;
  const GrowerOrderPage({super.key, required this.email});

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

  final GrowerOrderApi _apiHandler = GrowerOrderApi();

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
              primary: Color(0xFF0a4e41),
              onPrimary: Colors.white,
              onSurface: Colors.black,
            ),
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

  Future<void> _saveOrder(BuildContext context, LanguageProvider languageProvider) async {
    if (!_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(languageProvider.getText('fixErrors')), backgroundColor: Colors.orangeAccent),
      );
      return;
    }

    if (_selectedDate == null || _selectedTransportMethod == null || _selectedPaymentMethod == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(languageProvider.getText('completeAllFields')), backgroundColor: Colors.orangeAccent),
      );
      return;
    }

    final growerModel = GrowerOrderModel(
      superTeaQuantity: double.tryParse(_superLeafController.text) ?? 0.0,
      greenTeaQuantity: double.tryParse(_greenLeafController.text) ?? 0.0,
      placeDate: _selectedDate!,
      transportMethod: _selectedTransportMethod!,
      paymentMethod: _selectedPaymentMethod!,
      growerEmail: widget.email,
    );

    try {
      final response = await _apiHandler.getGrowerOrder(growerModel);
      if (response.growerOrderId != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(languageProvider.getText('orderSaved')), backgroundColor: Colors.green),
        );
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => GrowerOrderRequestPage(email: widget.email)),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(languageProvider.getText('orderFailed')), backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final languageProvider = Provider.of<LanguageProvider>(context);

    return Scaffold(
      backgroundColor: themeProvider.isDarkMode ? Colors.black : const Color(0xFFF8FDEF),
      appBar: AppBar(
        backgroundColor: themeProvider.isDarkMode ? Colors.black : const Color(0xFFF8FDEF),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black54),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: Colors.black54),
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
              color: Colors.white,
              borderRadius: BorderRadius.circular(20.0),
              boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 5)],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(languageProvider.getText('quantityKg'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
                const SizedBox(height: 15),
                _buildTextField(
                  controller: _superLeafController,
                  hintText: languageProvider.getText('superLeafKg'),
                  keyboardType: TextInputType.numberWithOptions(decimal: true),
                ),
                const SizedBox(height: 15),
                _buildTextField(
                  controller: _greenLeafController,
                  hintText: languageProvider.getText('greenLeafKg'),
                  keyboardType: TextInputType.numberWithOptions(decimal: true),
                ),
                const SizedBox(height: 25),
                Text(languageProvider.getText('harvestDate'), style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500)),
                const SizedBox(height: 8),
                _buildDateField(context, languageProvider),
                const SizedBox(height: 25),
                Text(languageProvider.getText('transportMethod'), style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500)),
                const SizedBox(height: 8),
                _buildDropdown(
                  hint: languageProvider.getText('selectMethod'),
                  value: _selectedTransportMethod,
                  items: _transportOptions,
                  onChanged: (val) => setState(() => _selectedTransportMethod = val),
                ),
                const SizedBox(height: 25),
                Text(languageProvider.getText('paymentMethod'), style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500)),
                const SizedBox(height: 8),
                _buildDropdown(
                  hint: languageProvider.getText('selectMethod'),
                  value: _selectedPaymentMethod,
                  items: _paymentOptions,
                  onChanged: (val) => setState(() => _selectedPaymentMethod = val),
                ),
                const SizedBox(height: 35),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => _saveOrder(context, languageProvider),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0a4e41),
                      padding: const EdgeInsets.symmetric(vertical: 15),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(languageProvider.getText('saveOrder'), style: const TextStyle(fontSize: 18, color: Colors.white)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _bottomNavIndex,
        onTap: (index) => setState(() => _bottomNavIndex = index),
        backgroundColor: Colors.white,
        selectedItemColor: const Color(0xFF0a4e41),
        unselectedItemColor: Colors.grey,
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: languageProvider.getText('home')),
          BottomNavigationBarItem(icon: Icon(Icons.list), label: languageProvider.getText('orders')),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    required TextInputType keyboardType,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      validator: (value) {
        if (value == null || value.isEmpty) return 'Required';
        if (double.tryParse(value) == null) return 'Invalid number';
        return null;
      },
      decoration: InputDecoration(
        hintText: hintText,
        filled: true,
        fillColor: Colors.grey[100],
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  Widget _buildDropdown({
    required String hint,
    required String? value,
    required List<String> items,
    required void Function(String?) onChanged,
  }) {
    return DropdownButtonFormField<String>(
      value: value,
      decoration: InputDecoration(
        filled: true,
        fillColor: const Color(0xFFDDF4DD),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
      hint: Text(hint),
      items: items.map((val) => DropdownMenuItem(value: val, child: Text(val))).toList(),
      onChanged: onChanged,
      validator: (val) => val == null ? 'Required' : null,
    );
  }

  Widget _buildDateField(BuildContext context, LanguageProvider languageProvider) {
    return GestureDetector(
      onTap: () => _selectDate(context),
      child: AbsorbPointer(
        child: TextFormField(
          controller: _dateController,
          validator: (value) => value == null || value.isEmpty ? 'Required' : null,
          decoration: InputDecoration(
            hintText: languageProvider.getText('selectDate'),
            suffixIcon: const Icon(Icons.calendar_today),
            filled: true,
            fillColor: Colors.grey[100],
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
      ),
    );
  }
}
