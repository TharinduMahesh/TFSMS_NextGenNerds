import 'package:flutter/material.dart';
import 'package:growersignup/models/grower_Account.dart';
import 'package:growersignup/services/grower_create_api.dart';
import 'package:growersignup/sreens/grower_account_edit_page.dart';

class GrowerAccountDetailsPage extends StatefulWidget {
  final int growerId;

  const GrowerAccountDetailsPage({Key? key, required this.growerId})
    : super(key: key);

  @override
  State<GrowerAccountDetailsPage> createState() => _GrowerDetailPageState();
}

class _GrowerDetailPageState extends State<GrowerAccountDetailsPage> {
  GrowerAccountModel? _grower;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchGrowerData();
  }

  Future<void> fetchGrowerData() async {
    try {
      final service = GrowerCreateApi();
      final grower = await service.getGrowerAccountById(widget.growerId);

      if (grower != null) {
        debugPrint('Grower data loaded: ${grower.toJson()}');
      } else {
        debugPrint('Grower is null for ID ${widget.growerId}');
      }

      setState(() {
        _grower = grower;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching grower data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Grower Details'),
        centerTitle: true,
        backgroundColor: const Color(0xFF0a4e41),
        actions: [
          IconButton(
            icon: const Icon(
              Icons.edit,
              color: Color.fromARGB(26, 251, 249, 249),
            ),
            onPressed: () {
              if (_grower != null) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder:
                        (context) => GrowerAccountEditPage(grower: _grower!),
                  ),
                ).then((_) {
                  // Refresh the data when coming back
                  fetchGrowerData();
                });
              }
            },
          ),
        ],
      ),

      body:
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _grower == null
              ? const Center(child: Text('Grower not found'))
              : Container(
                color: const Color(0xFFF8FFEA),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      // Highlighted Grower Name Card
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(16.0),
                        decoration: BoxDecoration(
                          color: const Color(0xFFDCF4A6),
                          borderRadius: BorderRadius.circular(15.0),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            const Text(
                              "Grower Name",
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              '${_grower!.GrowerFirstName} ${_grower!.GrowerLastName}',
                              style: const TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Expanded Detail List
                      Expanded(
                        child: ListView(
                          children: [
                            growerDetailTile('NIC', _grower!.GrowerNIC),
                            growerDetailTile(
                              'DOB',
                              _grower!.GrowerDOB.toLocal().toString().split(
                                ' ',
                              )[0],
                            ),
                            growerDetailTile('Gender', _grower!.GrowerGender),
                            growerDetailTile('Phone', _grower!.GrowerPhoneNum),
                            growerDetailTile('Email', _grower!.GrowerEmail),
                            growerDetailTile(
                              'Address Line 1',
                              _grower!.GrowerAddressLine1,
                            ),
                            growerDetailTile(
                              'Address Line 2',
                              _grower!.GrowerAddressLine2,
                            ),
                            growerDetailTile('City', _grower!.GrowerCity),
                            growerDetailTile(
                              'Postal Code',
                              _grower!.GrowerPostalCode,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
    );
  }

  Widget growerDetailTile(String title, String value) {
    return Card(
      elevation: 3,
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
      child: ListTile(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(value.isNotEmpty ? value : 'N/A'),
      ),
    );
  }
}
