import { MessageList as MessageListComponent } from "./message-list";
import { MessageListItem } from "./message-list-item";
import { MessageListEmpty } from "./message-list-empty";

type MessageListType = typeof MessageListComponent & {
  Item: typeof MessageListItem;
  Empty: typeof MessageListEmpty;
};

const MessageList = MessageListComponent as MessageListType;
MessageList.Item = MessageListItem;
MessageList.Empty = MessageListEmpty;

export { MessageList }; 