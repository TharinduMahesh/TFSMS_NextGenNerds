import 'package:flutter/material.dart';
import '../models/harvest.dart';
import '../services/api_service.dart';

class HarvestScreen extends StatefulWidget {
  @override
  _HarvestScreenState createState() => _HarvestScreenState();
}

class _HarvestScreenState extends State<HarvestScreen> {
  final TextEditingController weightController = TextEditingController();
  DateTime selectedDate = DateTime.now();
  String transportMethod = "Seller";
  String paymentMethod = "Cash";

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime(2100),
    );
    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
      });
    }
  }

  void _submitData() async {
    if (weightController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please enter the weight")),
      );
      return;
    }

    Harvest harvest = Harvest(
      weight: weightController.text,
      harvestDate: selectedDate.toIso8601String(),
      transportMethod: transportMethod,
      paymentMethod: paymentMethod,
    );

    try {
      await ApiService.addHarvest(harvest);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Harvest data submitted!")),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to submit data")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Harvest Data")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("How many (kg):"),
            TextField(
              controller: weightController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                hintText: "Enter weight in kg",
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 10),
            
            Text("Date you can give harvest:"),
            Row(
              children: [
                Text("${selectedDate.year}/${selectedDate.month}/${selectedDate.day}"),
                IconButton(
                  icon: Icon(Icons.calendar_today),
                  onPressed: () => _selectDate(context),
                ),
              ],
            ),

            SizedBox(height: 10),
            Text("How to transport:"),
            DropdownButton<String>(
              value: transportMethod,
              items: ["Seller", "By own"].map((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
              onChanged: (newValue) {
                setState(() {
                  transportMethod = newValue!;
                });
              },
            ),

            SizedBox(height: 10),
            Text("Payment method:"),
            DropdownButton<String>(
              value: paymentMethod,
              items: ["Cash", "Bank"].map((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
              onChanged: (newValue) {
                setState(() {
                  paymentMethod = newValue!;
                });
              },
            ),

            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _submitData,
              child: Text("Submit"),
            ),
          ],
        ),
      ),
    );
  }
}
