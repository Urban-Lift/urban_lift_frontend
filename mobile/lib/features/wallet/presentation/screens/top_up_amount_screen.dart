import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/wallet_provider.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/index.dart';

const _presets = [
  ('Starter',  10.0),
  ('Commuter', 20.0),
  ('Regular',  50.0),
  ('Pro',     100.0),
];

class TopUpAmountScreen extends ConsumerStatefulWidget {
  const TopUpAmountScreen({super.key});

  @override
  ConsumerState<TopUpAmountScreen> createState() => _TopUpAmountScreenState();
}

class _TopUpAmountScreenState extends ConsumerState<TopUpAmountScreen> {
  double? _selected = 10.0; // default to Starter
  final _ctrl  = TextEditingController();
  final _focus = FocusNode();

  @override
  void dispose() {
    _ctrl.dispose();
    _focus.dispose();
    super.dispose();
  }

  double? get _amount {
    if (_ctrl.text.isNotEmpty) {
      final v = double.tryParse(_ctrl.text);
      return (v != null && v >= 1) ? v : null;
    }
    return _selected;
  }

  bool get _isValid => _amount != null;

  void _handleContinue() {
    final amount = _amount;
    if (amount == null) return;
    ref.read(walletProvider.notifier).setTopUpAmount(amount);
    context.push('/wallet/topup/provider');
  }

  @override
  Widget build(BuildContext context) {
    final balance = ref.watch(walletProvider).balance;

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
        title: const Text('Top Up Wallet',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 17, color: AppColors.dark)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Balance card (dark green)
            if (balance != null)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF1A7A3C), Color(0xFF0F5C2A)],
                  ),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.account_balance_wallet_outlined,
                            size: 14, color: AppColors.lightGreen),
                        SizedBox(width: 6),
                        Text('Current Balance',
                            style: TextStyle(fontSize: 13, color: AppColors.lightGreen)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'GHS ${balance.balance.toStringAsFixed(2)}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 32,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 24),

            // Preset tiles
            const Text('Select Amount',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.dark)),
            const SizedBox(height: 12),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 2.0,
              children: _presets.map((p) {
                final isActive = _selected == p.$2 && _ctrl.text.isEmpty;
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selected = p.$2;
                      _ctrl.clear();
                    });
                    _focus.unfocus();
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 180),
                    decoration: BoxDecoration(
                      color: isActive ? const Color(0xFFF0FDF4) : Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isActive ? AppColors.primary : AppColors.border,
                        width: isActive ? 2 : 1.5,
                      ),
                    ),
                    child: Stack(
                      children: [
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(p.$1,
                                  style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                      color: isActive ? AppColors.primary : AppColors.gray)),
                              const SizedBox(height: 2),
                              Text('GHS ${p.$2.toInt()}',
                                  style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w800,
                                      color: isActive ? AppColors.primary : AppColors.dark)),
                            ],
                          ),
                        ),
                        if (isActive)
                          Positioned(
                            top: 8, right: 8,
                            child: Container(
                              width: 20,
                              height: 20,
                              decoration: const BoxDecoration(
                                  color: AppColors.primary, shape: BoxShape.circle),
                              child: const Icon(Icons.check, size: 12, color: Colors.white),
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // Custom amount
            const Text('Or enter custom amount',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.dark)),
            const SizedBox(height: 10),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: _ctrl.text.isNotEmpty ? AppColors.primary : AppColors.border,
                  width: 1.5,
                ),
              ),
              child: Row(
                children: [
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 14),
                    child: Text('GHS',
                        style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.gray)),
                  ),
                  Container(width: 1, height: 24, color: AppColors.border),
                  Expanded(
                    child: TextField(
                      controller: _ctrl,
                      focusNode: _focus,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      inputFormatters: [
                        FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d{0,2}'))
                      ],
                      onChanged: (_) => setState(() => _selected = null),
                      style: const TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.dark),
                      decoration: const InputDecoration(
                        hintText: '0.00',
                        hintStyle: TextStyle(color: AppColors.gray),
                        border: InputBorder.none,
                        contentPadding:
                            EdgeInsets.symmetric(horizontal: 12, vertical: 16),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            ULButton(
              label: _amount != null
                  ? 'Continue  →  GHS ${_amount!.toStringAsFixed(0)}'
                  : 'Continue',
              onPressed: _isValid ? _handleContinue : null,
            ),
          ],
        ),
      ),
    );
  }
}
