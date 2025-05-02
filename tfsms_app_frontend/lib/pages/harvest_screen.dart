import 'package:flutter/material.dart';

class HarvestScreen extends StatelessWidget {
  const HarvestScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          ElevatedButton(
            onPressed: () {
              Navigator.pushNamed(context, '/form');
            },
            child: const Text('Add Harvest Details'),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              Navigator.pushNamed(context, '/home-weighing');
            },
            child: const Text('Weighing Details'),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              Navigator.pushNamed(context, '/report');
            },
            child: const Text('Weighing report'),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              Navigator.pushNamed(context, '/request');
            },
            child: const Text('order request'),
          ),
        ],
      ),
    );
  }
}
