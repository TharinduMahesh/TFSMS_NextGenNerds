import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // For input formatters
import 'package:geolocator/geolocator.dart'; // Import geolocator
import 'package:geocoding/geocoding.dart';
import 'package:growersignup/sreens/grower/login/grower_account_success_pade.dart'; // Import geocoding (optional)

class GrowerLocationPage extends StatefulWidget {
  final String email; // Optional, if you need to pass email or other data
  const GrowerLocationPage({super.key, required this.email});

  @override
  State<GrowerLocationPage> createState() => _GrowerLocationPageState();
}

class _GrowerLocationPageState extends State<GrowerLocationPage> {
  final _formKey = GlobalKey<FormState>();
  int _bottomNavIndex = 0; // Home selected

  // Controllers
  final _address1Controller = TextEditingController();
  final _address2Controller = TextEditingController();
  final _cityController = TextEditingController();
  final _postalCodeController = TextEditingController();

  // State for location fetching
  bool _isFetchingLocation = false;
  String? _locationError;
  Position? _currentPosition; // Store fetched position if needed later
  Placemark? _currentPlacemark; // Store fetched address details if needed

  // --- Define Colors (estimated) ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color cardBackgroundColor = Colors.white;
  static const Color titleColor = Color(0xFF0a4e41);
  static const Color labelColor = Colors.black87;
  static const Color inputBorderColor = Colors.black54;
  static const Color focusedInputBorderColor = titleColor;
  static const Color buttonColor = Color(0xFF0a4e41);
  static const Color buttonTextColor = Colors.white;
  static const Color locationButtonBgColor = Color(0xFFDDF4DD); // Light green location button
  static const Color locationButtonTextColor = Colors.black87;
  static const Color appBarIconsColor = Color(0xFF333333);
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = buttonColor;
  static const Color bottomNavBarUnselectedColor = Colors.grey;
  // --- End Colors ---


  @override
  void dispose() {
    // Dispose controllers
    _address1Controller.dispose();
    _address2Controller.dispose();
    _cityController.dispose();
    _postalCodeController.dispose();
    super.dispose();
  }

  // --- Location Logic ---

  Future<bool> _handleLocationPermission() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Text('Location services are disabled. Please enable the services')));
      }
      return false;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Location permissions are denied')));
        }
        return false;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Text('Location permissions are permanently denied, we cannot request permissions.')));
      }
       // TODO: Optionally guide user to app settings
      return false;
    }

    return true;
  }

  Future<void> _getCurrentLocation() async {
    setState(() {
      _isFetchingLocation = true;
      _locationError = null;
      // Clear manual fields when fetching current location
      _address1Controller.clear();
      _address2Controller.clear();
      _cityController.clear();
      _postalCodeController.clear();
      _formKey.currentState?.reset(); // Reset validation state
    });

    final hasPermission = await _handleLocationPermission();
    if (!hasPermission) {
      setState(() => _isFetchingLocation = false);
      return;
    }

    try {
      Position position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high);
      setState(() => _currentPosition = position);
      await _getAddressFromCoordinates(position);
    } catch (e) {
      print("Error getting location: $e");
      setState(() => _locationError = "Could not get location. Please try again.");
    } finally {
      setState(() => _isFetchingLocation = false);
    }
  }

  // Optional: Use geocoding to fill address fields
  Future<void> _getAddressFromCoordinates(Position position) async {
    try {
      List<Placemark> placemarks = await placemarkFromCoordinates(
          position.latitude, position.longitude);

      if (placemarks.isNotEmpty && mounted) {
        Placemark place = placemarks[0];
        setState(() {
          _currentPlacemark = place; // Store the full placemark if needed
          _address1Controller.text = '${place.street ?? ''}';
          _address2Controller.text = '${place.subLocality ?? ''}'; // Or subAdministrativeArea etc.
          _cityController.text = place.locality ?? '';
          _postalCodeController.text = place.postalCode ?? '';
          _locationError = null; // Clear previous errors
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
             const SnackBar(content: Text('Address fields populated!'), backgroundColor: Colors.green)
           );
        }
      } else {
         setState(() => _locationError = "Could not determine address from location.");
      }
    } catch (e) {
       print("Error getting address: $e");
       setState(() => _locationError = "Error fetching address details.");
    }
  }

  // --- Button Actions ---
  void _confirmLocation() {
    String address1, address2, city, postalCode;
    String? latitude, longitude;

    if (_currentPosition != null && _address1Controller.text.isNotEmpty) {
       // Assume location was fetched and potentially edited/confirmed
       print("Confirming fetched location (potentially edited)");
       address1 = _address1Controller.text;
       address2 = _address2Controller.text;
       city = _cityController.text;
       postalCode = _postalCodeController.text;
       latitude = _currentPosition!.latitude.toString();
       longitude = _currentPosition!.longitude.toString();
    } else if (_formKey.currentState!.validate()) {
       // Manual address entry validation passed
       print("Confirming manually entered location");
       address1 = _address1Controller.text;
       address2 = _address2Controller.text;
       city = _cityController.text;
       postalCode = _postalCodeController.text;
       // Lat/Lon would be null here unless you geocode the manual address
    } else {
        // Validation failed for manual entry, and no current location used
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please fill the address fields or add current location'), backgroundColor: Colors.orangeAccent),
        );
       return;
    }

     // Prepare data for API
      final locationData = {
        'address1': address1,
        'address2': address2.isNotEmpty ? address2 : null,
        'city': city,
        'postalCode': postalCode,
        'latitude': latitude, // Will be null if entered manually
        'longitude': longitude, // Will be null if entered manually
      };
       locationData.removeWhere((key, value) => value == null); // Clean up nulls

      print("--- Confirming Location Data ---");
      print(locationData);
      print("------------------------------");

      // *** TODO: Implement API Call to save location data ***
      /*
      try {
          // await ApiService().saveUserLocation(locationData);
           ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Location saved successfully!'), backgroundColor: Colors.green),
           );
           Navigator.of(context).pop(locationData); // Optionally pop with data

       } catch (e) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Failed to save location: $e'), backgroundColor: Colors.redAccent),
           );
       }
      */

       // Placeholder success
        ScaffoldMessenger.of(context).showSnackBar(
         const SnackBar(content: Text('Location Confirmed (Simulated)!'), backgroundColor: Colors.green),
       );
        Navigator.of(context).pop(locationData); // Example: Pop with data

        // Navigator.push(context, MaterialPageRoute(builder: (context) => GrowerSignInSuccessPage(email: widget.email)));

  }

  void _openSettings() {
     print('Settings icon tapped');
     ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Settings not implemented yet'), backgroundColor: Colors.grey),
      );
  }

  // --- Bottom Nav Logic ---
   void _onBottomNavTapped(int index) {
     if (_bottomNavIndex == index) return;
     setState(() => _bottomNavIndex = index);
     // TODO: Implement navigation based on index
     print("Bottom Nav Tapped: $index");
   }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: pageBackgroundColor,
      appBar: AppBar(
        backgroundColor: pageBackgroundColor, elevation: 0, centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: appBarIconsColor),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: appBarIconsColor),
            onPressed: _openSettings,
          ),
          const SizedBox(width: 10),
        ],
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
             padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 15.0),
             child: Container( // White Card Container
                padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 30.0),
                decoration: BoxDecoration(
                  color: cardBackgroundColor, borderRadius: BorderRadius.circular(20.0),
                  boxShadow: [
                     BoxShadow(color: Colors.grey.withOpacity(0.15), spreadRadius: 1, blurRadius: 8, offset: const Offset(0, 4)),
                  ],
                ),
                child: Form(
                   key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Title
                      const Center(
                        child: Text(
                           'Your Location',
                           style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: titleColor),
                         ),
                      ),
                      const SizedBox(height: 25),

                      // Add Current Location Button
                      Center(
                        child: ElevatedButton.icon(
                          onPressed: _isFetchingLocation ? null : _getCurrentLocation, // Disable while fetching
                          icon: _isFetchingLocation
                              ? Container( // Show progress indicator instead of icon
                                   width: 18, height: 18, margin: const EdgeInsets.only(right: 8),
                                   child: const CircularProgressIndicator(strokeWidth: 2, color: locationButtonTextColor))
                              : const Icon(Icons.location_pin, size: 20, color: Colors.black87),
                          label: Text(
                             _isFetchingLocation ? 'Fetching...' : 'Add Current Location',
                            style: const TextStyle(color: locationButtonTextColor, fontWeight: FontWeight.w500),
                          ),
                          style: ElevatedButton.styleFrom(
                             backgroundColor: locationButtonBgColor,
                             foregroundColor: locationButtonTextColor, // For ripple effect
                             shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30.0)),
                             padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 12),
                             elevation: 1,
                          ),
                        ),
                      ),
                       if (_locationError != null) // Show error if location fetch failed
                          Padding(
                            padding: const EdgeInsets.only(top: 8.0),
                            child: Center(child: Text(_locationError!, style: const TextStyle(color: Colors.redAccent, fontSize: 12))),
                          ),
                      const SizedBox(height: 25),

                      // "or" Separator
                      _buildOrSeparator(),
                       const SizedBox(height: 25),

                      // Manual Address Form
                      _buildLabel('Address:'),
                       _buildTextField(controller: _address1Controller, hintText: 'Address line 1', validator: _manualAddressValidator),
                       const SizedBox(height: 10),
                       _buildTextField(controller: _address2Controller, hintText: 'Address line 2 (Optional)'), // Optional field
                       const SizedBox(height: 10),
                       _buildTextField(controller: _cityController, hintText: 'City', validator: _manualAddressValidator),
                       const SizedBox(height: 10),
                       _buildTextField(controller: _postalCodeController, hintText: 'Postal code', keyboardType: TextInputType.number, validator: _manualAddressValidator),
                       const SizedBox(height: 35),

                       // Confirm Button
                       Center(
                         child: ElevatedButton(
                            onPressed: _confirmLocation,
                            style: ElevatedButton.styleFrom(
                               backgroundColor: buttonColor, foregroundColor: buttonTextColor,
                               minimumSize: const Size(double.infinity, 50),
                               shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30.0)),
                               elevation: 2,
                            ),
                            child: const Text('Confirm', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                          ),
                       ),
                       const SizedBox(height: 10),

                    ],
                  ),
                ),
             ),
          ),
        ),
      ),
       bottomNavigationBar: BottomNavigationBar(
         type: BottomNavigationBarType.fixed, backgroundColor: bottomNavBarBackground,
         selectedItemColor: bottomNavBarSelectedColor, unselectedItemColor: bottomNavBarUnselectedColor,
         currentIndex: _bottomNavIndex, onTap: _onBottomNavTapped,
         selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
         unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
         items: const [
            BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
            BottomNavigationBarItem(icon: Icon(Icons.notifications_outlined), activeIcon: Icon(Icons.notifications), label: 'Notification'),
            BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
            BottomNavigationBarItem(icon: Icon(Icons.star_outline), activeIcon: Icon(Icons.star), label: 'Contact us'),
         ],
       ),
    );
  }

  // --- Helper Widgets ---

  // Validator for manual address fields (only required if no current location was successfully fetched and populated)
  String? _manualAddressValidator(String? value) {
     // If current location was successfully added OR user hasn't typed anything yet, skip validation
     if ((_currentPosition != null && _address1Controller.text.isNotEmpty) || value == null || value.isEmpty) {
         return null;
     }
     // Only return error if manual input is attempted but left empty *after* clearing potential current loc
      if (_currentPosition == null && value.isEmpty) {
          return 'Required if not using current location';
      }
      // You could add specific format validation here too
     return null;
   }

   Widget _buildLabel(String text) {
     return Padding(
       padding: const EdgeInsets.only(bottom: 6.0),
       child: Text(text, style: const TextStyle(color: labelColor, fontWeight: FontWeight.w500, fontSize: 14)),
     );
   }

   Widget _buildTextField({
     required TextEditingController controller, required String hintText,
     TextInputType keyboardType = TextInputType.text,
     String? Function(String?)? validator,
   }) {
     return TextFormField(
       controller: controller, keyboardType: keyboardType,
       decoration: InputDecoration(
         hintText: hintText, hintStyle: TextStyle(color: Colors.grey[500], fontSize: 14),
         filled: true, fillColor: Colors.white,
         border: OutlineInputBorder(
           borderRadius: BorderRadius.circular(12.0), borderSide: BorderSide(color: inputBorderColor.withOpacity(0.5)),
         ),
         enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12.0), borderSide: BorderSide(color: inputBorderColor.withOpacity(0.5)),
         ),
         focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: focusedInputBorderColor, width: 1.5),
         ),
         errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: Colors.redAccent, width: 1.0),
         ),
         focusedErrorBorder: OutlineInputBorder(
           borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: Colors.redAccent, width: 1.5),
         ),
         contentPadding: const EdgeInsets.symmetric(vertical: 14.0, horizontal: 15.0),
         isDense: true,
       ),
       validator: validator,
       autovalidateMode: AutovalidateMode.onUserInteraction,
       // When user starts typing in manual fields, clear the fetched location state
       onChanged: (value) {
          if (_currentPosition != null || _currentPlacemark != null) {
              setState(() {
                  _currentPosition = null;
                  _currentPlacemark = null;
              });
          }
       },
     );
   }

   Widget _buildOrSeparator() {
     return Row(
       children: [
         const Expanded(child: Divider(thickness: 0.8)),
         Padding(
           padding: const EdgeInsets.symmetric(horizontal: 12.0),
           child: Text('or', style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
         ),
         const Expanded(child: Divider(thickness: 0.8)),
       ],
     );
   }
}