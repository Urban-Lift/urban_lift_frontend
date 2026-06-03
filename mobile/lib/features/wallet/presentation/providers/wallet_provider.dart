import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/wallet_models.dart';
import '../../data/wallet_repository.dart';

class WalletState {
  final WalletBalance? balance;
  final List<WalletTransaction> transactions;
  final List<LinkedAccount> linkedAccounts;
  final bool isLoading;
  final String? error;

  // top-up flow
  final double? topUpAmount;
  final PaymentProvider? topUpProvider;
  final TopUpResult? topUpResult;

  const WalletState({
    this.balance,
    this.transactions = const [],
    this.linkedAccounts = const [],
    this.isLoading = false,
    this.error,
    this.topUpAmount,
    this.topUpProvider,
    this.topUpResult,
  });

  WalletState copyWith({
    WalletBalance? balance,
    List<WalletTransaction>? transactions,
    List<LinkedAccount>? linkedAccounts,
    bool? isLoading,
    String? error,
    double? topUpAmount,
    PaymentProvider? topUpProvider,
    TopUpResult? topUpResult,
    bool clearTopUp = false,
    bool clearError = false,
  }) {
    return WalletState(
      balance: balance ?? this.balance,
      transactions: transactions ?? this.transactions,
      linkedAccounts: linkedAccounts ?? this.linkedAccounts,
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : (error ?? this.error),
      topUpAmount: clearTopUp ? null : (topUpAmount ?? this.topUpAmount),
      topUpProvider: clearTopUp ? null : (topUpProvider ?? this.topUpProvider),
      topUpResult: clearTopUp ? null : (topUpResult ?? this.topUpResult),
    );
  }
}

class WalletNotifier extends StateNotifier<WalletState> {
  final WalletRepository _repo;

  WalletNotifier(this._repo) : super(const WalletState());

  Future<void> load() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final results = await Future.wait([
        _repo.getBalance(),
        _repo.getTransactions(),
        _repo.getLinkedAccounts(),
      ]);
      state = state.copyWith(
        balance: results[0] as WalletBalance,
        transactions: results[1] as List<WalletTransaction>,
        linkedAccounts: results[2] as List<LinkedAccount>,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  void setTopUpAmount(double amount) => state = state.copyWith(topUpAmount: amount);
  void setTopUpProvider(PaymentProvider provider) => state = state.copyWith(topUpProvider: provider);

  Future<void> confirmTopUp() async {
    final amount = state.topUpAmount;
    final provider = state.topUpProvider;
    if (amount == null || provider == null) return;
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final result = await _repo.topUp(amount, provider);
      state = state.copyWith(
        isLoading: false,
        topUpResult: result,
        balance: state.balance?.copyWith(balance: result.newBalance),
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  void resetTopUp() => state = state.copyWith(clearTopUp: true);
}

final walletRepositoryProvider = Provider<WalletRepository>((_) => MockWalletRepository());

final walletProvider = StateNotifierProvider<WalletNotifier, WalletState>(
  (ref) => WalletNotifier(ref.read(walletRepositoryProvider)),
);
