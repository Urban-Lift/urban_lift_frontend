import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/wallet_provider.dart';
import '../../data/wallet_models.dart';
import '../../../../core/theme/app_theme.dart';

class _ProviderInfo {
  final PaymentProvider id;
  final String label;
  final String subtitle;
  final Color color;
  final Color textColor;
  final String logoText;
  final bool available;
  const _ProviderInfo(
    this.id,
    this.label,
    this.subtitle,
    this.color,
    this.textColor,
    this.logoText, {
    this.available = true,
  });
}

const _providers = [
  _ProviderInfo(PaymentProvider.mtnMomo,      'MTN Mobile Money', 'Pay via *170#',  Color(0xFFFBBF24), Color(0xFF78350F), 'MTN\nMoMo'),
  _ProviderInfo(PaymentProvider.vodafoneCash, 'Vodafone Cash',    'Pay via *110#',  Color(0xFFEF4444), Colors.white,      'Voda\nCash'),
  _ProviderInfo(PaymentProvider.atMoney,      'AT Money',         'Pay via *110#',  Color(0xFF1E40AF), Colors.white,      'AT\nMoney'),
  _ProviderInfo(PaymentProvider.card,         'Credit / Debit Card', 'Coming soon', Color(0xFFE5E7EB), Color(0xFF9CA3AF), '💳',    available: false),
];

class TopUpProviderScreen extends ConsumerStatefulWidget {
  const TopUpProviderScreen({super.key});

  @override
  ConsumerState<TopUpProviderScreen> createState() => _TopUpProviderScreenState();
}

class _TopUpProviderScreenState extends ConsumerState<TopUpProviderScreen> {
  PaymentProvider? _selected;

  Future<void> _handlePay() async {
    final provider = _selected;
    if (provider == null) return;
    ref.read(walletProvider.notifier).setTopUpProvider(provider);
    await ref.read(walletProvider.notifier).confirmTopUp();
    final err = ref.read(walletProvider).error;
    if (err != null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(err), backgroundColor: AppColors.error),
      );
      return;
    }
    if (mounted) context.pushReplacement('/wallet/topup/success');
  }

  @override
  Widget build(BuildContext context) {
    final state  = ref.watch(walletProvider);
    final amount = state.topUpAmount ?? 0;
    final fee    = 0.50;
    final total  = amount + fee;

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
        title: const Text('Select Provider',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 17, color: AppColors.dark)),
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Amount card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Column(
                      children: [
                        const Text('Top-up Amount',
                            style: TextStyle(fontSize: 13, color: AppColors.gray)),
                        const SizedBox(height: 4),
                        Text(
                          'GHS ${amount.toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.w800,
                            color: AppColors.dark,
                            letterSpacing: -0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  const Text('CHOOSE MOBILE MONEY',
                      style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppColors.gray,
                          letterSpacing: 0.8)),
                  const SizedBox(height: 10),

                  // Provider list
                  ...List.generate(_providers.length, (i) {
                    final p = _providers[i];
                    final isSelected = _selected == p.id && p.available;
                    return GestureDetector(
                      onTap: p.available ? () => setState(() => _selected = p.id) : null,
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 180),
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: isSelected ? AppColors.primary : AppColors.border,
                            width: isSelected ? 2 : 1.5,
                          ),
                        ),
                        child: Opacity(
                          opacity: p.available ? 1.0 : 0.5,
                          child: Row(
                            children: [
                              Container(
                                width: 52,
                                height: 52,
                                decoration: BoxDecoration(
                                  color: p.color,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Center(
                                  child: Text(
                                    p.logoText,
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: p.available ? 11 : 20,
                                      fontWeight: FontWeight.w900,
                                      color: p.textColor,
                                      height: 1.1,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(p.label,
                                        style: const TextStyle(
                                            fontWeight: FontWeight.w600,
                                            fontSize: 15,
                                            color: AppColors.dark)),
                                    Text(p.subtitle,
                                        style: const TextStyle(
                                            fontSize: 12, color: AppColors.gray)),
                                  ],
                                ),
                              ),
                              if (p.available)
                                AnimatedContainer(
                                  duration: const Duration(milliseconds: 180),
                                  width: 22,
                                  height: 22,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: isSelected ? AppColors.primary : Colors.transparent,
                                    border: Border.all(
                                      color: isSelected ? AppColors.primary : AppColors.border,
                                      width: 2,
                                    ),
                                  ),
                                  child: isSelected
                                      ? const Icon(Icons.check, size: 12, color: Colors.white)
                                      : null,
                                ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),

          // Bottom: fee + CTA
          Container(
            color: Colors.white,
            padding: EdgeInsets.fromLTRB(
                16, 12, 16, MediaQuery.of(context).padding.bottom + 16),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Transaction Fee',
                          style: TextStyle(fontSize: 13, color: AppColors.gray)),
                      Text('GHS ${fee.toStringAsFixed(2)}',
                          style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                              color: AppColors.dark)),
                    ],
                  ),
                ),
                SizedBox(
                  width: double.infinity,
                  height: 54,
                  child: ElevatedButton(
                    onPressed: _selected != null && !state.isLoading ? _handlePay : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF22C55E),
                      foregroundColor: Colors.white,
                      disabledBackgroundColor: AppColors.border,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14)),
                    ),
                    child: state.isLoading
                        ? const SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(
                                color: Colors.white, strokeWidth: 2.5),
                          )
                        : Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text('Proceed to Pay',
                                  style: TextStyle(
                                      fontSize: 16, fontWeight: FontWeight.w700)),
                              const SizedBox(width: 8),
                              Text('  GHS ${total.toStringAsFixed(2)}  →',
                                  style: const TextStyle(
                                      fontSize: 14, fontWeight: FontWeight.w600)),
                            ],
                          ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
