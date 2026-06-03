class UserModel {
  const UserModel({
    required this.id,
    required this.phoneNumber,
    required this.fullName,
    required this.role,
    this.email,
    this.profilePhotoUrl,
    this.emergencyContact = '',
    this.isPhoneVerified = false,
    this.isEmailVerified = false,
    this.avgRating = 0.0,
    this.totalRatings = 0,
    this.referralCode,
    this.isActive = true,
  });

  final String id;
  final String phoneNumber;
  final String fullName;
  final String role; // 'passenger' | 'driver'
  final String? email;
  final String? profilePhotoUrl;
  final String emergencyContact;
  final bool isPhoneVerified;
  final bool isEmailVerified;
  final double avgRating;
  final int totalRatings;
  final String? referralCode;
  final bool isActive;

  UserModel copyWith({
    String? id,
    String? phoneNumber,
    String? fullName,
    String? role,
    String? email,
    String? profilePhotoUrl,
    String? emergencyContact,
    bool? isPhoneVerified,
    bool? isEmailVerified,
    double? avgRating,
    int? totalRatings,
    String? referralCode,
    bool? isActive,
  }) =>
      UserModel(
        id: id ?? this.id,
        phoneNumber: phoneNumber ?? this.phoneNumber,
        fullName: fullName ?? this.fullName,
        role: role ?? this.role,
        email: email ?? this.email,
        profilePhotoUrl: profilePhotoUrl ?? this.profilePhotoUrl,
        emergencyContact: emergencyContact ?? this.emergencyContact,
        isPhoneVerified: isPhoneVerified ?? this.isPhoneVerified,
        isEmailVerified: isEmailVerified ?? this.isEmailVerified,
        avgRating: avgRating ?? this.avgRating,
        totalRatings: totalRatings ?? this.totalRatings,
        referralCode: referralCode ?? this.referralCode,
        isActive: isActive ?? this.isActive,
      );
}

class AuthState {
  const AuthState({
    this.isAuthenticated = false,
    this.user,
    this.token,
    this.pendingPhone = '',
    this.pendingRole = 'passenger',
    this.pendingEmail = '',
    this.isLoading = false,
    this.error,
  });

  final bool isAuthenticated;
  final UserModel? user;
  final String? token;
  final String pendingPhone;
  final String pendingRole;
  final String pendingEmail;
  final bool isLoading;
  final String? error;

  AuthState copyWith({
    bool? isAuthenticated,
    UserModel? user,
    String? token,
    String? pendingPhone,
    String? pendingRole,
    String? pendingEmail,
    bool? isLoading,
    String? error,
    bool clearError = false,
    bool clearUser = false,
  }) =>
      AuthState(
        isAuthenticated: isAuthenticated ?? this.isAuthenticated,
        user: clearUser ? null : (user ?? this.user),
        token: token ?? this.token,
        pendingPhone: pendingPhone ?? this.pendingPhone,
        pendingRole: pendingRole ?? this.pendingRole,
        pendingEmail: pendingEmail ?? this.pendingEmail,
        isLoading: isLoading ?? this.isLoading,
        error: clearError ? null : (error ?? this.error),
      );
}
