import 'package:flutter/material.dart';
import 'package:growersignup/sreens/Grower_notification_page.dart';
import 'package:growersignup/sreens/grower_order_page.dart';
import 'package:growersignup/sreens/grower_payment_page.dart';
class GrowerHomePage extends StatefulWidget {
  const GrowerHomePage({super.key});

  @override
  State<GrowerHomePage> createState() => _SupplierHomePageState();
}

class _SupplierHomePageState extends State<GrowerHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF8FFEA),
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
        floatingActionButton: FloatingActionButton(
          backgroundColor: Colors.white,
        onPressed: () {
                    Navigator.push(context, MaterialPageRoute(builder: (context) =>GrowerOrderPage()),);
                  },
        tooltip: 'Increment',
        child: const Icon(Icons.add,color: Colors.black,size: 35,),
      ),
      
      bottomNavigationBar: navigationBar(),
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
              Navigator.push(context, MaterialPageRoute(builder: (context) => GrowerPaymentsPage()),);
            }else{
              Navigator.push(context, MaterialPageRoute(builder: (context) => GrowerNotificationsPage()),);
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: Color(0xFFDCF4A6),
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
Widget navigationBar() {
  return BottomNavigationBar(
    type: BottomNavigationBarType.fixed,
    items: const <BottomNavigationBarItem>[
      BottomNavigationBarItem(
        icon: Icon(Icons.home),
        label: 'Home',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.notifications),
        label: 'Notifications',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.person),
        label: 'profile',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.contact_support),
        label: 'contact',
      ),   
    ],
    selectedItemColor: const Color.fromARGB(255, 0, 0, 0),
  );
}
