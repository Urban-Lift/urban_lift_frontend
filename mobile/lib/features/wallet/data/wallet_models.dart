enum TxnDirection { credit, debit }
enum TxnType { topUp, ridePayment, rideEarning, referralCredit }
enum TxnStatus { pending, completed, failed }
enum PaymentProvider { mtnMomo, vodafoneCash, atMoney, card }

class WalletBalance {
  final String id;
  final double balance;
  final String currency;
  final String updatedAt;

  const WalletBalance({
    required this.id,
    required this.balance,
    required this.currency,
    required this.updatedAt,
  });

  WalletBalance copyWith({double? balance, String? updatedAt}) => WalletBalance(
        id: id,
        balance: balance ?? this.balance,
        currency: currency,
        updatedAt: updatedAt ?? this.updatedAt,
      );
}

class WalletTransaction {
  final String id;
  final TxnType type;
  final double amount;
  final TxnDirection direction;
  final PaymentProvider? provider;
  final String? referenceId;
  final String description;
  final TxnStatus status;
  final DateTime createdAt;

  const WalletTransaction({
    required this.id,
    required this.type,
    required this.amount,
    required this.direction,
    this.provider,
    this.referenceId,
    required this.description,
    required this.status,
    required this.createdAt,
  });
}

class LinkedAccount {
  final String id;
  final PaymentProvider provider;
  final String accountNumber;
  final bool isDefault;

  const LinkedAccount({
    required this.id,
    required this.provider,
    required this.accountNumber,
    required this.isDefault,
  });
}

class TopUpResult {
  final String referenceId;
  final double newBalance;
  final DateTime completedAt;

  const TopUpResult({
    required this.referenceId,
    required this.newBalance,
    required this.completedAt,
  });
}
