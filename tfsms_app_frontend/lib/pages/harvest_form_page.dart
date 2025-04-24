import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/harvest_entity.dart';
import '../services/api_handler.dart';
import 'confirmation_page.dart';

class HarvestFormPage extends StatefulWidget {
  @override
  _HarvestFormPageState createState() => _HarvestFormPageState();
}

class _HarvestFormPageState extends State<HarvestFormPage> {
  DateTime? selectedDate;
  final _superLeafController = TextEditingController();
  final _normalLeafController = TextEditingController();
  String transportMethod = 'By Collector';
  String paymentMethod = 'Cash';

  void _pickDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );
    if (picked != null) {
      setState(() {
        selectedDate = picked;
      });
    }
  }

  void _saveData() async {
    if (selectedDate == null ||
        _superLeafController.text.isEmpty ||
        _normalLeafController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please fill all fields")),
      );
      return;
    }

    HarvestEntity harvest = HarvestEntity(
      date: selectedDate!,
      superLeafWeight: double.parse(_superLeafController.text),
      normalLeafWeight: double.parse(_normalLeafController.text),
      transportMethod: transportMethod,
      paymentMethod: paymentMethod,
    );

    bool success = await ApiHandler.saveHarvest(harvest);
    if (success) {
      Navigator.push(context, MaterialPageRoute(builder: (_) => ConfirmationPage()));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to save. Try again.")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xF3FAFFEC),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: ListView(
            children: [
              const SizedBox(height: 20),
              Text("Date you can give harvest:"),
              GestureDetector(
                onTap: _pickDate,
                child: AbsorbPointer(
                  child: TextFormField(
                    decoration: InputDecoration(
                      hintText: 'Year/Month/Date',
                      suffixIcon: Icon(Icons.calendar_today),
                      border: OutlineInputBorder(),
                    ),
                    controller: TextEditingController(
                      text: selectedDate != null
                          ? DateFormat('yyyy/MM/dd').format(selectedDate!)
                          : '',
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Text("Supper Leaf Weight(kg):"),
              TextField(
                controller: _superLeafController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  hintText: '20kg',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 10),
              Text("Normal Leaf Weight(kg):"),
              TextField(
                controller: _normalLeafController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  hintText: '20kg',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 20),
              Text("How to transport:"),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => setState(() => transportMethod = 'By Collector'),
                      child: Text("By Collector"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: transportMethod == 'By Collector'
                            ? Colors.lightGreen
                            : Colors.grey[300],
                      ),
                    ),
                  ),
                  SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => setState(() => transportMethod = 'By own'),
                      child: Text("By own"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: transportMethod == 'By own'
                            ? Colors.lightGreen
                            : Colors.grey[300],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Text("Payment method:"),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => setState(() => paymentMethod = 'Cash'),
                      child: Text("Cash"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: paymentMethod == 'Cash'
                            ? Colors.lightGreen
                            : Colors.grey[300],
                      ),
                    ),
                  ),
                  SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => setState(() => paymentMethod = 'Bank'),
                      child: Text("Bank"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: paymentMethod == 'Bank'
                            ? Colors.lightGreen
                            : Colors.grey[300],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 30),
              ElevatedButton(
                onPressed: _saveData,
                child: Text("Save", style: TextStyle(color: Colors.white)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green[900],
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: "Home"),
          BottomNavigationBarItem(icon: Icon(Icons.notifications), label: "Notification"),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: "Profile"),
          BottomNavigationBarItem(icon: Icon(Icons.star_border), label: "Contact us"),
        ],
      ),
    );
  }
}
