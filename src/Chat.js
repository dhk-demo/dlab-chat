import React, { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  ChannelPreviewUIComponentProps,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  useChatContext,
  Window,
} from "stream-chat-react";

import "stream-chat-react/dist/css/index.css";
import "./App.css";

import { useAuth0 } from "./auth0";
import axios from "axios";

const apiKey = process.env.REACT_APP_STREAM_API_KEY;
const tokenUrl = process.env.REACT_APP_TOKEN_URL;
const baseUrl = process.env.REACT_APP_BASE_URL;
const sort = { last_message_at: -1 };

function ChatView() {
  const [chatClient, setChatClient] = useState(null);
  const { user, logout } = useAuth0();

  const userEmail = user.email.replace(/([^a-z0-9_-]+)/gi, "_");
  const userId = userEmail + "_" + user.sub.slice(6, 12);

  const filters = { type: "messaging", members: { $in: [userId] } };

  useEffect(() => {
    axios
      .post(tokenUrl, {
        username: userId,
      })
      .then(
        (response) => {
          //console.log(response);
          const userToken = response.data.token;

          const initChat = async () => {
            const client = StreamChat.getInstance(apiKey);
            await client.connectUser(
              {
                id: userId,
                name: userEmail,
                image:
                  "https://getstream.io/random_png/?id=polished-brook-8&name=polished-brook-8",
              },
              userToken
            );

            setChatClient(client);
          };

          initChat();
        },
        (error) => {
          console.log(error);
        }
      );
  }, [userEmail, userId]);

  if (!chatClient) {
    return <LoadingIndicator />;
  }

  async function userLogout() {
    await chatClient.disconnectUser();
    logout({ returnTo: baseUrl });
  }

  const CustomList = (props: PropsWithChildren<ChannelListMessengerProps>) => {
    const {
      children,
      error,
      loading,
      LoadingErrorIndicator,
      LoadingIndicator,
    } = props;

    if (error) {
      return <LoadingErrorIndicator type={"connection"} />;
    }

    if (loading) {
      return <LoadingIndicator />;
    }

    return (
      <div className="str-chat__channel-list-messenger">
        <div className="str-chat__channel-list-messenger__main">{children}</div>
        <div>
          <button className="logout-button" onClick={() => userLogout()}>
            Logout
          </button>
        </div>
      </div>
    );
  };

  const CustomErrorIndicator = (props: ChatDownProps) => {
    const { text } = props;

    return <div>{text}</div>;
  };

  const CustomPreview = (props: ChannelPreviewUIComponentProps) => {
    const { channel, setActiveChannel } = props;

    const { channel: activeChannel } = useChatContext();

    const selected = channel?.id === activeChannel?.id;

    const renderMessageText = () => {
      const lastMessageText =
        channel.state.messages[channel.state.messages.length - 1].text;

      const text = lastMessageText || "message text";

      return text.length < 60 ? lastMessageText : `${text.slice(0, 70)}...`;
    };

    if (!channel.state.messages.length) return null;

    return (
      <div
        className={
          selected
            ? "channel-preview__container selected"
            : "channel-preview__container"
        }
        onClick={() => setActiveChannel(channel)}
      >
        <div className="channel-preview__content-wrapper">
          <div className="channel-preview__content-top">
            <p className="channel-preview__content-name">
              {channel.data?.name || "Channel"}
            </p>
            <p className="channel-preview__content-name">
              {channel.data?.subtitle}
            </p>
          </div>
          <p className="channel-preview__content-message">
            {renderMessageText()}
          </p>
        </div>
      </div>
    );
  };

  if (user.email_verified) {
    return (
      <Chat client={chatClient} theme="messaging light">
        <ChannelList
          Preview={CustomPreview}
          List={CustomList}
          LoadingErrorIndicator={() => (
            <CustomErrorIndicator
              text={"Loading Error - check your connection."}
              type={"connection"}
            />
          )}
          filters={filters}
          sort={sort}
        />
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    );
  }

  return <div>User not verified.</div>;
}

export default ChatView;