export enum ENUM_SUBSCRIBE_MESSAGE_KEY {
    CONVERSATION_JOIN = 'conversation.join',
    CONVERSATION_LEAVE = 'conversation.leave',
    MESSAGE_CREATE = 'message.create',
    GROUP_GET_ONLINE_USERS = 'group.get-user-online',
    GROUP_JOIN = 'group.join',
    GROUP_LEAVE = 'group.leave',
    TYPING_START = 'typing.start',
    TYPING_STOP = 'typing.stop',
}

export enum ENUM_EMIT_MESSAGE_KEY {
    GROUP_USER_JOIN_RECEIVED = 'group.user-join.received',
    GROUP_USERS_ONLINE_RECEIVED = 'group.users-online.received',
    GROUP_USER_LEAVE_RECEIVED = 'group.user-leave.received',
    TYPING_START = 'typing.start',
    TYPING_STOP = 'typing.stop',
    CONVERSATION_CREATE_RECEIVED = 'conversation.create.received',
}
