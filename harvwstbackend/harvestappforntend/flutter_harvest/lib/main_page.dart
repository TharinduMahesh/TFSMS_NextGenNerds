import 'package:flutter/material.dart';
import 'package:flutter_harvest/api_handler.dart';
import 'package:intl/intl.dart';

class MainPage extends StatefulWidget {
  const MainPage({super.key});

  @override
  State<MainPage> createState() => MainPageState();
}

class MainPageState extends State<MainPage> {
   ApiHandlers apiHandler = ApiHandlers();
  final TextEditingController _dateController = TextEditingController();
  final TextEditingController _superLeafController = TextEditingController();
  final TextEditingController _normalLeafController = TextEditingController();

  String selectedTransport = "By Collector";
  String selectedPayment = "Cash";

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2101),
    );
    if (picked != null) {
      setState(() {
        _dateController.text = DateFormat('yyyy/MM/dd').format(picked);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FFE5),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(30),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("Date you can give harvest:"),
              const SizedBox(height: 5),
              TextField(
                controller: _dateController,
                readOnly: true,
                decoration: InputDecoration(
                  hintText: "Year/Mon/Date",
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.calendar_today),
                    onPressed: () => _selectDate(context),
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              const Text("Supper Leaf Weight(kg):"),
              const SizedBox(height: 5),
              TextField(
                controller: _superLeafController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  hintText: "20kg",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              const Text("Normal Leaf Weight(kg):"),
              const SizedBox(height: 5),
              TextField(
                controller: _normalLeafController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  hintText: "20kg",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              const Text("How to transport:"),
              const SizedBox(height: 5),
              DropdownButtonFormField<String>(
                value: selectedTransport,
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
                items: ["By Collector", "By own"]
                    .map((option) => DropdownMenuItem(
                          value: option,
                          child: Text(option),
                        ))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    selectedTransport = value!;
                  });
                },
              ),
              const SizedBox(height: 20),
              const Text("Payment method:"),
              const SizedBox(height: 5),
              DropdownButtonFormField<String>(
                value: selectedPayment,
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
                items: ["Cash", "Bank"]
                    .map((option) => DropdownMenuItem(
                          value: option,
                          child: Text(option),
                        ))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    selectedPayment = value!;
                  });
                },
              ),
              const SizedBox(height: 30),
              Center(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green.shade900,
                    foregroundColor: Colors.white,
                    padding:
                        const EdgeInsets.symmetric(horizontal: 80, vertical: 15),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                    elevation: 5,
                  ),
                  onPressed: () {
                    // Handle save logic here
                    debugPrint("Saving data...");
                    debugPrint("Date: ${_dateController.text}");
                    debugPrint("Supper Leaf: ${_superLeafController.text}");
                    debugPrint("Normal Leaf: ${_normalLeafController.text}");
                    debugPrint("Transport: $selectedTransport");
                    debugPrint("Payment: $selectedPayment");
                  },
                  child: const Text("Save", style: TextStyle(fontSize: 18)),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.notifications_none),
            label: 'Notification',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: 'Profile',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.star_border),
            label: 'Contact us',
          ),
        ],
        selectedItemColor: Colors.green.shade800,
        unselectedItemColor: Colors.black54,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}


