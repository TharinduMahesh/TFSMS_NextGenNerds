import 'package:flutter/material.dart';
import 'package:goo/pages/constant.dart';

class HarvestPage extends StatefulWidget {
  const HarvestPage({super.key});

  @override
  State<HarvestPage> createState() => HarvestPageState();
}

class HarvestPageState extends State<HarvestPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFDCF4A6),
      appBar: AppBar(
        backgroundColor: Color.fromARGB(255, 255, 255, 255),
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.settings, color: Colors.black),
            onPressed: () {
              // Navigate to settings page
            },
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
        child: Center(
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              color: Color.fromARGB(255, 255, 255, 255),
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  userOrder(),
                  const SizedBox(height: 25),
                  userselections(),
                ],
              ),
            ),
          ),
        ),
      ),
      bottomNavigationBar: navigationBar(),
    );
  }
}

Widget userOrder() {
  return Padding(
    padding: EdgeInsets.all(10),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text('How Many (kg) : ',style: TextStyle(fontWeight: FontWeight.w500),),
      const SizedBox(height: 10),
      TextField(
        decoration: InputDecoration(
          hintText: 'Enter the amount of harvest',
          border: OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(10)),
          ),
          filled: true,
          fillColor: Colors.white,
        ),
      ),
      const SizedBox(height: 25),
      Text('Date you can give harvest : ',style: TextStyle(fontWeight: FontWeight.w500),),
      const SizedBox(height: 10),
      TextField(
        decoration: InputDecoration(
          hintText: 'Enter the Date',
          border: OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(10)),
          ),
          filled: true,
          fillColor: Colors.white,
        ),
      ),
    ]),
  );
}

Widget userselections() {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('How to transport:',style: TextStyle(fontWeight: FontWeight.w500),),
      const SizedBox(height: 10),
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [buildButton("Seller"), buildButton("By own")],
      ),
      const SizedBox(height: 25),
      Text('Payment Method :',style: TextStyle(fontWeight: FontWeight.w500), ),
      const SizedBox(height: 10),
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          buildButton("Cash"),
          buildButton("Bank"),
        ],
      ),
    ],
  );
}

Widget buildButton(String text) {
  return Padding(
    padding: const EdgeInsets.all(4),
    child: ElevatedButton(
      onPressed: () {
        // Handle button press
      },
      style: ElevatedButton.styleFrom(
          backgroundColor: Color(0xFFDCF4A6),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(22),
          ),
          minimumSize: Size(264, 42)),
      child: Text(
        text,
        style: TextStyle(color: Colors.black),
      ),
    ),
  );
}


