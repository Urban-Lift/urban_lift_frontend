import 'auth_models.dart';

abstract class AuthRepository {
  Future<void> sendOTP(String phone);
  Future<String> verifyPhoneOTP(String phone, String code);
  Future<void> sendEmailCode(String email);
  Future<void> verifyEmailCode(String email, String code);
  Future<UserModel> createPassengerProfile({
    required String fullName,
    required String phone,
    required String emergencyContact,
    String? email,
  });
  Future<UserModel> createDriverProfile({
    required String fullName,
    required String phone,
    required String emergencyContact,
    String? email,
  });
}

// ── Mock implementation ───────────────────────────────────────────────────────

Future<void> _delay(int ms) =>
    Future.delayed(Duration(milliseconds: ms));

class MockAuthRepository implements AuthRepository {
  @override
  Future<void> sendOTP(String phone) => _delay(900);

  @override
  Future<String> verifyPhoneOTP(String phone, String code) async {
    await _delay(700);
    if (code.length != 6) throw Exception('Invalid OTP. Please check and try again.');
    return 'mock-token-${DateTime.now().millisecondsSinceEpoch}';
  }

  @override
  Future<void> sendEmailCode(String email) => _delay(700);

  @override
  Future<void> verifyEmailCode(String email, String code) async {
    await _delay(700);
    if (code.length != 6) throw Exception('Invalid code. Please check and try again.');
  }

  @override
  Future<UserModel> createPassengerProfile({
    required String fullName,
    required String phone,
    required String emergencyContact,
    String? email,
  }) async {
    await _delay(1000);
    return UserModel(
      id: 'usr-${DateTime.now().millisecondsSinceEpoch}',
      phoneNumber: phone,
      fullName: fullName,
      role: 'passenger',
      email: email,
      emergencyContact: emergencyContact,
      isPhoneVerified: true,
      avgRating: 0.0,
      totalRatings: 0,
      referralCode: 'UL${fullName.split(' ').first.toUpperCase()}10',
      isActive: true,
    );
  }

  @override
  Future<UserModel> createDriverProfile({
    required String fullName,
    required String phone,
    required String emergencyContact,
    String? email,
  }) async {
    await _delay(1000);
    return UserModel(
      id: 'usr-${DateTime.now().millisecondsSinceEpoch}',
      phoneNumber: phone,
      fullName: fullName,
      role: 'driver',
      email: email,
      emergencyContact: emergencyContact,
      isPhoneVerified: true,
      avgRating: 0.0,
      totalRatings: 0,
      referralCode: 'UL${fullName.split(' ').first.toUpperCase()}DR',
      isActive: true,
    );
  }
}
