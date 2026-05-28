class AppConstants {
  static const appName        = 'UrbanLift';
  static const tagline        = 'Move Together, Grow Together';
  static const currency       = 'GHS';
  static const phonePrefix    = '+233';
  static const countryCode    = 'GH';
  static const txnFee         = 0.50;
  static const otpResendSecs  = 60;
  static const referralCredit = 10.0;

  static const topUpPresets = [
    {'label': 'Starter',  'amount': 10.0},
    {'label': 'Commuter', 'amount': 20.0},
    {'label': 'Regular',  'amount': 50.0},
    {'label': 'Pro',      'amount': 100.0},
  ];

  static const paymentProviders = [
    {'id': 'mtn_momo',      'label': 'MTN Mobile Money',  'ussd': '*170#'},
    {'id': 'vodafone_cash', 'label': 'Vodafone Cash',     'ussd': '*110#'},
    {'id': 'at_money',      'label': 'AT Money',          'ussd': '*110#'},
    {'id': 'card',          'label': 'Credit / Debit Card','ussd': '', 'comingSoon': true},
  ];

  static const reviewTags = [
    {'id': 'safe_driver', 'label': 'Safe driver'},
    {'id': 'clean_car',   'label': 'Clean car'},
    {'id': 'friendly',    'label': 'Friendly'},
    {'id': 'on_time',     'label': 'On time'},
    {'id': 'great_music', 'label': 'Great music'},
  ];

  static const accraLocations = [
    'East Legon',
    'Osu Oxford Street',
    'Legon Campus',
    'Airport City',
    'Accra Mall, Tetteh Quarshie',
    'Kotoka International Airport',
    'Tema Community 1',
    'Madina Station',
    'Labone',
    'Cantonments',
    'Spintex Road',
    'Ring Road Central',
    'Kwame Nkrumah Circle',
    'Accra Central',
  ];
}
