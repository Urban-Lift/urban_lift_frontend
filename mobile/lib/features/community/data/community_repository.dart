import 'community_models.dart';

abstract class CommunityRepository {
  Future<List<CommunityGroup>> getGroups();
  Future<List<ChatMessage>> getMessages(String groupId);
  Future<void> joinGroup(String groupId);
  Future<CommunityGroup> createGroup({required String name, String? primaryRoute, String? description, required GroupPrivacy privacy});
  Future<ChatMessage> sendMessage(String groupId, String content);
}

class MockCommunityRepository implements CommunityRepository {
  static final _me = GroupMember(id: 'usr-001', fullName: 'Kwame Mensah');
  static final _ama = GroupMember(id: 'usr-010', fullName: 'Ama Owusu');
  static final _kofi = GroupMember(id: 'usr-011', fullName: 'Kofi Asante');

  final List<CommunityGroup> _groups = [
    CommunityGroup(id: 'grp-001', name: 'East Legon Morning Commuters', primaryRoute: 'East Legon → Accra Central',
        description: 'Daily commuters heading downtown from East Legon. Share rides and save!',
        privacy: GroupPrivacy.public, memberCount: 48, isJoined: true, coverColor: 'green',
        createdAt: DateTime.now().subtract(const Duration(days: 14)).toIso8601String()),
    CommunityGroup(id: 'grp-002', name: 'Legon–Airport City Riders', primaryRoute: 'Legon Campus → Airport City',
        description: 'Students and professionals sharing rides between university and the business district.',
        privacy: GroupPrivacy.public, memberCount: 31, isJoined: true, coverColor: 'blue',
        createdAt: DateTime.now().subtract(const Duration(days: 21)).toIso8601String()),
    CommunityGroup(id: 'grp-003', name: 'Madina–Osu Weekend Crew', primaryRoute: 'Madina Station → Osu Oxford Street',
        description: 'Weekend rides from Madina to Osu. Fridays and Saturdays.',
        privacy: GroupPrivacy.private, memberCount: 12, isJoined: false, coverColor: 'purple',
        createdAt: DateTime.now().subtract(const Duration(days: 7)).toIso8601String()),
    CommunityGroup(id: 'grp-004', name: 'Airport Road Commuters', primaryRoute: 'Spintex Road → Kotoka International Airport',
        description: 'Early morning airport runs along the Airport Road corridor.',
        privacy: GroupPrivacy.public, memberCount: 64, isJoined: false, coverColor: 'amber',
        createdAt: DateTime.now().subtract(const Duration(days: 45)).toIso8601String()),
    CommunityGroup(id: 'grp-005', name: 'Tema–Accra Express', primaryRoute: 'Tema Community 1 → Accra Central',
        description: 'Daily commuters between Tema and Accra. 6:30am and 5:30pm schedules.',
        privacy: GroupPrivacy.public, memberCount: 92, isJoined: false, coverColor: 'teal',
        createdAt: DateTime.now().subtract(const Duration(days: 60)).toIso8601String()),
  ];

  final Map<String, List<ChatMessage>> _messages = {
    'grp-001': [
      ChatMessage(id: 'msg-001', groupId: 'grp-001', sender: _ama,  content: 'Good morning everyone! Anyone heading to town by 7:30?', createdAt: DateTime.now().subtract(const Duration(minutes: 45))),
      ChatMessage(id: 'msg-002', groupId: 'grp-001', sender: _kofi, content: 'I can do 7:15 from East Legon junction. 3 seats available.', createdAt: DateTime.now().subtract(const Duration(minutes: 42))),
      ChatMessage(id: 'msg-003', groupId: 'grp-001', sender: _me,   content: "Count me in! I'll be at the junction by 7:10.", createdAt: DateTime.now().subtract(const Duration(minutes: 40))),
      ChatMessage(id: 'msg-004', groupId: 'grp-001', sender: _ama,  content: 'Perfect. See you all there 👍', createdAt: DateTime.now().subtract(const Duration(minutes: 38))),
      ChatMessage(id: 'msg-005', groupId: 'grp-001', sender: _kofi, content: "Just a reminder — no AC on the way back today, car is getting serviced.", createdAt: DateTime.now().subtract(const Duration(minutes: 15))),
      ChatMessage(id: 'msg-006', groupId: 'grp-001', sender: _me,   content: "No worries, we'll survive 😅", createdAt: DateTime.now().subtract(const Duration(minutes: 12))),
    ],
    'grp-002': [
      ChatMessage(id: 'msg-010', groupId: 'grp-002', sender: _kofi, content: 'Leaving Legon at 8am tomorrow. Who needs a ride to Airport City?', createdAt: DateTime.now().subtract(const Duration(hours: 2))),
      ChatMessage(id: 'msg-011', groupId: 'grp-002', sender: _ama,  content: 'Me please! Can you pick up from the main gate?', createdAt: DateTime.now().subtract(const Duration(minutes: 115))),
      ChatMessage(id: 'msg-012', groupId: 'grp-002', sender: _kofi, content: 'Sure, main gate at 8:05.', createdAt: DateTime.now().subtract(const Duration(minutes: 110))),
    ],
  };

  @override
  Future<List<CommunityGroup>> getGroups() async {
    await Future.delayed(const Duration(milliseconds: 700));
    return List.unmodifiable(_groups);
  }

  @override
  Future<List<ChatMessage>> getMessages(String groupId) async {
    await Future.delayed(const Duration(milliseconds: 600));
    return List.unmodifiable(_messages[groupId] ?? []);
  }

  @override
  Future<void> joinGroup(String groupId) async {
    await Future.delayed(const Duration(milliseconds: 500));
    final idx = _groups.indexWhere((g) => g.id == groupId);
    if (idx != -1) {
      _groups[idx] = _groups[idx].copyWith(isJoined: true, memberCount: _groups[idx].memberCount + 1);
    }
  }

  @override
  Future<CommunityGroup> createGroup({required String name, String? primaryRoute, String? description, required GroupPrivacy privacy}) async {
    await Future.delayed(const Duration(milliseconds: 900));
    final group = CommunityGroup(
      id: 'grp-${DateTime.now().millisecondsSinceEpoch}',
      name: name, primaryRoute: primaryRoute, description: description,
      privacy: privacy, memberCount: 1, isJoined: true, coverColor: 'green',
      createdAt: DateTime.now().toIso8601String(),
    );
    _groups.insert(0, group);
    _messages[group.id] = [];
    return group;
  }

  @override
  Future<ChatMessage> sendMessage(String groupId, String content) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final msg = ChatMessage(
      id: 'msg-${DateTime.now().millisecondsSinceEpoch}',
      groupId: groupId, sender: _me, content: content, createdAt: DateTime.now(),
    );
    _messages.putIfAbsent(groupId, () => []).add(msg);
    return msg;
  }
}
