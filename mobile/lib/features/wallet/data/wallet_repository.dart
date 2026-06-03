import 'dart:math';
import 'wallet_models.dart';

abstract class WalletRepository {
  Future<WalletBalance> getBalance();
  Future<List<WalletTransaction>> getTransactions();
  Future<List<LinkedAccount>> getLinkedAccounts();
  Future<TopUpResult> topUp(double amount, PaymentProvider provider);
}

class MockWalletRepository implements WalletRepository {
  double _balance = 245.50;

  final List<WalletTransaction> _transactions = [
    WalletTransaction(
      id: 'txn-001',
      type: TxnType.topUp,
      amount: 100,
      direction: TxnDirection.credit,
      provider: PaymentProvider.mtnMomo,
      referenceId: 'REF-7A3KP2',
      description: 'Top up via MTN MoMo',
      status: TxnStatus.completed,
      createdAt: DateTime.now().subtract(const Duration(hours: 2)),
    ),
    WalletTransaction(
      id: 'txn-002',
      type: TxnType.ridePayment,
      amount: 25,
      direction: TxnDirection.debit,
      description: 'Ride: East Legon → Osu',
      status: TxnStatus.completed,
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
    ),
    WalletTransaction(
      id: 'txn-003',
      type: TxnType.referralCredit,
      amount: 10,
      direction: TxnDirection.credit,
      referenceId: 'REF-KWAME10',
      description: 'Referral bonus — Ama joined',
      status: TxnStatus.completed,
      createdAt: DateTime.now().subtract(const Duration(days: 2)),
    ),
    WalletTransaction(
      id: 'txn-004',
      type: TxnType.ridePayment,
      amount: 18,
      direction: TxnDirection.debit,
      description: 'Ride: Legon Campus → Airport City',
      status: TxnStatus.completed,
      createdAt: DateTime.now().subtract(const Duration(days: 3)),
    ),
    WalletTransaction(
      id: 'txn-005',
      type: TxnType.topUp,
      amount: 50,
      direction: TxnDirection.credit,
      provider: PaymentProvider.vodafoneCash,
      referenceId: 'REF-9XZ1MN',
      description: 'Top up via Vodafone Cash',
      status: TxnStatus.completed,
      createdAt: DateTime.now().subtract(const Duration(days: 5)),
    ),
  ];

  final List<LinkedAccount> _accounts = [
    LinkedAccount(
      id: 'pm-001',
      provider: PaymentProvider.mtnMomo,
      accountNumber: '0541234567',
      isDefault: true,
    ),
    LinkedAccount(
      id: 'pm-002',
      provider: PaymentProvider.vodafoneCash,
      accountNumber: '0201234567',
      isDefault: false,
    ),
  ];

  @override
  Future<WalletBalance> getBalance() async {
    await Future.delayed(const Duration(milliseconds: 600));
    return WalletBalance(
      id: 'wallet-001',
      balance: _balance,
      currency: 'GHS',
      updatedAt: DateTime.now().toIso8601String(),
    );
  }

  @override
  Future<List<WalletTransaction>> getTransactions() async {
    await Future.delayed(const Duration(milliseconds: 700));
    return List.unmodifiable(_transactions);
  }

  @override
  Future<List<LinkedAccount>> getLinkedAccounts() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return List.unmodifiable(_accounts);
  }

  @override
  Future<TopUpResult> topUp(double amount, PaymentProvider provider) async {
    await Future.delayed(const Duration(milliseconds: 1200));
    _balance += amount;
    final ref = 'REF-${_randomRef()}';
    final now = DateTime.now();
    _transactions.insert(
      0,
      WalletTransaction(
        id: 'txn-${now.millisecondsSinceEpoch}',
        type: TxnType.topUp,
        amount: amount,
        direction: TxnDirection.credit,
        provider: provider,
        referenceId: ref,
        description: 'Top up via ${_providerLabel(provider)}',
        status: TxnStatus.completed,
        createdAt: now,
      ),
    );
    return TopUpResult(referenceId: ref, newBalance: _balance, completedAt: now);
  }

  String _randomRef() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    final rnd = Random();
    return List.generate(6, (_) => chars[rnd.nextInt(chars.length)]).join();
  }

  String _providerLabel(PaymentProvider p) {
    switch (p) {
      case PaymentProvider.mtnMomo:      return 'MTN MoMo';
      case PaymentProvider.vodafoneCash: return 'Vodafone Cash';
      case PaymentProvider.atMoney:      return 'AT Money';
      case PaymentProvider.card:         return 'Bank Card';
    }
  }
}
