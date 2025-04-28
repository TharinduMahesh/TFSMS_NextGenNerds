import 'package:flutter/material.dart';
import 'package:goo/pages/constant.dart';
import 'package:goo/pages/notifications_page.dart';
import 'package:goo/pages/payments_page.dart';

class SupplierHomePage extends StatefulWidget {
  const SupplierHomePage({super.key});

  @override
  State<SupplierHomePage> createState() => _SupplierHomePageState();
}

class _SupplierHomePageState extends State<SupplierHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kbackgroundcolor,
      body: SafeArea(
        child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                const SizedBox(height: 50),
                Text(
                  "Home Page",
                  style: TextStyle(
                      fontSize: 35,
                      fontWeight: FontWeight.bold,
                      color: const Color.fromARGB(255, 0, 0, 0)),
                  textAlign: TextAlign.center,
                ),
                Text(
                  "Supplier",
                  style: TextStyle(
                      fontSize: 35,
                      fontWeight: FontWeight.bold,
                      color: const Color.fromARGB(255, 0, 0, 0)),
                  textAlign: TextAlign.center,
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 50),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,                
                    children: [
                      const SizedBox(height: 300),
                      suppilerSelections(context, "Harvest"),
                      const SizedBox(height: 20),
                      suppilerSelections(context, "Payments"),                     
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      //   floatingActionButton: FloatingActionButton(
      //     backgroundColor: Colors.white,
      //   onPressed: () {
      //               Navigator.push(context, MaterialPageRoute(builder: (context) => HarvestPage()),);
      //             },
      //   tooltip: 'Increment',
      //   child: const Icon(Icons.add,color: Colors.black,size: 35,),
      // ),
      
      // bottomNavigationBar: navigationBar(),
    );
  }
}

Widget suppilerSelections(BuildContext context, String title) {
  return Column(
    children: [
      SizedBox(
        child: ElevatedButton(
          onPressed: () {
            if(title == "Payments"){
              Navigator.push(context, MaterialPageRoute(builder: (context) => PaymentsPage()),);
            }else{
              Navigator.push(context, MaterialPageRoute(builder: (context) => NotificationsPage()),);
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: kdefaultselector,
            padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 20),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(25),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                title,
                style: TextStyle(fontSize: 28, color: Colors.black),
              ),
              SizedBox(width: 50),
              Icon(Icons.arrow_forward_ios, color: Colors.black),
            ],
          ),
        ),
      ),
    ],
  );
}