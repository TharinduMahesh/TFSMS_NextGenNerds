import 'package:flutter/material.dart';
import 'package:growersignup/api_hanlder.dart';
import 'package:growersignup/grower_model.dart';
import 'package:growersignup/grower_order_saved_page.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

enum TransportMethod { byOwn, byCollector }
enum PaymentMethod { cash, bank }

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

  final ApiHandler _apiHandler = ApiHandler();

  @override
  void dispose() {
    _superLeafController.dispose();
    _greenLeafController.dispose();
    _dateController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final language = context.read<LanguageProvider>();
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime.now().subtract(const Duration(days: 1)),
      lastDate: DateTime(DateTime.now().year + 1),
      builder: (_, child) => Theme(
        data: ThemeData.light().copyWith(
          colorScheme: const ColorScheme.light(primary: Color(0xFF0a4e41)),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() {
        _selectedDate = picked;
        _dateController.text = DateFormat('yyyy/MM/dd').format(picked);
      });
    }
  }

  Future<void> _saveOrder(LanguageProvider language) async {
    if (!_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(language.getText('fixErrors')), backgroundColor: Colors.orangeAccent),
      );
      return;
    }
    if (_selectedDate == null || _selectedTransportMethod == null || _selectedPaymentMethod == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(language.getText('completeFields')), backgroundColor: Colors.orangeAccent),
      );
      return;
    }

    final model = GrowerModel(
      superTeaQuantity: double.tryParse(_superLeafController.text) ?? 0.0,
      greenTeaQuantity: double.tryParse(_greenLeafController.text) ?? 0.0,
      placeDate: _selectedDate!,
      transportMethod: _selectedTransportMethod!,
      paymentMethod: _selectedPaymentMethod!,
    );

    try {
      final response = await _apiHandler.getGrowerOrder(model);
      if (response.growerOrderId != null) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const GrowerOrderSavedPage()),
        );
      }
    } catch (_) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(language.getText('orderSaveFailed')), backgroundColor: Colors.red),
      );
    }
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex != index) setState(() => _bottomNavIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, language, theme, child) {
        return Scaffold(
          backgroundColor: const Color(0xFFF8FDEF),
          appBar: AppBar(
            backgroundColor: const Color(0xFFF8FDEF),
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios, color: Colors.black54),
              onPressed: () => Navigator.pop(context),
            ),
            title: Text(language.getText('growerOrderTitle'), style: const TextStyle(color: Colors.black54)),
            actions: [
              IconButton(
                icon: const Icon(Icons.settings_outlined, color: Colors.black54),
                onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(language.getText('settingsNotImplemented')), backgroundColor: Colors.grey),
                ),
              ),
            ],
          ),
          body: Form(
            key: _formKey,
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 15.0),
              child: Column(
                children: [
                  const SizedBox(height: 10),
                  _buildSectionLabel(language.getText('howManyKg')),
                  _buildTextField(
                    controller: _superLeafController,
                    hintText: language.getText('superLeafHint'),
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    validator: (v) => v == null || v.isEmpty ? language.getText('enterSuperLeaf') : null,
                  ),
                  const SizedBox(height: 15),
                  _buildTextField(
                    controller: _greenLeafController,
                    hintText: language.getText('greenLeafHint'),
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    validator: (v) => v == null || v.isEmpty ? language.getText('enterGreenLeaf') : null,
                  ),
                  const SizedBox(height: 25),
                  _buildSectionLabel(language.getText('dateYouCanGive')),
                  _buildDateField(context, language),
                  const SizedBox(height: 25),
                  _buildSectionLabel(language.getText('howToTransport')),
                  _buildDropdown(
                    hint: language.getText('selectMethod'),
                    value: _selectedTransportMethod,
                    items: _transportOptions.map(language.getText).toList(),
                    onChanged: (val) => setState(() => _selectedTransportMethod = val),
                    validator: (v) => v == null ? language.getText('pleaseSelectTransport') : null,
                  ),
                  const SizedBox(height: 25),
                  _buildSectionLabel(language.getText('paymentMethod')),
                  _buildDropdown(
                    hint: language.getText('selectMethod'),
                    value: _selectedPaymentMethod,
                    items: _paymentOptions.map(language.getText).toList(),
                    onChanged: (val) => setState(() => _selectedPaymentMethod = val),
                    validator: (v) => v == null ? language.getText('pleaseSelectPayment') : null,
                  ),
                  const SizedBox(height: 35),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => _saveOrder(language),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0a4e41),
                        padding: const EdgeInsets.symmetric(vertical: 15),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text(
                        language.getText('saveOrder'),
                        style: const TextStyle(fontSize: 18, color: Colors.white),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
          bottomNavigationBar: BottomNavigationBar(
            currentIndex: _bottomNavIndex,
            onTap: _onBottomNavTapped,
            backgroundColor: Colors.white,
            selectedItemColor: const Color(0xFF0a4e41),
            unselectedItemColor: Colors.grey,
            items: [
              BottomNavigationBarItem(icon: const Icon(Icons.home), label: language.getText('navHome')),
              BottomNavigationBarItem(icon: const Icon(Icons.list), label: language.getText('navOrders')),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSectionLabel(String text) => Padding(
        padding: const EdgeInsets.only(bottom: 8.0),
        child: Text(text, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17, color: Colors.black87)),
      );

  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    required TextInputType keyboardType,
    required String? Function(String?) validator,
  }) =>
      TextFormField(
        controller: controller,
        keyboardType: keyboardType,
        validator: validator,
        decoration: InputDecoration(
          hintText: hintText,
          fillColor: Colors.grey[100],
          filled: true,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.black54)),
          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF0a4e41), width: 2)),
        ),
      );

  Widget _buildDropdown({
    required String hint,
    required String? value,
    required List<String> items,
    required void Function(String?) onChanged,
    required String? Function(String?) validator,
  }) =>
      DropdownButtonFormField<String>(
        value: value,
        isExpanded: true,
        decoration: InputDecoration(filled: true, fillColor: const Color(0xFFDDF4DD), border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
        hint: Text(hint),
        items: items.map((val) => DropdownMenuItem(value: val, child: Text(val, style: const TextStyle(color: Colors.black87)))).toList(),
        onChanged: onChanged,
        validator: validator,
      );

  Widget _buildDateField(BuildContext context, LanguageProvider language) =>
      GestureDetector(
        onTap: () => _selectDate(context),
        child: AbsorbPointer(
          child: TextFormField(
            controller: _dateController,
            decoration: InputDecoration(
              hintText: language.getText('selectDate'),
              suffixIcon: const Icon(Icons.calendar_today),
              fillColor: Colors.grey[100],
              filled: true,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.black54)),
              focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF0a4e41), width: 2)),
            ),
            validator: (v) => v == null || v.isEmpty ? language.getText('pleasePickDate') : null,
          ),
        ),
      );
}
