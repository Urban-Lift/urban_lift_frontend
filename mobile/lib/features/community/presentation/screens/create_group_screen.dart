import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/community_provider.dart';
import '../../data/community_models.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';
import '../../../../shared/constants/app_constants.dart';

const _colors = [
  ('green',  Color(0xFF22C55E)),
  ('blue',   Color(0xFF3B82F6)),
  ('purple', Color(0xFFA855F7)),
  ('amber',  Color(0xFFF59E0B)),
  ('red',    Color(0xFFEF4444)),
  ('teal',   Color(0xFF14B8A6)),
];

class CreateGroupScreen extends ConsumerStatefulWidget {
  const CreateGroupScreen({super.key});

  @override
  ConsumerState<CreateGroupScreen> createState() => _CreateGroupScreenState();
}

class _CreateGroupScreenState extends ConsumerState<CreateGroupScreen> {
  String _colorKey = 'green';
  final _nameCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  String _pickup  = '';
  String _dropoff = '';
  GroupPrivacy _privacy = GroupPrivacy.public;
  bool _saving = false;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _descCtrl.dispose();
    super.dispose();
  }

  Color get _selectedColor => _colors.firstWhere((c) => c.$1 == _colorKey).$2;

  String get _initials {
    final words = _nameCtrl.text.trim().split(' ');
    return words.map((w) => w.isNotEmpty ? w[0] : '').take(2).join().toUpperCase();
  }

  Future<void> _create() async {
    if (_nameCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Group name is required'), backgroundColor: AppColors.error),
      );
      return;
    }
    setState(() => _saving = true);
    final route = _pickup.isNotEmpty && _dropoff.isNotEmpty ? '$_pickup → $_dropoff' : null;
    final ok = await ref.read(communityProvider.notifier).createGroup(
      name: _nameCtrl.text.trim(),
      primaryRoute: route,
      description: _descCtrl.text.trim().isEmpty ? null : _descCtrl.text.trim(),
      privacy: _privacy,
    );
    setState(() => _saving = false);
    if (!mounted) return;
    if (ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Group created!'), backgroundColor: AppColors.primary),
      );
      final groupId = ref.read(communityProvider).groups.first.id;
      context.pushReplacement('/community/$groupId/chat');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to create group'), backgroundColor: AppColors.error),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
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
        title: const Text('Create Group',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 17, color: AppColors.dark)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 40),
        child: Column(
          children: [
            // Avatar preview + color picker
            Column(
              children: [
                Container(
                  width: 76, height: 76,
                  decoration: BoxDecoration(color: _selectedColor, borderRadius: BorderRadius.circular(20)),
                  child: Center(
                    child: Text(_initials.isEmpty ? '?' : _initials,
                        style: const TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.w800)),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: _colors.map((c) => GestureDetector(
                    onTap: () => setState(() => _colorKey = c.$1),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 180),
                      margin: const EdgeInsets.symmetric(horizontal: 5),
                      width: 26, height: 26,
                      decoration: BoxDecoration(
                        color: c.$2,
                        shape: BoxShape.circle,
                        border: _colorKey == c.$1
                            ? Border.all(color: Colors.white, width: 2)
                            : null,
                        boxShadow: _colorKey == c.$1
                            ? [BoxShadow(color: c.$2.withAlpha(120), blurRadius: 6, spreadRadius: 1)]
                            : null,
                      ),
                    ),
                  )).toList(),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Form card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Name
                  const Text('Group Name',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.dark)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: _nameCtrl,
                    onChanged: (_) => setState(() {}),
                    style: const TextStyle(fontSize: 14),
                    decoration: InputDecoration(
                      hintText: 'e.g. East Legon Morning Commuters',
                      hintStyle: const TextStyle(color: AppColors.gray, fontSize: 14),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.border)),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.border)),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.primary, width: 2)),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Route
                  const Text('Primary Route (optional)',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.dark)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(child: _RouteDropdown(label: 'From', value: _pickup, onChanged: (v) => setState(() => _pickup = v), exclude: _dropoff)),
                      const SizedBox(width: 8),
                      Expanded(child: _RouteDropdown(label: 'To', value: _dropoff, onChanged: (v) => setState(() => _dropoff = v), exclude: _pickup)),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Description
                  const Text('Description (optional)',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.dark)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: _descCtrl,
                    maxLines: 3,
                    style: const TextStyle(fontSize: 14),
                    decoration: InputDecoration(
                      hintText: "What's this group about?",
                      hintStyle: const TextStyle(color: AppColors.gray, fontSize: 14),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.border)),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.border)),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.primary, width: 2)),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Privacy
                  const Text('Privacy',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.dark)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(child: _PrivacyOption(label: 'Public',  icon: Icons.public_rounded,   selected: _privacy == GroupPrivacy.public,  onTap: () => setState(() => _privacy = GroupPrivacy.public))),
                      const SizedBox(width: 8),
                      Expanded(child: _PrivacyOption(label: 'Private', icon: Icons.lock_outline_rounded, selected: _privacy == GroupPrivacy.private, onTap: () => setState(() => _privacy = GroupPrivacy.private))),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    _privacy == GroupPrivacy.public ? 'Anyone can find and join this group.' : 'Only people with an invite link can join.',
                    style: const TextStyle(fontSize: 11, color: AppColors.gray),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            ULButton(
              label: 'Create Group',
              loading: _saving,
              onPressed: _nameCtrl.text.trim().isNotEmpty ? _create : null,
            ),
          ],
        ),
      ),
    );
  }
}

class _RouteDropdown extends StatelessWidget {
  final String label;
  final String value;
  final ValueChanged<String> onChanged;
  final String exclude;
  const _RouteDropdown({required this.label, required this.value, required this.onChanged, required this.exclude});

  @override
  Widget build(BuildContext context) {
    final options = AppConstants.accraLocations.where((l) => l != exclude).toList();
    return DropdownButtonFormField<String>(
      initialValue: value.isEmpty ? null : value,
      hint: Text(label, style: const TextStyle(color: AppColors.gray, fontSize: 12)),
      isExpanded: true,
      items: options.map((l) => DropdownMenuItem(value: l, child: Text(l, style: const TextStyle(fontSize: 12), overflow: TextOverflow.ellipsis))).toList(),
      onChanged: (v) { if (v != null) onChanged(v); },
      decoration: InputDecoration(
        contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.border)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.border)),
      ),
    );
  }
}

class _PrivacyOption extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool selected;
  final VoidCallback onTap;
  const _PrivacyOption({required this.label, required this.icon, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: AnimatedContainer(
      duration: const Duration(milliseconds: 180),
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        border: Border.all(color: selected ? AppColors.primary : AppColors.border, width: selected ? 2 : 1),
        borderRadius: BorderRadius.circular(12),
        color: selected ? AppColors.lightGreen : Colors.transparent,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 16, color: selected ? AppColors.primary : AppColors.gray),
          const SizedBox(width: 6),
          Text(label, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: selected ? AppColors.primary : AppColors.gray)),
        ],
      ),
    ),
  );
}
