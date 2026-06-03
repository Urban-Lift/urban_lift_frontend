enum GroupPrivacy { public, private }

class GroupMember {
  final String id;
  final String fullName;
  final String? avatarUrl;

  const GroupMember({required this.id, required this.fullName, this.avatarUrl});
}

class CommunityGroup {
  final String id;
  final String name;
  final String? primaryRoute;
  final String? description;
  final GroupPrivacy privacy;
  final int memberCount;
  final bool isJoined;
  final String coverColor;
  final String createdAt;

  const CommunityGroup({
    required this.id,
    required this.name,
    this.primaryRoute,
    this.description,
    required this.privacy,
    required this.memberCount,
    required this.isJoined,
    required this.coverColor,
    required this.createdAt,
  });

  CommunityGroup copyWith({bool? isJoined, int? memberCount}) => CommunityGroup(
        id: id, name: name, primaryRoute: primaryRoute, description: description,
        privacy: privacy, coverColor: coverColor, createdAt: createdAt,
        isJoined: isJoined ?? this.isJoined,
        memberCount: memberCount ?? this.memberCount,
      );
}

class ChatMessage {
  final String id;
  final String groupId;
  final GroupMember sender;
  final String content;
  final DateTime createdAt;

  const ChatMessage({
    required this.id,
    required this.groupId,
    required this.sender,
    required this.content,
    required this.createdAt,
  });
}
