import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../data/auth_models.dart';
import '../../data/auth_repository.dart';

// ── Repository provider ───────────────────────────────────────────────────────

final authRepositoryProvider = Provider<AuthRepository>(
  (_) => MockAuthRepository(),
);

// ── Auth notifier ─────────────────────────────────────────────────────────────

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._repo) : super(const AuthState()) {
    _restoreSession();
  }

  final AuthRepository _repo;

  static const _keyToken   = 'ul_token';
  static const _keyUserId  = 'ul_user_id';
  static const _keyRole    = 'ul_user_role';
  static const _keyName    = 'ul_user_name';
  static const _keyPhone   = 'ul_user_phone';

  Future<void> _restoreSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_keyToken);
    if (token == null) return;
    final user = UserModel(
      id:          prefs.getString(_keyUserId)  ?? '',
      phoneNumber: prefs.getString(_keyPhone)   ?? '',
      fullName:    prefs.getString(_keyName)    ?? '',
      role:        prefs.getString(_keyRole)    ?? 'passenger',
    );
    state = state.copyWith(isAuthenticated: true, user: user, token: token);
  }

  Future<void> _persistSession(UserModel user, String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyToken,  token);
    await prefs.setString(_keyUserId, user.id);
    await prefs.setString(_keyRole,   user.role);
    await prefs.setString(_keyName,   user.fullName);
    await prefs.setString(_keyPhone,  user.phoneNumber);
  }

  Future<void> _clearSession() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyToken);
    await prefs.remove(_keyUserId);
    await prefs.remove(_keyRole);
    await prefs.remove(_keyName);
    await prefs.remove(_keyPhone);
  }

  // ── Pending flow setters ────────────────────────────────────────────────────

  void setPendingPhone(String phone) =>
      state = state.copyWith(pendingPhone: phone);

  void setPendingRole(String role) =>
      state = state.copyWith(pendingRole: role);

  void setPendingEmail(String email) =>
      state = state.copyWith(pendingEmail: email);

  // ── Auth actions ────────────────────────────────────────────────────────────

  Future<void> sendOTP(String phone) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      await _repo.sendOTP(phone);
      state = state.copyWith(isLoading: false, pendingPhone: phone);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      rethrow;
    }
  }

  Future<String> verifyPhoneOTP(String code) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final token = await _repo.verifyPhoneOTP(state.pendingPhone, code);
      state = state.copyWith(isLoading: false, token: token);
      return token;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      rethrow;
    }
  }

  Future<void> sendEmailCode(String email) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      await _repo.sendEmailCode(email);
      state = state.copyWith(isLoading: false, pendingEmail: email);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      rethrow;
    }
  }

  Future<void> verifyEmailCode(String code) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      await _repo.verifyEmailCode(state.pendingEmail, code);
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      rethrow;
    }
  }

  Future<UserModel> createPassengerProfile({
    required String fullName,
    required String emergencyContact,
    String? email,
  }) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final user = await _repo.createPassengerProfile(
        fullName: fullName,
        phone: state.pendingPhone,
        emergencyContact: emergencyContact,
        email: email,
      );
      final token = state.token ?? '';
      await _persistSession(user, token);
      state = state.copyWith(
        isLoading: false,
        isAuthenticated: true,
        user: user,
        token: token,
      );
      return user;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      rethrow;
    }
  }

  Future<UserModel> createDriverProfile({
    required String fullName,
    required String emergencyContact,
    String? email,
  }) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final user = await _repo.createDriverProfile(
        fullName: fullName,
        phone: state.pendingPhone,
        emergencyContact: emergencyContact,
        email: email,
      );
      final token = state.token ?? '';
      await _persistSession(user, token);
      state = state.copyWith(
        isLoading: false,
        isAuthenticated: true,
        user: user,
        token: token,
      );
      return user;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      rethrow;
    }
  }

  Future<void> logout() async {
    await _clearSession();
    state = const AuthState();
  }
}

// ── Public provider ───────────────────────────────────────────────────────────

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) => AuthNotifier(ref.read(authRepositoryProvider)),
);
