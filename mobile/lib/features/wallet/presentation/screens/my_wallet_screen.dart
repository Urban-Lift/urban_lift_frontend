import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../providers/wallet_provider.dart';
import '../../data/wallet_models.dart';
import '../../../../core/theme/app_theme.dart';

class MyWalletScreen extends ConsumerStatefulWidget {
  const MyWalletScreen({super.key});

  @override
  ConsumerState<MyWalletScreen> createState() => _MyWalletScreenState();
}

class _MyWalletScreenState extends ConsumerState<MyWalletScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(walletProvider.notifier).resetTopUp();
      ref.read(walletProvider.notifier).load();
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(walletProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // Header
          SliverToBoxAdapter(
            child: Container(
              color: AppColors.primary,
              child: SafeArea(
                bottom: false,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('My Wallet',
                          style: TextStyle(color: AppColors.lightGreen, fontSize: 13, fontWeight: FontWeight.w600)),
                      const SizedBox(height: 6),
                      state.isLoading || state.balance == null
                          ? const _Skeleton(width: 160, height: 44)
                          : Text(
                              'GHS ${state.balance!.balance.toStringAsFixed(2)}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 36,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                      const SizedBox(height: 4),
                      const Text('Available balance',
                          style: TextStyle(color: AppColors.lightGreen, fontSize: 12)),
                      const SizedBox(height: 20),
                      GestureDetector(
                        onTap: () => context.push('/wallet/topup'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.add, size: 16, color: AppColors.primary),
                              SizedBox(width: 6),
                              Text('Top Up',
                                  style: TextStyle(
                                    color: AppColors.primary,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 14,
                                  )),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 20, 16, 100),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Linked accounts
                _SectionHeader(
                  title: 'Linked Accounts',
                  action: TextButton(onPressed: () {}, child: const Text('+ Add')),
                ),
                const SizedBox(height: 8),
                if (state.isLoading)
                  ...List.generate(2, (_) => const Padding(
                    padding: EdgeInsets.only(bottom: 8),
                    child: _Skeleton(height: 60),
                  ))
                else if (state.linkedAccounts.isEmpty)
                  _EmptyCard(icon: Icons.credit_card_outlined, message: 'No linked accounts yet')
                else
                  ...state.linkedAccounts.map((a) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: _LinkedAccountTile(account: a),
                  )),

                const SizedBox(height: 20),

                // Transactions
                _SectionHeader(title: 'Recent Activity'),
                const SizedBox(height: 8),
                if (state.isLoading)
                  ...List.generate(3, (_) => const Padding(
                    padding: EdgeInsets.only(bottom: 8),
                    child: _Skeleton(height: 68),
                  ))
                else if (state.transactions.isEmpty)
                  _EmptyCard(icon: Icons.trending_up, message: 'No transactions yet')
                else
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Column(
                      children: state.transactions.take(8).toList().asMap().entries.map((e) {
                        final isLast = e.key == (state.transactions.length < 8 ? state.transactions.length - 1 : 7);
                        return Column(
                          children: [
                            _TransactionTile(txn: e.value),
                            if (!isLast) const Divider(height: 1, indent: 56),
                          ],
                        );
                      }).toList(),
                    ),
                  ),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final Widget? action;
  const _SectionHeader({required this.title, this.action});

  @override
  Widget build(BuildContext context) => Row(
    children: [
      Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.dark)),
      const Spacer(),
      ?action,
    ],
  );
}

class _EmptyCard extends StatelessWidget {
  final IconData icon;
  final String message;
  const _EmptyCard({required this.icon, required this.message});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(24),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: AppColors.border),
    ),
    child: Column(
      children: [
        Icon(icon, size: 28, color: AppColors.border),
        const SizedBox(height: 8),
        Text(message, style: const TextStyle(fontSize: 13, color: AppColors.gray)),
      ],
    ),
  );
}

class _Skeleton extends StatelessWidget {
  final double? width;
  final double height;
  const _Skeleton({this.width, required this.height});

  @override
  Widget build(BuildContext context) => Container(
    width: width,
    height: height,
    decoration: BoxDecoration(
      color: Colors.white.withAlpha(40),
      borderRadius: BorderRadius.circular(12),
    ),
  );
}

class _LinkedAccountTile extends StatelessWidget {
  final LinkedAccount account;
  const _LinkedAccountTile({required this.account});

  @override
  Widget build(BuildContext context) {
    final info = _providerInfo(account.provider);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 36, height: 36,
            decoration: BoxDecoration(color: info.$2, borderRadius: BorderRadius.circular(10)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(info.$1, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: AppColors.dark)),
                Text(_maskAccount(account.accountNumber),
                    style: const TextStyle(fontSize: 12, color: AppColors.gray)),
              ],
            ),
          ),
          if (account.isDefault)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: AppColors.lightGreen,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text('Default',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.primary)),
            ),
        ],
      ),
    );
  }

  String _maskAccount(String s) =>
      s.length < 4 ? s : '${s.substring(0, 3)}****${s.substring(s.length - 3)}';

  (String, Color) _providerInfo(PaymentProvider p) => switch (p) {
    PaymentProvider.mtnMomo      => ('MTN MoMo', const Color(0xFFFBBF24)),
    PaymentProvider.vodafoneCash => ('Vodafone Cash', const Color(0xFFEF4444)),
    PaymentProvider.atMoney      => ('AT Money', const Color(0xFF3B82F6)),
    PaymentProvider.card         => ('Bank Card', const Color(0xFF9CA3AF)),
  };
}

class _TransactionTile extends StatelessWidget {
  final WalletTransaction txn;
  const _TransactionTile({required this.txn});

  @override
  Widget build(BuildContext context) {
    final isCredit = txn.direction == TxnDirection.credit;
    final fmt = DateFormat('d MMM, h:mm a');
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Row(
        children: [
          Container(
            width: 36, height: 36,
            decoration: BoxDecoration(
              color: isCredit ? AppColors.lightGreen : const Color(0xFFFEE2E2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Icon(
              isCredit ? Icons.arrow_downward_rounded : Icons.arrow_upward_rounded,
              size: 16,
              color: isCredit ? AppColors.primary : AppColors.error,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(txn.description,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.dark),
                    maxLines: 1, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 2),
                Text(fmt.format(txn.createdAt),
                    style: const TextStyle(fontSize: 11, color: AppColors.gray)),
              ],
            ),
          ),
          Text(
            '${isCredit ? '+' : '-'}GHS ${txn.amount.toStringAsFixed(2)}',
            style: TextStyle(
              fontSize: 13, fontWeight: FontWeight.w700,
              color: isCredit ? AppColors.primary : AppColors.error,
            ),
          ),
        ],
      ),
    );
  }
}
