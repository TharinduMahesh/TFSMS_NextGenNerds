import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:growersignup/sreens/grower/orders/locationsucesspage.dart';
import 'package:latlong2/latlong.dart' as latlng;
import 'package:http/http.dart' as http;

class GrowerLocationPage extends StatefulWidget {
  final String email;
  const GrowerLocationPage({super.key, required this.email});

  @override
  State<GrowerLocationPage> createState() => _GrowerLocationPageState();
}

class _GrowerLocationPageState extends State<GrowerLocationPage> {
  final _formKey = GlobalKey<FormState>();
  final _address1Controller = TextEditingController();
  final _address2Controller = TextEditingController();
  final _cityController = TextEditingController();
  final _postalCodeController = TextEditingController();

  Position? _liveLocationMarker;
  bool _showMap = false;
  bool _isFetchingLocation = false;

  @override
  void dispose() {
    _address1Controller.dispose();
    _address2Controller.dispose();
    _cityController.dispose();
    _postalCodeController.dispose();
    super.dispose();
  }

  Future<bool> _handleLocationPermission() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Location services are disabled.')),
      );
      return false;
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Location permissions are denied')),
        );
        return false;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Location permissions are permanently denied.')),
      );
      return false;
    }

    return true;
  }

  Future<void> _getCurrentLocation() async {
    final hasPermission = await _handleLocationPermission();
    if (!hasPermission) return;

    setState(() {
      _isFetchingLocation = true;
      _showMap = true;
    });

    try {
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.best,
      );

      print("LIVE GPS: ${position.latitude}, ${position.longitude}");

      setState(() {
        _liveLocationMarker = position;
      });

      List<Placemark> placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );
      if (placemarks.isNotEmpty) {
        final place = placemarks[0];
        setState(() {
          _address1Controller.text = place.street ?? '';
          _address2Controller.text = place.subLocality ?? '';
          _cityController.text = place.locality ?? '';
          _postalCodeController.text = place.postalCode ?? '';
        });
      }
    } catch (e) {
      print("LOCATION ERROR: $e");
    }

    setState(() {
      _isFetchingLocation = false;
    });
  }

  Future<void> _submitLocation() async {
    final locationData = {
      'email': widget.email,
      'address1': _address1Controller.text,
      'address2': _address2Controller.text,
      'city': _cityController.text,
      'postalCode': _postalCodeController.text,
      'latitude': _liveLocationMarker?.latitude.toString(),
      'longitude': _liveLocationMarker?.longitude.toString(),
    };

    print('Location Confirmed: $locationData');

    try {
      final response = await http.post(
        Uri.parse('http://localhost:7061/api/GrowerLocation'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(locationData),
      );

      if (response.statusCode == 200) {
        // ✅ Navigate to success page
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => LocationSuccessPage(email: widget.email)),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to save location: ${response.body}'), backgroundColor: Colors.redAccent),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e'), backgroundColor: Colors.redAccent),
      );
    }
  }

  void _confirmLocation() {
    if (_liveLocationMarker != null ||
        _address1Controller.text.isNotEmpty ||
        _cityController.text.isNotEmpty ||
        _postalCodeController.text.isNotEmpty) {
      _submitLocation();
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Please add current location or fill address fields')),
    );
  }

  Widget _buildLiveMap() {
    return Container(
      height: 200,
      margin: const EdgeInsets.symmetric(vertical: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20.0),
        boxShadow: [
          BoxShadow(color: Colors.grey.withOpacity(0.15), spreadRadius: 1, blurRadius: 8, offset: const Offset(0, 4)),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20.0),
        child: FlutterMap(
          options: MapOptions(
            initialCenter: _liveLocationMarker != null
                ? latlng.LatLng(_liveLocationMarker!.latitude, _liveLocationMarker!.longitude)
                : latlng.LatLng(0, 0),
            initialZoom: 16,
          ),
          children: [
            TileLayer(
              urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              subdomains: const ['a', 'b', 'c'],
            ),
            if (_liveLocationMarker != null)
              MarkerLayer(
                markers: [
                  Marker(
                    width: 40.0,
                    height: 40.0,
                    point: latlng.LatLng(_liveLocationMarker!.latitude, _liveLocationMarker!.longitude),
                    child: const Icon(Icons.location_pin, color: Colors.red, size: 35),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0),
      child: Text(text, style: const TextStyle(color: Colors.black87, fontWeight: FontWeight.w500, fontSize: 14)),
    );
  }

  Widget _buildTextField(TextEditingController controller, String hintText,
      {TextInputType keyboardType = TextInputType.text}) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      decoration: InputDecoration(
        hintText: hintText,
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: BorderSide(color: Colors.black54.withOpacity(0.5)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: BorderSide(color: Colors.black54.withOpacity(0.5)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: Color(0xFF0a4e41), width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(vertical: 14.0, horizontal: 15.0),
        isDense: true,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0FBEF),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF0FBEF),
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF333333)),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: Color(0xFF333333)),
            onPressed: () {},
          ),
          const SizedBox(width: 10),
        ],
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 15.0),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 30.0),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20.0),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.15),
                    spreadRadius: 1,
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Center(
                      child: Text(
                        'Your Location',
                        style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF0a4e41)),
                      ),
                    ),
                    const SizedBox(height: 25),
                    Center(
                      child: ElevatedButton.icon(
                        onPressed: _isFetchingLocation ? null : _getCurrentLocation,
                        icon: _isFetchingLocation
                            ? const SizedBox(
                                width: 18,
                                height: 18,
                                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black87))
                            : const Icon(Icons.location_pin, size: 20, color: Colors.black87),
                        label: Text(
                          _isFetchingLocation ? 'Fetching...' : 'Add Current Location',
                          style: const TextStyle(color: Colors.black87, fontWeight: FontWeight.w500),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFDDF4DD),
                          foregroundColor: Colors.black87,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30.0)),
                          padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 12),
                          elevation: 1,
                        ),
                      ),
                    ),
                    if (_showMap && _liveLocationMarker != null) _buildLiveMap(),
                    const SizedBox(height: 25),
                    Row(
                      children: [
                        const Expanded(child: Divider(thickness: 0.8)),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 12.0),
                          child: Text('or', style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
                        ),
                        const Expanded(child: Divider(thickness: 0.8)),
                      ],
                    ),
                    const SizedBox(height: 25),
                    _buildLabel('Address:'),
                    _buildTextField(_address1Controller, 'Address line 1'),
                    const SizedBox(height: 10),
                    _buildTextField(_address2Controller, 'Address line 2 (Optional)'),
                    const SizedBox(height: 10),
                    _buildTextField(_cityController, 'City'),
                    const SizedBox(height: 10),
                    _buildTextField(_postalCodeController, 'Postal code', keyboardType: TextInputType.number),
                    const SizedBox(height: 35),
                    Center(
                      child: ElevatedButton(
                        onPressed: _confirmLocation,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0a4e41),
                          foregroundColor: Colors.white,
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
    );
  }
}
