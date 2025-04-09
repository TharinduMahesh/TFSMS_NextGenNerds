import 'package:flutter/material.dart';
import 'package:test15/api_handler.dart';
import 'package:test15/model.dart';

class AddUser extends StatefulWidget {
  const AddUser({super.key});

  @override
  State<AddUser> createState() => _AddUserState();
}

class _AddUserState extends State<AddUser> {
  ApiHandler apiHandler = ApiHandler();

  final _formKey = GlobalKey<FormState>();

  String quantity = '';
  String transportmethod = '';
  String paymentmethod = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Add User"),
        centerTitle: true,
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                decoration: const InputDecoration(labelText: 'Quantity'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a quantity';
                  }
                  return null;
                },
                onSaved: (value) {
                  quantity = value!;
                },
              ),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Transport Method',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a transport method';
                  }
                  return null;
                },
                onSaved: (value) {
                  transportmethod = value!;
                },
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Payment Method'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a payment method';
                  }
                  return null;
                },
                onSaved: (value) {
                  paymentmethod = value!;
                },
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    _formKey.currentState!.save();
                    User user = User(
                      quantity: quantity,
                      transportmethod: transportmethod,
                      paymentmethod: paymentmethod,
                    );

                    apiHandler.getUserData(user).then((value) {
                      Navigator.pop(context);
                    });
                  }
                },
                child: const Text('Submit'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
