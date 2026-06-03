import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/profile_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';
import '../../../../shared/constants/app_constants.dart';

class SavedRoutesScreen extends ConsumerStatefulWidget {
  const SavedRoutesScreen({super.key});

  @override
  ConsumerState<SavedRoutesScreen> createState() => _SavedRoutesScreenState();
}

class _SavedRoutesScreenState extends ConsumerState<SavedRoutesScreen> {
  bool _adding = false;
  String _pickup = '';
  String _dropoff = '';
  final _labelCtrl = TextEditingController();
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(profileProvider.notifier).loadRoutes());
  }

  @override
  void dispose() {
    _labelCtrl.dispose();
    super.dispose();
  }

  Future<void> _add() async {
    if (_pickup.isEmpty || _dropoff.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Select pickup and destination')),
      );
      return;
    }
    if (_pickup == _dropoff) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Pickup and destination must differ')),
      );
      return;
    }
    setState(() => _saving = true);
    final ok = await ref.read(profileProvider.notifier).addRoute(
      _pickup, _dropoff, label: _labelCtrl.text.trim().isEmpty ? null : _labelCtrl.text.trim(),
    );
    setState(() { _saving = false; if (ok) { _adding = false; _pickup = ''; _dropoff = ''; _labelCtrl.clear(); } });
    if (ok && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Route saved!'), backgroundColor: AppColors.primary),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(profileProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          onPressed: () => context.pop(),
        ),
        title: const Text('Saved Routes',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 17, color: AppColors.dark)),
        actions: [
          TextButton.icon(
            onPressed: () => setState(() => _adding = !_adding),
            icon: const Icon(Icons.add, size: 16, color: AppColors.primary),
            label: const Text('Add', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600)),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 100),
        children: [
          // Add form
          if (_adding)
            Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.primary.withAlpha(100)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('New Route',
                      style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.dark)),
                  const SizedBox(height: 12),
                  _LocationDropdown(
                    label: 'From',
                    value: _pickup,
                    onChanged: (v) => setState(() => _pickup = v),
                    exclude: _dropoff,
                  ),
                  const SizedBox(height: 10),
                  _LocationDropdown(
                    label: 'To',
                    value: _dropoff,
                    onChanged: (v) => setState(() => _dropoff = v),
                    exclude: _pickup,
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _labelCtrl,
                    style: const TextStyle(fontSize: 13),
                    decoration: InputDecoration(
                      hintText: 'Label (optional, e.g. Morning commute)',
                      hintStyle: const TextStyle(color: AppColors.gray, fontSize: 13),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.border)),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.border)),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.primary, width: 2)),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => setState(() => _adding = false),
                          child: const Text('Cancel'),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: ULButton(label: 'Save', loading: _saving, onPressed: _add),
                      ),
                    ],
                  ),
                ],
              ),
            ),

          // Routes list
          if (state.isLoading)
            ...List.generate(2, (_) => Container(
              height: 72, margin: const EdgeInsets.only(bottom: 8),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.border)),
            ))
          else if (state.savedRoutes.isEmpty)
            Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 60),
                child: Column(
                  children: [
                    const Icon(Icons.place_outlined, size: 36, color: AppColors.border),
                    const SizedBox(height: 12),
                    const Text('No saved routes yet',
                        style: TextStyle(fontWeight: FontWeight.w600, color: AppColors.gray)),
                    const SizedBox(height: 4),
                    const Text('Save your frequent routes for quick booking',
                        style: TextStyle(fontSize: 12, color: AppColors.gray), textAlign: TextAlign.center),
                    const SizedBox(height: 16),
                    TextButton(
                      onPressed: () => setState(() => _adding = true),
                      child: const Text('+ Add your first route'),
                    ),
                  ],
                ),
              ),
            )
          else
            ...state.savedRoutes.map((r) => Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  Column(
                    children: [
                      Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle)),
                      Container(width: 1, height: 16, color: AppColors.border),
                      Container(width: 8, height: 8, decoration: const BoxDecoration(color: Color(0xFFEF4444), shape: BoxShape.circle)),
                    ],
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (r.label != null)
                          Text(r.label!, style: const TextStyle(fontSize: 11, color: AppColors.gray)),
                        Text(r.pickupLocation,
                            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: AppColors.dark),
                            maxLines: 1, overflow: TextOverflow.ellipsis),
                        Text(r.dropoffLocation,
                            style: const TextStyle(fontSize: 13, color: AppColors.gray),
                            maxLines: 1, overflow: TextOverflow.ellipsis),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => ref.read(profileProvider.notifier).deleteRoute(r.id),
                    icon: const Icon(Icons.delete_outline_rounded, size: 18, color: AppColors.border),
                  ),
                ],
              ),
            )),
        ],
      ),
    );
  }
}

class _LocationDropdown extends StatelessWidget {
  final String label;
  final String value;
  final ValueChanged<String> onChanged;
  final String exclude;

  const _LocationDropdown({required this.label, required this.value, required this.onChanged, required this.exclude});

  @override
  Widget build(BuildContext context) {
    final options = AppConstants.accraLocations.where((l) => l != exclude).toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.gray)),
        const SizedBox(height: 4),
        DropdownButtonFormField<String>(
          initialValue: value.isEmpty ? null : value,
          hint: Text('Select location', style: TextStyle(color: AppColors.gray, fontSize: 13)),
          items: options.map((l) => DropdownMenuItem(value: l, child: Text(l, style: const TextStyle(fontSize: 13)))).toList(),
          onChanged: (v) { if (v != null) onChanged(v); },
          decoration: InputDecoration(
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.border)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.border)),
          ),
        ),
      ],
    );
  }
}
