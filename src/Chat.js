import React, { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import "stream-chat-react/dist/css/index.css";
import { useAuth0 } from "./auth0";
import axios from "axios";

const apiKey = "bh38zhcjjpw5";
const sort = { last_message_at: -1 };

function ChatView() {
  const [chatClient, setChatClient] = useState(null);
  const { user } = useAuth0();

  const userEmail = user.email.replace(/([^a-z0-9_-]+)/gi, "_");
  const userId = userEmail + "_" + user.sub.slice(6, 12);

  //const filters = { type: "messaging", members: { $in: [userId] } };
  const filters = { type: "messaging" };

  useEffect(() => {
    axios
      .post("http://localhost:7000/token", {
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

  if (user.email_verified) {
    return (
      <Chat client={chatClient} theme="messaging light">
        <ChannelList filters={filters} sort={sort} />
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