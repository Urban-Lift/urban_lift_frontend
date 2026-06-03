import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';

const _colors    = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Gold', 'Grey', 'Brown'];
const _amenities = [
  {'id': 'ac',      'label': 'A/C'},
  {'id': 'wifi',    'label': 'Wi-Fi'},
  {'id': 'music',   'label': 'Music'},
  {'id': 'luggage', 'label': 'Luggage space'},
  {'id': 'pet',     'label': 'Pet friendly'},
  {'id': 'silent',  'label': 'Quiet ride'},
];

class DriverVehicleScreen extends ConsumerStatefulWidget {
  const DriverVehicleScreen({super.key, this.driverData});
  final Map<String, dynamic>? driverData;

  @override
  ConsumerState<DriverVehicleScreen> createState() => _DriverVehicleScreenState();
}

class _DriverVehicleScreenState extends ConsumerState<DriverVehicleScreen> {
  final _formKey      = GlobalKey<FormState>();
  final _makeCtrl     = TextEditingController();
  final _modelCtrl    = TextEditingController();
  final _yearCtrl     = TextEditingController();
  final _plateCtrl    = TextEditingController();
  String _color       = '';
  int _seats          = 3;
  final List<String> _selectedAmenities = [];
  bool _loading       = false;

  @override
  void dispose() {
    _makeCtrl.dispose();
    _modelCtrl.dispose();
    _yearCtrl.dispose();
    _plateCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    if (_color.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a car color'), backgroundColor: AppColors.error),
      );
      return;
    }
    setState(() => _loading = true);
    try {
      final data = widget.driverData ?? {};
      final email = data['email'] as String?;
      await ref.read(authProvider.notifier).createDriverProfile(
        fullName:         data['fullName'] as String? ?? '',
        emergencyContact: data['emergencyContact'] as String? ?? '',
        email:            email,
      );
      if (!mounted) return;
      if (email != null && email.isNotEmpty) {
        await ref.read(authProvider.notifier).sendEmailCode(email);
        if (mounted) context.push('/auth/otp-email');
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Driver account created!'),
              backgroundColor: AppColors.primary,
            ),
          );
          context.go('/driver/home');
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16),
                IconButton(
                  onPressed: () => context.pop(),
                  icon: const Icon(Icons.arrow_back_ios_new_rounded),
                  style: IconButton.styleFrom(
                    backgroundColor: AppColors.surface,
                    foregroundColor: AppColors.dark,
                  ),
                ),
                const SizedBox(height: 24),

                // Progress dots
                Row(
                  children: [
                    _dot(true), const SizedBox(width: 6),
                    _dot(true), const SizedBox(width: 10),
                    const Text(
                      'Step 2 of 2',
                      style: TextStyle(fontSize: 12, color: AppColors.gray),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                const Text(
                  'Your vehicle',
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                    color: AppColors.dark,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Tell passengers about your car',
                  style: TextStyle(fontSize: 14, color: AppColors.gray),
                ),
                const SizedBox(height: 28),

                // Make & Model
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _makeCtrl,
                        textCapitalization: TextCapitalization.words,
                        decoration: const InputDecoration(labelText: 'Make', hintText: 'Toyota'),
                        validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter make' : null,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextFormField(
                        controller: _modelCtrl,
                        textCapitalization: TextCapitalization.words,
                        decoration: const InputDecoration(labelText: 'Model', hintText: 'Corolla'),
                        validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter model' : null,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Year & Seats
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _yearCtrl,
                        keyboardType: TextInputType.number,
                        maxLength: 4,
                        decoration: const InputDecoration(
                          labelText: 'Year',
                          hintText: '2019',
                          counterText: '',
                        ),
                        validator: (v) {
                          if (v == null || v.length != 4) return 'Enter year';
                          final y = int.tryParse(v);
                          if (y == null || y < 2000 || y > DateTime.now().year + 1) return 'Invalid year';
                          return null;
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Available Seats',
                            style: TextStyle(fontSize: 14, color: AppColors.gray),
                          ),
                          const SizedBox(height: 6),
                          DropdownButtonFormField<int>(
                            initialValue: _seats,
                            decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 14)),
                            items: List.generate(6, (i) => i + 1)
                                .map((n) => DropdownMenuItem(value: n, child: Text('$n seat${n > 1 ? 's' : ''}')))
                                .toList(),
                            onChanged: (v) => setState(() => _seats = v ?? 3),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Color picker
                const Text(
                  'Car Color',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.dark,
                  ),
                ),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _colors.map((c) {
                    final selected = _color == c;
                    return GestureDetector(
                      onTap: () => setState(() => _color = c),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 150),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: selected ? AppColors.primary : Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: selected ? AppColors.primary : AppColors.border,
                          ),
                        ),
                        child: Text(
                          c,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: selected ? Colors.white : AppColors.gray,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 20),

                // License plate
                TextFormField(
                  controller: _plateCtrl,
                  textCapitalization: TextCapitalization.characters,
                  decoration: const InputDecoration(
                    labelText: 'License Plate',
                    hintText: 'GR-1234-21',
                  ),
                  validator: (v) {
                    if (v == null || v.trim().length < 4) return 'Enter license plate';
                    return null;
                  },
                ),
                const SizedBox(height: 20),

                // Amenities
                const Text(
                  'Amenities (optional)',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.dark,
                  ),
                ),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _amenities.map((a) {
                    final id     = a['id']!;
                    final label  = a['label']!;
                    final active = _selectedAmenities.contains(id);
                    return GestureDetector(
                      onTap: () => setState(() {
                        if (active) {
                          _selectedAmenities.remove(id);
                        } else {
                          _selectedAmenities.add(id);
                        }
                      }),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 150),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: active ? AppColors.primaryLight : Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: active ? AppColors.primary : AppColors.border,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            if (active) ...[
                              const Icon(Icons.check_rounded, size: 14, color: AppColors.primary),
                              const SizedBox(width: 4),
                            ],
                            Text(
                              label,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                color: active ? AppColors.primary : AppColors.gray,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 40),

                ULButton(
                  label: 'Create Driver Account',
                  loading: _loading,
                  onPressed: _submit,
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _dot(bool active) => AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: active ? 28 : 10,
        height: 6,
        decoration: BoxDecoration(
          color: active ? AppColors.primary : AppColors.border,
          borderRadius: BorderRadius.circular(3),
        ),
      );
}
