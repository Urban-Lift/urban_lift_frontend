import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/ride_provider.dart';
import '../../data/ride_models.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';
import '../../../../shared/constants/app_constants.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class PassengerHomeScreen extends ConsumerStatefulWidget {
  const PassengerHomeScreen({super.key});

  @override
  ConsumerState<PassengerHomeScreen> createState() => _PassengerHomeScreenState();
}

class _PassengerHomeScreenState extends ConsumerState<PassengerHomeScreen> {
  String _pickup  = '';
  String _dropoff = '';
  DateTime _date  = DateTime.now();
  int _seats      = 1;
  String _error   = '';

  List<DateTime> get _dates => List.generate(8, (i) => DateTime.now().add(Duration(days: i)));

  String _dateLabel(DateTime d) {
    final now = DateTime.now();
    if (d.day == now.day) return 'Today';
    if (d.day == now.day + 1) return 'Tomorrow';
    return '${_weekday(d.weekday)}, ${d.day} ${_month(d.month)}';
  }

  String _weekday(int w) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][w - 1];
  String _month(int m)   => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1];

  Future<void> _search() async {
    if (_pickup.isEmpty)  { setState(() => _error = 'Select a pickup location');    return; }
    if (_dropoff.isEmpty) { setState(() => _error = 'Select a destination');        return; }
    if (_pickup == _dropoff) { setState(() => _error = 'Pickup and destination cannot be the same'); return; }
    setState(() => _error = '');
    await ref.read(rideSearchProvider.notifier).search(
      RideSearchParams(pickupLocation: _pickup, dropoffLocation: _dropoff, date: _date, seats: _seats),
    );
    if (mounted) context.push('/rides');
  }

  @override
  Widget build(BuildContext context) {
    final user      = ref.watch(authProvider).user;
    final isLoading = ref.watch(rideSearchProvider).isLoading;
    final firstName = user?.fullName.split(' ').first ?? 'there';

    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Green header ────────────────────────────────────────────────
            Container(
              color: AppColors.primary,
              padding: const EdgeInsets.fromLTRB(20, 56, 20, 64),
              child: Row(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Good morning,', style: TextStyle(color: Colors.white.withAlpha(200), fontSize: 13)),
                      Text('$firstName 👋', style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w700)),
                    ],
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: () => context.push('/profile'),
                    child: ULAvatar(name: user?.fullName ?? '', size: AvatarSize.md),
                  ),
                ],
              ),
            ),

            // ── Search card ─────────────────────────────────────────────────
            Transform.translate(
              offset: const Offset(0, -36),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Card(
                  elevation: 4,
                  shadowColor: Colors.black.withAlpha(30),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Find a ride', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.dark)),
                        const SizedBox(height: 16),

                        // From
                        _LocationPicker(
                          label: 'From',
                          placeholder: 'Where are you starting?',
                          value: _pickup,
                          dotColor: AppColors.primary,
                          exclude: _dropoff,
                          onChanged: (v) => setState(() => _pickup = v),
                        ),
                        const SizedBox(height: 12),

                        // To
                        _LocationPicker(
                          label: 'To',
                          placeholder: 'Where are you going?',
                          value: _dropoff,
                          dotColor: AppColors.error,
                          exclude: _pickup,
                          onChanged: (v) => setState(() => _dropoff = v),
                        ),
                        const SizedBox(height: 16),

                        // Date row
                        const Text('Date', style: TextStyle(fontSize: 12, color: AppColors.gray, fontWeight: FontWeight.w500)),
                        const SizedBox(height: 8),
                        SizedBox(
                          height: 36,
                          child: ListView(
                            scrollDirection: Axis.horizontal,
                            children: _dates.map((d) {
                              final sel = d.day == _date.day;
                              return GestureDetector(
                                onTap: () => setState(() => _date = d),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 150),
                                  margin: const EdgeInsets.only(right: 8),
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: sel ? AppColors.primary : Colors.white,
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(color: sel ? AppColors.primary : AppColors.border),
                                  ),
                                  child: Text(
                                    _dateLabel(d),
                                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: sel ? Colors.white : AppColors.gray),
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Seats
                        Row(
                          children: [
                            const Text('Seats', style: TextStyle(fontSize: 12, color: AppColors.gray, fontWeight: FontWeight.w500)),
                            const Spacer(),
                            _CounterButton(icon: Icons.remove, onTap: () => setState(() => _seats = (_seats - 1).clamp(1, 6))),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              child: Text('$_seats', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.dark)),
                            ),
                            _CounterButton(icon: Icons.add, onTap: () => setState(() => _seats = (_seats + 1).clamp(1, 6)), filled: true),
                          ],
                        ),

                        if (_error.isNotEmpty) ...[
                          const SizedBox(height: 10),
                          Text(_error, style: const TextStyle(fontSize: 12, color: AppColors.error)),
                        ],

                        const SizedBox(height: 16),
                        ULButton(label: 'Find Rides', loading: isLoading, onPressed: _search),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            // ── Popular routes ──────────────────────────────────────────────
            Transform.translate(
              offset: const Offset(0, -28),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Popular routes', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.dark)),
                    const SizedBox(height: 12),
                    ...[ ['East Legon', 'Accra Central'], ['Legon Campus', 'Airport City'], ['Madina Station', 'Osu Oxford Street'] ]
                        .map((route) => GestureDetector(
                          onTap: () => setState(() { _pickup = route[0]; _dropoff = route[1]; }),
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 10),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: AppColors.border),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.location_on_outlined, size: 16, color: AppColors.primary),
                                const SizedBox(width: 10),
                                Expanded(child: Text('${route[0]} → ${route[1]}', style: const TextStyle(fontSize: 13, color: AppColors.dark))),
                                const Icon(Icons.chevron_right, size: 18, color: AppColors.gray),
                              ],
                            ),
                          ),
                        )),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 80),
          ],
        ),
      ),
    );
  }
}

class _LocationPicker extends StatefulWidget {
  const _LocationPicker({
    required this.label,
    required this.placeholder,
    required this.value,
    required this.dotColor,
    required this.onChanged,
    this.exclude = '',
  });

  final String label;
  final String placeholder;
  final String value;
  final Color dotColor;
  final ValueChanged<String> onChanged;
  final String exclude;

  @override
  State<_LocationPicker> createState() => _LocationPickerState();
}

class _LocationPickerState extends State<_LocationPicker> {
  bool _open = false;

  @override
  Widget build(BuildContext context) {
    final options = AppConstants.accraLocations.where((l) => l != widget.exclude).toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.label, style: const TextStyle(fontSize: 12, color: AppColors.gray, fontWeight: FontWeight.w500)),
        const SizedBox(height: 6),
        GestureDetector(
          onTap: () => setState(() => _open = !_open),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              border: Border.all(color: _open ? AppColors.primary : AppColors.border, width: _open ? 2 : 1),
              borderRadius: BorderRadius.circular(12),
              color: Colors.white,
            ),
            child: Row(
              children: [
                Container(width: 10, height: 10, decoration: BoxDecoration(color: widget.dotColor, shape: BoxShape.circle)),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    widget.value.isEmpty ? widget.placeholder : widget.value,
                    style: TextStyle(fontSize: 14, color: widget.value.isEmpty ? AppColors.gray : AppColors.dark),
                  ),
                ),
                Icon(Icons.expand_more, size: 18, color: AppColors.gray),
              ],
            ),
          ),
        ),
        if (_open)
          Container(
            margin: const EdgeInsets.only(top: 4),
            constraints: const BoxConstraints(maxHeight: 200),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: AppColors.border),
              borderRadius: BorderRadius.circular(12),
              boxShadow: [BoxShadow(color: Colors.black.withAlpha(20), blurRadius: 12, offset: const Offset(0, 4))],
            ),
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: options.length,
              itemBuilder: (context, i) => InkWell(
                onTap: () {
                  widget.onChanged(options[i]);
                  setState(() => _open = false);
                },
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 11),
                  child: Text(
                    options[i],
                    style: TextStyle(
                      fontSize: 14,
                      color: widget.value == options[i] ? AppColors.primary : AppColors.dark,
                      fontWeight: widget.value == options[i] ? FontWeight.w600 : FontWeight.normal,
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _CounterButton extends StatelessWidget {
  const _CounterButton({required this.icon, required this.onTap, this.filled = false});
  final IconData icon;
  final VoidCallback onTap;
  final bool filled;

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        child: Container(
          width: 32, height: 32,
          decoration: BoxDecoration(
            color: filled ? AppColors.primaryLight : Colors.white,
            border: Border.all(color: filled ? AppColors.primary : AppColors.border),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 16, color: filled ? AppColors.primary : AppColors.gray),
        ),
      );
}
